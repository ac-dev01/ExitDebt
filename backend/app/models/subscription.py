"""Subscription model — tracks user tier, billing period, and trial/active/expired status."""

import uuid
from datetime import datetime, timedelta
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship

from app.database import Base


class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    tier = Column(String(20), nullable=True)  # 'lite' | 'shield' | null (trial)
    billing_period = Column(String(10), nullable=False, default="monthly")  # 'monthly' | 'annual'
    amount_paid = Column(Integer, nullable=False, default=0)  # Amount in paise
    payment_ref = Column(String(255), nullable=True)  # Setu payment link ID / UPI txn ref
    subscribed_at = Column(DateTime, nullable=True)  # When payment was confirmed
    status = Column(String(20), nullable=False, default="trial")  # trial | active | expired | cancelled
    trial_ends_at = Column(
        DateTime,
        nullable=False,
        default=lambda: datetime.utcnow() + timedelta(days=90),
    )
    expires_at = Column(DateTime, nullable=True)  # Next billing date for active subs
    upgrade_history = Column(JSONB, nullable=False, default=list)  # [{from, to, date, reason}]
    shield_consent_timestamp = Column(DateTime, nullable=True)  # Required for Shield tier
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", back_populates="subscriptions")
