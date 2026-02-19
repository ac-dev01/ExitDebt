"""Health check endpoints — trigger CIBIL pull and compute debt health score."""

import json
from datetime import datetime
from uuid import UUID

from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.health_check import (
    HealthCheckRequest,
    HealthCheckResponse,
    DebtAccountResponse,
    FlaggedAccount,
)
from app.models.user import User
from app.models.cibil_report import CibilReport
from app.models.debt_account import DebtAccount
from app.models.health_score import HealthScore as HealthScoreModel
from app.services.health_score import calculate_health_score
from app.integrations.mock_providers import MockCIBILService, MockWhatsAppService
from app.utils.security import hash_pan, encrypt_data, mask_pan
from app.utils.rate_limiter import rate_limiter
from app.utils.audit import log_event

router = APIRouter(prefix="/api/health-check", tags=["Health Check"])

# Service instances (use DI pattern for production)
_cibil_service = MockCIBILService()
_whatsapp_service = MockWhatsAppService()


@router.post("", response_model=HealthCheckResponse)
async def create_health_check(
    payload: HealthCheckRequest,
    request: Request,
    db: Session = Depends(get_db),
):
    """
    Run a full health check:
    1. Validate PAN & consent
    2. Rate limit check
    3. Create/find user
    4. Pull CIBIL report
    5. Compute health score
    6. Return results
    """
    client_ip = request.client.host if request.client else "unknown"

    # Validate PAN format
    if not payload.validate_pan():
        raise HTTPException(status_code=400, detail="Invalid PAN format. Expected: ABCDE1234F")

    if not payload.consent:
        raise HTTPException(status_code=400, detail="Consent is required to perform a credit check.")

    # Rate limiting
    if not rate_limiter.is_allowed(payload.phone):
        log_event(
            db=db,
            event_type="cibil_pull_rate_limited",
            phone=payload.phone,
            ip_address=client_ip,
        )
        remaining = rate_limiter.remaining(payload.phone)
        raise HTTPException(
            status_code=429,
            detail=f"Rate limit exceeded. Maximum 3 credit checks per 24 hours. Remaining: {remaining}",
        )

    # Hash PAN — never store raw
    pan_hashed = hash_pan(payload.pan)

    # Create or find user
    user = db.query(User).filter(User.pan_hash == pan_hashed, User.phone == payload.phone).first()
    if not user:
        user = User(
            pan_hash=pan_hashed,
            phone=payload.phone,
            name=payload.name,
            consent_ts=datetime.utcnow(),
            consent_ip=client_ip,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    # Pull CIBIL report
    try:
        cibil_data = await _cibil_service.pull_report(
            pan=payload.pan,
            name=payload.name,
            phone=payload.phone,
        )
    except Exception as e:
        log_event(
            db=db,
            event_type="cibil_pull",
            user_id=user.id,
            phone=payload.phone,
            ip_address=client_ip,
            metadata={"status": "error", "error": str(e)},
        )
        raise HTTPException(status_code=502, detail="Failed to fetch credit report. Please try again later.")

    # Record rate limit
    rate_limiter.record(payload.phone)

    # Encrypt and store raw CIBIL data
    encrypted_raw = encrypt_data(cibil_data.get("raw_data", "{}"))
    report = CibilReport(
        user_id=user.id,
        raw_encrypted=encrypted_raw,
        credit_score=cibil_data.get("credit_score"),
    )
    db.add(report)
    db.commit()
    db.refresh(report)

    # Store debt accounts
    accounts_data = cibil_data.get("accounts", [])
    for acc in accounts_data:
        debt_account = DebtAccount(
            report_id=report.id,
            lender_name=acc["lender_name"],
            account_type=acc["account_type"],
            outstanding=acc["outstanding"],
            interest_rate=acc.get("interest_rate"),
            emi_amount=acc.get("emi_amount"),
            status=acc.get("status", "active"),
        )
        db.add(debt_account)
    db.commit()

    # Calculate health score
    score_result = calculate_health_score(accounts_data)

    # Store health score
    health_score = HealthScoreModel(
        user_id=user.id,
        score=score_result.score,
        dti_ratio=score_result.dti_ratio,
        avg_rate=score_result.avg_rate,
        savings_est=score_result.savings_est,
    )
    db.add(health_score)
    db.commit()
    db.refresh(health_score)

    # Audit log
    log_event(
        db=db,
        event_type="cibil_pull",
        user_id=user.id,
        phone=payload.phone,
        ip_address=client_ip,
        metadata={"status": "success", "score": score_result.score},
    )

    # WhatsApp share link
    share_text = (
        f"I checked my Debt Health Score on ExitDebt — scored {score_result.score}/100 "
        f"({score_result.category}). Check yours: https://exitdebt.in/check"
    )
    share_link = _whatsapp_service.generate_share_link(share_text)

    # Build response
    debt_responses = [
        DebtAccountResponse(
            id=str(da.id),
            lender_name=da.lender_name,
            account_type=da.account_type,
            outstanding=da.outstanding,
            interest_rate=da.interest_rate,
            emi_amount=da.emi_amount,
            status=da.status,
        )
        for da in db.query(DebtAccount).filter(DebtAccount.report_id == report.id).all()
    ]

    flagged_responses = [
        FlaggedAccount(**f) for f in score_result.flagged_accounts
    ]

    return HealthCheckResponse(
        id=str(health_score.id),
        score=score_result.score,
        category=score_result.category,
        credit_score=cibil_data.get("credit_score"),
        total_outstanding=score_result.total_outstanding,
        total_emi=score_result.total_emi,
        avg_rate=score_result.avg_rate,
        dti_ratio=score_result.dti_ratio,
        savings_est=score_result.savings_est,
        debt_accounts=debt_responses,
        flagged_accounts=flagged_responses,
        whatsapp_share_link=share_link,
    )


@router.get("/{health_check_id}", response_model=HealthCheckResponse)
async def get_health_check(health_check_id: str, db: Session = Depends(get_db)):
    """Retrieve an existing health check result by ID."""
    try:
        check_uuid = UUID(health_check_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid health check ID format.")

    health_score = db.query(HealthScoreModel).filter(HealthScoreModel.id == check_uuid).first()
    if not health_score:
        raise HTTPException(status_code=404, detail="Health check not found.")

    # Get user
    user = db.query(User).filter(User.id == health_score.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    # Get latest CIBIL report
    report = (
        db.query(CibilReport)
        .filter(CibilReport.user_id == user.id)
        .order_by(CibilReport.pulled_at.desc())
        .first()
    )

    debt_accounts = []
    if report:
        debt_accounts = [
            DebtAccountResponse(
                id=str(da.id),
                lender_name=da.lender_name,
                account_type=da.account_type,
                outstanding=da.outstanding,
                interest_rate=da.interest_rate,
                emi_amount=da.emi_amount,
                status=da.status,
            )
            for da in db.query(DebtAccount).filter(DebtAccount.report_id == report.id).all()
        ]

    # WhatsApp share link
    share_text = (
        f"I checked my Debt Health Score on ExitDebt — scored {health_score.score}/100. "
        f"Check yours: https://exitdebt.in/check"
    )
    share_link = _whatsapp_service.generate_share_link(share_text)

    return HealthCheckResponse(
        id=str(health_score.id),
        score=health_score.score,
        category=(
            "Healthy" if health_score.score >= 85
            else "Fair" if health_score.score >= 65
            else "Needs Attention" if health_score.score >= 40
            else "Critical"
        ),
        credit_score=report.credit_score if report else None,
        total_outstanding=sum(da.outstanding for da in (db.query(DebtAccount).filter(DebtAccount.report_id == report.id).all() if report else [])),
        total_emi=sum(da.emi_amount or 0 for da in (db.query(DebtAccount).filter(DebtAccount.report_id == report.id).all() if report else [])),
        avg_rate=health_score.avg_rate or 0,
        dti_ratio=health_score.dti_ratio,
        savings_est=health_score.savings_est or 0,
        debt_accounts=debt_accounts,
        flagged_accounts=[],
        whatsapp_share_link=share_link,
    )
