"""ServiceRequest schemas."""

from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class ServiceRequestCreate(BaseModel):
    user_id: str = Field(..., description="User UUID")
    type: str = Field(..., description="'harassment' or 'creditor_comms'")
    details: Optional[str] = Field(None, description="Freeform details")


class ServiceRequestResponse(BaseModel):
    id: str
    user_id: str
    type: str
    status: str
    details: Optional[str]
    assigned_to: Optional[str]
    created_at: datetime
    resolved_at: Optional[datetime]


class ServiceRequestListResponse(BaseModel):
    requests: list[ServiceRequestResponse]
    total: int
