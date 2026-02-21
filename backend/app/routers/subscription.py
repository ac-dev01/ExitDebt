"""Subscription API endpoints.

Provides plan listing, subscription status checks, and tier upgrades.
"""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.shield_consent import ShieldConsent
from app.schemas.subscription import (
    PlansResponse,
    PlanPricing,
    SettlementPricing,
    SubscriptionStatusResponse,
    SubscriptionUpgradeRequest,
    SubscriptionUpgradeResponse,
)
from app.services.subscription_service import (
    PLANS,
    SETTLEMENT_PRICING,
    get_or_create_subscription,
    upgrade_subscription,
    compute_days_remaining,
)
from app.utils.audit import log_event

router = APIRouter(prefix="/api/subscription", tags=["Subscription"])


@router.get("/plans", response_model=PlansResponse)
async def list_plans():
    """Return all available subscription plans with pricing."""
    return PlansResponse(
        lite=PlanPricing(**PLANS["lite"]),
        shield=PlanPricing(**PLANS["shield"]),
        settlement=SettlementPricing(**SETTLEMENT_PRICING),
    )


@router.get("/status/{user_id}", response_model=SubscriptionStatusResponse)
async def get_subscription_status(
    user_id: str,
    db: Session = Depends(get_db),
):
    """Get current subscription status for a user."""
    try:
        uid = UUID(user_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid user ID format.")

    user = db.query(User).filter(User.id == uid).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    sub = get_or_create_subscription(db, uid)

    # Compute days remaining based on status
    if sub.status == "trial":
        days = compute_days_remaining(sub.trial_ends_at)
    elif sub.status == "active" and sub.expires_at:
        days = max(0, (sub.expires_at - __import__("datetime").datetime.utcnow()).days)
    else:
        days = 0

    return SubscriptionStatusResponse(
        id=str(sub.id),
        user_id=str(sub.user_id),
        tier=sub.tier,
        status=sub.status,
        billing_period=sub.billing_period,
        trial_ends_at=sub.trial_ends_at,
        expires_at=sub.expires_at,
        days_remaining=days,
        created_at=sub.created_at,
    )


@router.post("/upgrade", response_model=SubscriptionUpgradeResponse)
async def upgrade_tier(
    payload: SubscriptionUpgradeRequest,
    request: Request,
    db: Session = Depends(get_db),
):
    """Upgrade a user's subscription tier.

    Handles: trial → paid, Lite → Shield, period changes.
    Shield requires prior consent via /api/subscription/shield-consent.
    """
    try:
        uid = UUID(payload.user_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid user ID format.")

    user = db.query(User).filter(User.id == uid).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    try:
        sub = upgrade_subscription(db, uid, payload.tier, payload.billing_period)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Audit
    client_ip = request.client.host if request.client else None
    log_event(
        db=db,
        event_type="subscription_upgrade",
        user_id=uid,
        phone=user.phone,
        ip_address=client_ip,
        metadata={
            "tier": sub.tier,
            "period": sub.billing_period,
            "amount": sub.amount_paid,
        },
    )

    return SubscriptionUpgradeResponse(
        id=str(sub.id),
        user_id=str(sub.user_id),
        tier=sub.tier,
        status=sub.status,
        billing_period=sub.billing_period,
        amount_paid=sub.amount_paid,
        expires_at=sub.expires_at,
        message=f"Successfully upgraded to {sub.tier.capitalize()} ({sub.billing_period}).",
    )


@router.post("/shield-consent")
async def record_shield_consent(
    user_id: str,
    request: Request,
    db: Session = Depends(get_db),
):
    """Record explicit Shield consent: 'I authorize ExitDebt to communicate
    with my creditors on my behalf.'

    Must be called before upgrading to Shield tier.
    """
    try:
        uid = UUID(user_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid user ID format.")

    user = db.query(User).filter(User.id == uid).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    client_ip = request.client.host if request.client else "unknown"

    consent = ShieldConsent(
        user_id=uid,
        consent_text_version="1.0",
        ip_address=client_ip,
    )
    db.add(consent)
    db.commit()
    db.refresh(consent)

    # Also update the subscription record
    sub = get_or_create_subscription(db, uid)
    sub.shield_consent_timestamp = consent.timestamp
    db.commit()

    log_event(
        db=db,
        event_type="shield_consent",
        user_id=uid,
        phone=user.phone,
        ip_address=client_ip,
        metadata={"consent_version": "1.0"},
    )

    return {
        "message": "Shield consent recorded.",
        "consent_id": str(consent.id),
        "timestamp": consent.timestamp.isoformat(),
    }
