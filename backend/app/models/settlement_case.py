"""SettlementCase model — tracks one-time debt settlement service workflows."""

import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class SettlementCase(Base):
    __tablename__ = "settlement_cases"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    total_debt = Column(Integer, nullable=False)  # In paise; must be >= ₹1,00,000 (10000000 paise)
    target_amount = Column(Integer, nullable=True)  # Negotiation target in paise
    status = Column(
        String(20), nullable=False, default="intake"
    )  # intake | negotiating | settled | closed
    settled_amount = Column(Integer, nullable=True)  # Actual settled amount in paise
    fee_amount = Column(Integer, nullable=True)  # 10% + GST computed on settlement
    assigned_to = Column(String(255), nullable=True)  # Internal team member
    started_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    settled_at = Column(DateTime, nullable=True)

    # Relationships
    user = relationship("User", back_populates="settlement_cases")
