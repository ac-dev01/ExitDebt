"""Callback request/response schemas."""

from pydantic import BaseModel, Field
from datetime import datetime


class CallbackRequest(BaseModel):
    user_id: str = Field(..., description="User UUID")
    preferred_time: datetime = Field(..., description="Preferred callback time")


class CallbackResponse(BaseModel):
    id: str
    user_id: str
    preferred_time: datetime
    status: str
    message: str
