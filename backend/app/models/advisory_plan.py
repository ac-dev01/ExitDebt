"""Advisory Plan model."""

import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSON
from sqlalchemy.orm import relationship

from app.database import Base


class AdvisoryPlan(Base):
    __tablename__ = "advisory_plans"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    tier = Column(String(30), nullable=False)  # basic, standard, premium
    price = Column(Float, nullable=False)
    status = Column(String(30), nullable=False, default="pending")  # pending, paid, active, expired
    plan_data_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", back_populates="advisory_plans")
