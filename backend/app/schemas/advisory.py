"""Advisory plan request/response schemas."""

from pydantic import BaseModel, Field
from typing import Optional, Dict, Any


class AdvisoryPurchaseRequest(BaseModel):
    user_id: str = Field(..., description="User UUID")
    tier: str = Field(..., description="Plan tier: basic, standard, or premium")


class AdvisoryResponse(BaseModel):
    id: str
    user_id: str
    tier: str
    price: float
    status: str
    plan_data: Optional[Dict[str, Any]] = None
    payment_url: Optional[str] = None
    message: str
