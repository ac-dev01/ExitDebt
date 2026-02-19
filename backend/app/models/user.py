"""User model."""

import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    pan_hash = Column(String(64), nullable=False, index=True)  # SHA-256 hex digest
    phone = Column(String(15), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    consent_ts = Column(DateTime, nullable=False)
    consent_ip = Column(String(45), nullable=False)  # IPv6 max length
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    cibil_reports = relationship("CibilReport", back_populates="user", cascade="all, delete-orphan")
    health_scores = relationship("HealthScore", back_populates="user", cascade="all, delete-orphan")
    callbacks = relationship("Callback", back_populates="user", cascade="all, delete-orphan")
    advisory_plans = relationship("AdvisoryPlan", back_populates="user", cascade="all, delete-orphan")
