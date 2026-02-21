"""ServiceRequest model — tracks Shield service requests (harassment, creditor comms)."""

import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class ServiceRequest(Base):
    __tablename__ = "service_requests"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    type = Column(String(30), nullable=False)  # 'harassment' | 'creditor_comms'
    status = Column(String(20), nullable=False, default="open")  # open | active | resolved
    details = Column(Text, nullable=True)
    assigned_to = Column(String(255), nullable=True)  # CRM agent name
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    resolved_at = Column(DateTime, nullable=True)

    # Relationships
    user = relationship("User", back_populates="service_requests")
