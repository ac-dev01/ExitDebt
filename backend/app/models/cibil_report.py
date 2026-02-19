"""CIBIL Report model with encrypted raw data."""

import uuid
from datetime import datetime, timedelta
from sqlalchemy import Column, String, Integer, DateTime, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class CibilReport(Base):
    __tablename__ = "cibil_reports"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    raw_encrypted = Column(Text, nullable=True)  # AES-256 encrypted raw CIBIL data
    credit_score = Column(Integer, nullable=True)
    pulled_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    expires_at = Column(
        DateTime,
        default=lambda: datetime.utcnow() + timedelta(days=30),
        nullable=False,
    )

    # Relationships
    user = relationship("User", back_populates="cibil_reports")
    debt_accounts = relationship("DebtAccount", back_populates="report", cascade="all, delete-orphan")
