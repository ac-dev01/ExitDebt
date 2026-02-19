"""Audit logging utility for security-sensitive events."""

from datetime import datetime
from typing import Optional
from uuid import UUID

from sqlalchemy.orm import Session
from app.models.audit_log import AuditLog


def log_event(
    db: Session,
    event_type: str,
    user_id: Optional[UUID] = None,
    phone: Optional[str] = None,
    ip_address: Optional[str] = None,
    metadata: Optional[dict] = None,
) -> AuditLog:
    """
    Log a security-auditable event.

    Event types:
        - otp_send: OTP requested
        - otp_verify_success: OTP verified successfully
        - otp_verify_fail: OTP verification failed
        - cibil_pull: CIBIL report pulled
        - cibil_pull_rate_limited: Rate limit hit for CIBIL pull
        - callback_request: Callback scheduled
        - advisory_purchase: Advisory plan purchased
        - user_delete_request: User requested data deletion
    """
    audit = AuditLog(
        event_type=event_type,
        user_id=user_id,
        phone=phone,
        ip_address=ip_address,
        metadata_json=metadata or {},
        created_at=datetime.utcnow(),
    )
    db.add(audit)
    db.commit()
    db.refresh(audit)
    return audit
