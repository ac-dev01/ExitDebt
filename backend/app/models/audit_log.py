"""Audit Log model for security tracking."""

import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID, JSON

from app.database import Base


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    event_type = Column(String(50), nullable=False, index=True)  # otp_attempt, cibil_pull, callback_request, etc.
    user_id = Column(UUID(as_uuid=True), nullable=True, index=True)  # nullable for pre-auth events
    phone = Column(String(15), nullable=True)
    ip_address = Column(String(45), nullable=True)
    metadata_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
