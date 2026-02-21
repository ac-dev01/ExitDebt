"""ShieldConsent model — stores explicit consent for creditor communication (separate from general consent)."""

import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class ShieldConsent(Base):
    __tablename__ = "shield_consents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    consent_text_version = Column(String(20), nullable=False, default="1.0")
    ip_address = Column(String(45), nullable=False)  # IPv6 max length
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", back_populates="shield_consents")
