"""Subscription business logic.

Handles plan pricing, tier upgrades, trial management, and proration.
Phase 1: Mock payment — charges logged but not processed.
"""

import logging
from datetime import datetime, timedelta
from uuid import UUID

from sqlalchemy.orm import Session

from app.models.subscription import Subscription
from app.models.shield_consent import ShieldConsent

logger = logging.getLogger(__name__)

# ─── Plan pricing ────────────────────────────────────────────────────────────

PLANS = {
    "lite": {"monthly": 499, "annual": 4999, "annual_savings_pct": 17},
    "shield": {"monthly": 1999, "annual": 14999, "annual_savings_pct": 37},
}

SETTLEMENT_PRICING = {"fee": "10% + GST", "min_debt": 100000}

VALID_TIERS = {"lite", "shield"}
VALID_PERIODS = {"monthly", "annual"}


# ─── Helpers ─────────────────────────────────────────────────────────────────

def compute_expiry(period: str) -> datetime:
    """Compute subscription expiry from now based on billing period."""
    if period == "annual":
        return datetime.utcnow() + timedelta(days=365)
    return datetime.utcnow() + timedelta(days=30)


def compute_days_remaining(trial_ends_at: datetime) -> int:
    """Compute days remaining in trial."""
    diff = trial_ends_at - datetime.utcnow()
    return max(0, diff.days)


def compute_prorate(subscription: Subscription) -> int:
    """Compute prorated credit for remaining time on current plan (in INR).

    Returns the credit amount that should be deducted from the upgrade cost.
    """
    if not subscription.expires_at or subscription.status != "active":
        return 0

    remaining = subscription.expires_at - datetime.utcnow()
    total_period = (
        timedelta(days=365) if subscription.billing_period == "annual"
        else timedelta(days=30)
    )

    if remaining.total_seconds() <= 0:
        return 0

    ratio = remaining / total_period
    plan_price = PLANS.get(subscription.tier, {}).get(subscription.billing_period, 0)
    return int(plan_price * ratio)


# ─── Service functions ───────────────────────────────────────────────────────

def get_or_create_subscription(db: Session, user_id: UUID) -> Subscription:
    """Get existing subscription or create a trial one."""
    sub = (
        db.query(Subscription)
        .filter(Subscription.user_id == user_id)
        .order_by(Subscription.created_at.desc())
        .first()
    )
    if sub:
        # Auto-expire trial
        if sub.status == "trial" and compute_days_remaining(sub.trial_ends_at) == 0:
            sub.status = "expired"
            db.commit()
        return sub

    # Create new trial subscription
    sub = Subscription(user_id=user_id)
    db.add(sub)
    db.commit()
    db.refresh(sub)
    return sub


def upgrade_subscription(
    db: Session,
    user_id: UUID,
    new_tier: str,
    period: str,
) -> Subscription:
    """Upgrade user to a paid tier.

    Handles: trial → active, tier change (Lite → Shield), period change.
    """
    if new_tier not in VALID_TIERS:
        raise ValueError(f"Invalid tier: {new_tier}. Must be one of {VALID_TIERS}")
    if period not in VALID_PERIODS:
        raise ValueError(f"Invalid period: {period}. Must be one of {VALID_PERIODS}")

    # Shield requires consent
    if new_tier == "shield":
        consent = (
            db.query(ShieldConsent)
            .filter(ShieldConsent.user_id == user_id)
            .order_by(ShieldConsent.timestamp.desc())
            .first()
        )
        if not consent:
            raise ValueError("Shield consent required before activation.")

    sub = get_or_create_subscription(db, user_id)
    price = PLANS[new_tier][period]

    # Calculate prorate credit if upgrading mid-cycle
    prorate_credit = 0
    if sub.status == "active" and sub.tier != new_tier:
        prorate_credit = compute_prorate(sub)

    charge_amount = max(0, price - prorate_credit)

    # Record upgrade history
    history_entry = {
        "from_tier": sub.tier,
        "to_tier": new_tier,
        "from_period": sub.billing_period,
        "to_period": period,
        "date": datetime.utcnow().isoformat(),
        "charge": charge_amount,
        "prorate_credit": prorate_credit,
    }
    if sub.upgrade_history:
        sub.upgrade_history = [*sub.upgrade_history, history_entry]
    else:
        sub.upgrade_history = [history_entry]

    # Update subscription
    sub.tier = new_tier
    sub.billing_period = period
    sub.status = "active"
    sub.amount_paid = charge_amount
    sub.expires_at = compute_expiry(period)

    # Mock payment
    logger.info(
        f"[Payment] Mock charge: ₹{charge_amount} for {new_tier}/{period} "
        f"(user={user_id}, prorate_credit=₹{prorate_credit})"
    )

    db.commit()
    db.refresh(sub)
    return sub
