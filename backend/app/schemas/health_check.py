"""Health check request/response schemas."""

from pydantic import BaseModel, Field
from typing import List, Optional
import re


class HealthCheckRequest(BaseModel):
    pan: str = Field(..., description="PAN card number", examples=["ABCDE1234F"])
    phone: str = Field(..., description="Verified phone number")
    name: str = Field(..., min_length=2, max_length=255, description="Full name")
    consent: bool = Field(..., description="User consent for credit check")

    def validate_pan(self) -> bool:
        return bool(re.match(r"^[A-Z]{5}[0-9]{4}[A-Z]$", self.pan.upper()))


class DebtAccountResponse(BaseModel):
    id: str
    lender_name: str
    account_type: str
    outstanding: float
    interest_rate: Optional[float] = None
    emi_amount: Optional[float] = None
    status: str


class FlaggedAccount(BaseModel):
    lender_name: str
    account_type: str
    reason: str
    outstanding: float


class HealthCheckResponse(BaseModel):
    id: str
    score: int
    category: str  # Healthy | Fair | Needs Attention | Critical
    credit_score: Optional[int] = None
    total_outstanding: float
    total_emi: float
    avg_rate: float
    dti_ratio: Optional[float] = None
    savings_est: float
    debt_accounts: List[DebtAccountResponse]
    flagged_accounts: List[FlaggedAccount]
    whatsapp_share_link: Optional[str] = None
