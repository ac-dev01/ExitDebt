"""Health Score model."""

import uuid
from datetime import datetime
from sqlalchemy import Column, Float, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class HealthScore(Base):
    __tablename__ = "health_scores"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    score = Column(Integer, nullable=False)
    dti_ratio = Column(Float, nullable=True)
    avg_rate = Column(Float, nullable=True)
    savings_est = Column(Float, nullable=True)
    calculated_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", back_populates="health_scores")
