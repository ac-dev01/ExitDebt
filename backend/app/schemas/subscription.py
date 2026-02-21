"""Subscription request/response schemas."""

from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


# ─── Plans (static pricing) ─────────────────────────────────────────────────

class PlanPricing(BaseModel):
    monthly: int = Field(..., description="Monthly price in INR")
    annual: int = Field(..., description="Annual price in INR")
    annual_savings_pct: int = Field(..., description="Savings percentage vs monthly")


class SettlementPricing(BaseModel):
    fee: str = Field(default="10% + GST", description="Fee structure")
    min_debt: int = Field(default=100000, description="Minimum debt in INR")


class PlansResponse(BaseModel):
    lite: PlanPricing
    shield: PlanPricing
    settlement: SettlementPricing


# ─── Subscription CRUD ──────────────────────────────────────────────────────

class SubscriptionUpgradeRequest(BaseModel):
    user_id: str = Field(..., description="User UUID")
    tier: str = Field(..., description="Target tier: 'lite' or 'shield'")
    billing_period: str = Field(..., description="'monthly' or 'annual'")


class SubscriptionStatusResponse(BaseModel):
    id: str
    user_id: str
    tier: Optional[str]
    status: str
    billing_period: str
    trial_ends_at: Optional[datetime]
    expires_at: Optional[datetime]
    days_remaining: int
    created_at: datetime


class SubscriptionUpgradeResponse(BaseModel):
    id: str
    user_id: str
    tier: str
    status: str
    billing_period: str
    amount_paid: int
    expires_at: Optional[datetime]
    message: str
