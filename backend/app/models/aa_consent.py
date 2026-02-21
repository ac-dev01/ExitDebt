"""AA Consent model — tracks Setu Account Aggregator consent requests."""

import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, ARRAY
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base


class AAConsent(Base):
    __tablename__ = "aa_consents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    setu_consent_id = Column(String, unique=True, nullable=False, index=True)
    status = Column(String, default="PENDING")  # PENDING → APPROVED → ACTIVE → REVOKED
    redirect_url = Column(String, nullable=True)
    fi_types = Column(ARRAY(String), default=["DEPOSIT", "CREDIT_CARD"])
    data_range_from = Column(DateTime, nullable=True)
    data_range_to = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    approved_at = Column(DateTime, nullable=True)

    # Relationships
    user = relationship("User", backref="aa_consents")

    def __repr__(self):
        return f"<AAConsent {self.setu_consent_id} status={self.status}>"
