"""Settlement business logic.

Handles settlement case intake, state transitions, and fee calculation.
Phase 1: CRM-backed workflow — no automated negotiation.
"""

import logging
import math
from datetime import datetime
from uuid import UUID

from sqlalchemy.orm import Session

from app.models.settlement_case import SettlementCase

logger = logging.getLogger(__name__)

MIN_DEBT_INR = 100000
FEE_RATE = 0.10  # 10%
GST_RATE = 0.18  # 18% GST on fee

# Valid state transitions
STATE_TRANSITIONS = {
    "intake": {"negotiating", "closed"},
    "negotiating": {"settled", "closed"},
    "settled": {"closed"},
    "closed": set(),  # Terminal state
}


def validate_debt_threshold(total_debt: int) -> None:
    """Validate minimum debt requirement."""
    if total_debt < MIN_DEBT_INR:
        raise ValueError(
            f"Minimum debt for settlement is ₹{MIN_DEBT_INR:,}. "
            f"Provided: ₹{total_debt:,}"
        )


def compute_fee(settled_amount: int) -> int:
    """Compute settlement fee: 10% + 18% GST.

    Returns fee in INR (rounded up).
    """
    base_fee = settled_amount * FEE_RATE
    gst = base_fee * GST_RATE
    return math.ceil(base_fee + gst)


def create_settlement_case(
    db: Session,
    user_id: UUID,
    total_debt: int,
    target_amount: int | None = None,
) -> SettlementCase:
    """Create a new settlement case after validating debt threshold.

    Prevents duplicate active cases for the same user.
    """
    validate_debt_threshold(total_debt)

    # Check for existing active case
    existing = (
        db.query(SettlementCase)
        .filter(
            SettlementCase.user_id == user_id,
            SettlementCase.status.notin_(["closed"]),
        )
        .first()
    )
    if existing:
        raise ValueError(
            f"User already has an active settlement case (ID: {existing.id}, "
            f"status: {existing.status}). Close the existing case first."
        )

    case = SettlementCase(
        user_id=user_id,
        total_debt=total_debt,
        target_amount=target_amount,
    )
    db.add(case)
    db.commit()
    db.refresh(case)

    logger.info(
        f"[Settlement] New case created: id={case.id}, user={user_id}, "
        f"debt=₹{total_debt:,}"
    )
    return case


def transition_case(
    db: Session,
    case_id: UUID,
    new_status: str,
    settled_amount: int | None = None,
    assigned_to: str | None = None,
) -> SettlementCase:
    """Transition a settlement case to a new status.

    Validates state machine transitions and computes fees on settlement.
    """
    case = db.query(SettlementCase).filter(SettlementCase.id == case_id).first()
    if not case:
        raise ValueError(f"Settlement case not found: {case_id}")

    valid_transitions = STATE_TRANSITIONS.get(case.status, set())
    if new_status not in valid_transitions:
        raise ValueError(
            f"Invalid transition: {case.status} → {new_status}. "
            f"Valid: {valid_transitions}"
        )

    # Settlement requires settled_amount
    if new_status == "settled":
        if not settled_amount or settled_amount <= 0:
            raise ValueError("settled_amount is required and must be > 0 for settlement.")
        case.settled_amount = settled_amount
        case.fee_amount = compute_fee(settled_amount)
        case.settled_at = datetime.utcnow()
        logger.info(
            f"[Settlement] Case {case_id} settled: "
            f"₹{settled_amount:,} (fee: ₹{case.fee_amount:,})"
        )

    if assigned_to:
        case.assigned_to = assigned_to

    case.status = new_status
    db.commit()
    db.refresh(case)
    return case


def get_user_settlement(db: Session, user_id: UUID) -> SettlementCase | None:
    """Get the latest settlement case for a user."""
    return (
        db.query(SettlementCase)
        .filter(SettlementCase.user_id == user_id)
        .order_by(SettlementCase.started_at.desc())
        .first()
    )
