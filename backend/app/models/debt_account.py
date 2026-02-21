"""Debt Account model."""

import uuid
from sqlalchemy import Column, String, Float, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class DebtAccount(Base):
    __tablename__ = "debt_accounts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    report_id = Column(UUID(as_uuid=True), ForeignKey("cibil_reports.id"), nullable=False, index=True)
    lender_name = Column(String(255), nullable=False)
    account_type = Column(String(50), nullable=False)  # personal_loan, credit_card, home_loan, etc.
    outstanding = Column(Float, nullable=False, default=0.0)
    interest_rate = Column(Float, nullable=True)
    emi_amount = Column(Float, nullable=True)
    due_date = Column(Integer, nullable=True)  # Day of month (1-31)
    status = Column(String(30), nullable=False, default="active")  # active, closed, overdue, written_off

    # Relationships
    report = relationship("CibilReport", back_populates="debt_accounts")
