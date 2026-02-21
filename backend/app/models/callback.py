"""Callback model."""

import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class Callback(Base):
    __tablename__ = "callbacks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    preferred_time = Column(DateTime, nullable=False)
    reason = Column(String(255), nullable=True)  # 'Settlement inquiry', 'General consultation', etc.
    status = Column(String(30), nullable=False, default="pending")  # pending, confirmed, completed, cancelled
    assigned_to = Column(String(255), nullable=True)  # CRM agent name
    called_at = Column(DateTime, nullable=True)
    outcome = Column(String(255), nullable=True)  # connected, no_answer, rescheduled, etc.
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", back_populates="callbacks")
