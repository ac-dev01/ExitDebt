"""Settlement API endpoints.

Handles settlement case intake and retrieval.
Phase 1: CRM-backed, no automated negotiation.
"""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.settlement import (
    SettlementIntakeRequest,
    SettlementIntakeResponse,
    SettlementCaseResponse,
)
from app.services.settlement_service import (
    create_settlement_case,
    get_user_settlement,
)
from app.services.callback_service import get_crm_service
from app.utils.audit import log_event

router = APIRouter(prefix="/api/settlement", tags=["Settlement"])


@router.post("/intake", response_model=SettlementIntakeResponse)
async def settlement_intake(
    payload: SettlementIntakeRequest,
    request: Request,
    db: Session = Depends(get_db),
):
    """Start a settlement case.

    Validates:
    - User exists
    - Debt >= ₹1,00,000
    - No duplicate active cases

    Creates CRM record and assigns internal owner.
    """
    try:
        uid = UUID(payload.user_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid user ID format.")

    user = db.query(User).filter(User.id == uid).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    try:
        case = create_settlement_case(
            db=db,
            user_id=uid,
            total_debt=payload.total_debt,
            target_amount=payload.target_amount,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Push to CRM
    crm_service = get_crm_service()
    try:
        await crm_service.create_lead({
            "name": user.name,
            "phone": user.phone,
            "type": "settlement_intake",
            "total_debt": payload.total_debt,
            "case_id": str(case.id),
        })
    except Exception:
        pass  # CRM failure should not block case creation

    # Audit
    client_ip = request.client.host if request.client else None
    log_event(
        db=db,
        event_type="settlement_intake",
        user_id=uid,
        phone=user.phone,
        ip_address=client_ip,
        metadata={
            "case_id": str(case.id),
            "total_debt": payload.total_debt,
        },
    )

    return SettlementIntakeResponse(
        case=SettlementCaseResponse(
            id=str(case.id),
            user_id=str(case.user_id),
            total_debt=case.total_debt,
            target_amount=case.target_amount,
            status=case.status,
            settled_amount=case.settled_amount,
            fee_amount=case.fee_amount,
            assigned_to=case.assigned_to,
            started_at=case.started_at,
            settled_at=case.settled_at,
        ),
        message="Settlement case created. Our team will contact you within 24 hours.",
    )


@router.get("/{user_id}", response_model=SettlementCaseResponse)
async def get_settlement(
    user_id: str,
    db: Session = Depends(get_db),
):
    """Get the latest settlement case for a user."""
    try:
        uid = UUID(user_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid user ID format.")

    case = get_user_settlement(db, uid)
    if not case:
        raise HTTPException(status_code=404, detail="No settlement case found for this user.")

    return SettlementCaseResponse(
        id=str(case.id),
        user_id=str(case.user_id),
        total_debt=case.total_debt,
        target_amount=case.target_amount,
        status=case.status,
        settled_amount=case.settled_amount,
        fee_amount=case.fee_amount,
        assigned_to=case.assigned_to,
        started_at=case.started_at,
        settled_at=case.settled_at,
    )
