"""User schemas."""

from pydantic import BaseModel, Field


class UserDeleteRequest(BaseModel):
    user_id: str = Field(..., description="User UUID")
    phone: str = Field(..., description="Phone for verification")


class UserResponse(BaseModel):
    success: bool
    message: str
