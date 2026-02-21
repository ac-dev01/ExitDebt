"""Settlement schemas."""

from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class SettlementIntakeRequest(BaseModel):
    user_id: str = Field(..., description="User UUID")
    total_debt: int = Field(..., ge=100000, description="Total debt in INR (min ₹1,00,000)")
    target_amount: Optional[int] = Field(None, description="Desired settlement target in INR")


class SettlementCaseResponse(BaseModel):
    id: str
    user_id: str
    total_debt: int
    target_amount: Optional[int]
    status: str
    settled_amount: Optional[int]
    fee_amount: Optional[int]
    assigned_to: Optional[str]
    started_at: datetime
    settled_at: Optional[datetime]


class SettlementIntakeResponse(BaseModel):
    case: SettlementCaseResponse
    message: str
