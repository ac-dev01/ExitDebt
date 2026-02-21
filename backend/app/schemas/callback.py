"""Callback request/response schemas."""

from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class CallbackRequest(BaseModel):
    user_id: str = Field(..., description="User UUID")
    preferred_time: datetime = Field(..., description="Preferred callback time")
    reason: Optional[str] = Field(None, description="Reason for callback (e.g. 'Settlement inquiry', 'General consultation')")


class CallbackResponse(BaseModel):
    id: str
    user_id: str
    preferred_time: datetime
    status: str
    message: str

