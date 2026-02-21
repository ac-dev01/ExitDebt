"""Setu UPI Payment service.

Supports both real Setu UPI Setu integration and mock/sandbox mode.
When SETU_UPI_PROVIDER=mock, simulates payment links and webhooks.
When SETU_UPI_PROVIDER=setu, calls the real Setu UPI APIs.

Payment Flow:
  1. Create payment link (amount, subscription tier) → get UPI link/QR
  2. User pays via any UPI app
  3. Setu sends webhook → we activate subscription
"""

import uuid
import logging
import httpx
from datetime import datetime
from typing import Optional
from app.config import get_settings

logger = logging.getLogger(__name__)

# ── Token Cache (separate from AA) ───────────────────────────────────
_upi_token_cache: dict = {"access_token": None, "expires_at": 0}


async def _get_upi_token() -> str:
    """Get or refresh Setu UPI auth token."""
    settings = get_settings()
    now = datetime.utcnow().timestamp()

    if _upi_token_cache["access_token"] and _upi_token_cache["expires_at"] > now:
        return _upi_token_cache["access_token"]

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{settings.SETU_AUTH_URL}/v1/users/login",
            json={
                "clientID": settings.SETU_UPI_CLIENT_ID,
                "secret": settings.SETU_UPI_CLIENT_SECRET,
                "grant_type": "client_credentials",
            },
            headers={"Content-Type": "application/json"},
        )
        resp.raise_for_status()
        data = resp.json()
        _upi_token_cache["access_token"] = data["access_token"]
        _upi_token_cache["expires_at"] = now + 280
        return data["access_token"]


# ── Pricing ──────────────────────────────────────────────────────────

PLAN_PRICES = {
    "lite": {"monthly": 499, "annual": 4999},
    "shield": {"monthly": 1999, "annual": 14999},
}


def get_plan_amount(tier: str, billing_period: str) -> int:
    """Get amount in INR for a given tier and billing period."""
    plan = PLAN_PRICES.get(tier, {})
    return plan.get(billing_period, 0)


# ── Mock Payment Flow ────────────────────────────────────────────────

MOCK_PAYMENTS: dict = {}


def _mock_create_payment(
    user_id: str, tier: str, billing_period: str, amount: int
) -> dict:
    """Create a mock payment link for local development."""
    payment_id = str(uuid.uuid4())
    payment = {
        "id": payment_id,
        "user_id": user_id,
        "tier": tier,
        "billing_period": billing_period,
        "amount": amount,
        "currency": "INR",
        "status": "CREATED",
        "payment_link": f"http://localhost:3000/upgrade?mock_payment={payment_id}",
        "upi_link": f"upi://pay?pa=exitdebt@setu&pn=ExitDebt&am={amount}&tn=Subscription-{tier}",
        "created_at": datetime.utcnow().isoformat(),
        "expires_at": None,
    }
    MOCK_PAYMENTS[payment_id] = payment
    logger.info(f"Mock payment created: {payment_id} for ₹{amount}")
    return payment


def _mock_confirm_payment(payment_id: str) -> dict:
    """Simulate payment confirmation in mock mode."""
    if payment_id in MOCK_PAYMENTS:
        MOCK_PAYMENTS[payment_id]["status"] = "PAYMENT_SUCCESSFUL"
        MOCK_PAYMENTS[payment_id]["paid_at"] = datetime.utcnow().isoformat()
        logger.info(f"Mock payment confirmed: {payment_id}")
    return MOCK_PAYMENTS.get(payment_id, {"error": "Payment not found"})


def _mock_get_payment(payment_id: str) -> dict:
    """Get mock payment status."""
    return MOCK_PAYMENTS.get(payment_id, {"error": "Payment not found"})


# ── Real Setu UPI API Calls ──────────────────────────────────────────

async def _setu_create_payment(
    user_id: str, tier: str, billing_period: str, amount: int
) -> dict:
    """Create a UPI payment link via Setu."""
    settings = get_settings()
    token = await _get_upi_token()

    payload = {
        "amount": {
            "currencyCode": "INR",
            "value": amount * 100,  # Setu uses paise
        },
        "merchantReferenceId": f"SUB-{user_id[:8]}-{tier}-{billing_period}",
        "billerBillID": f"exitdebt-{tier}-{uuid.uuid4().hex[:8]}",
        "amountExactness": "EXACT",
        "settlement": {"parts": [{"account": {"id": "primary"}}]},
    }

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{settings.SETU_UPI_BASE_URL}/payment-links",
            json=payload,
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json",
            },
        )
        resp.raise_for_status()
        data = resp.json()
        logger.info(f"Setu payment link created: {data.get('id')}")
        return {
            "id": data.get("id"),
            "user_id": user_id,
            "tier": tier,
            "billing_period": billing_period,
            "amount": amount,
            "currency": "INR",
            "status": data.get("status", "CREATED"),
            "payment_link": data.get("paymentLink", {}).get("shortUrl", ""),
            "upi_link": data.get("paymentLink", {}).get("upiLink", ""),
            "created_at": datetime.utcnow().isoformat(),
        }


async def _setu_get_payment(payment_id: str) -> dict:
    """Check payment status via Setu API."""
    settings = get_settings()
    token = await _get_upi_token()

    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{settings.SETU_UPI_BASE_URL}/payment-links/{payment_id}",
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json",
            },
        )
        resp.raise_for_status()
        return resp.json()


# ── Public API (auto-selects mock vs real) ───────────────────────────

async def create_payment_link(
    user_id: str, tier: str, billing_period: str
) -> dict:
    """Create a UPI payment link. Auto-selects mock or real Setu."""
    amount = get_plan_amount(tier, billing_period)
    if amount == 0:
        return {"error": f"Invalid plan: {tier}/{billing_period}"}

    settings = get_settings()
    if settings.SETU_UPI_PROVIDER == "setu" and settings.SETU_UPI_CLIENT_ID:
        return await _setu_create_payment(user_id, tier, billing_period, amount)
    return _mock_create_payment(user_id, tier, billing_period, amount)


async def get_payment_status(payment_id: str) -> dict:
    """Check payment status. Auto-selects mock or real Setu."""
    settings = get_settings()
    if settings.SETU_UPI_PROVIDER == "setu" and settings.SETU_UPI_CLIENT_ID:
        return await _setu_get_payment(payment_id)
    return _mock_get_payment(payment_id)


async def confirm_payment(payment_id: str) -> dict:
    """Confirm payment (mock only — real flow uses Setu webhooks)."""
    return _mock_confirm_payment(payment_id)


def is_payment_successful(payment: dict) -> bool:
    """Check if a payment has been completed successfully."""
    return payment.get("status") in ("PAYMENT_SUCCESSFUL", "BILL_FULFILLED")
