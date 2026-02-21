"""Payment router for UPI payment links.

Endpoints:
  POST /api/payment/create-link  – Create a UPI payment link via Setu
  GET  /api/payment/status/{id}  – Check payment status
  POST /api/payment/confirm/{id} – Mock-confirm a payment (dev only)
  POST /api/payment/webhook      – Receive Setu payment notifications
"""

import logging
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import Optional
from app.services import setu_payment_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/payment", tags=["Payments"])


# ── Schemas ──────────────────────────────────────────────────────────

class PaymentLinkRequest(BaseModel):
    user_id: str
    tier: str  # "lite" or "shield"
    billing_period: str  # "monthly" or "annual"


class PaymentLinkResponse(BaseModel):
    id: str
    user_id: str
    tier: str
    billing_period: str
    amount: int
    currency: str = "INR"
    status: str
    payment_link: str
    upi_link: str
    created_at: str


# ── Endpoints ────────────────────────────────────────────────────────

@router.post("/create-link", response_model=PaymentLinkResponse)
async def create_payment_link(req: PaymentLinkRequest):
    """Create a UPI payment link for subscription upgrade.

    In mock mode (default), returns a simulated payment link.
    In setu mode, calls the real Setu UPI API.
    """
    if req.tier not in ("lite", "shield"):
        raise HTTPException(status_code=400, detail="Invalid tier. Must be 'lite' or 'shield'.")
    if req.billing_period not in ("monthly", "annual"):
        raise HTTPException(status_code=400, detail="Invalid billing period. Must be 'monthly' or 'annual'.")

    try:
        result = await setu_payment_service.create_payment_link(
            user_id=req.user_id,
            tier=req.tier,
            billing_period=req.billing_period,
        )

        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])

        return PaymentLinkResponse(
            id=result.get("id", ""),
            user_id=result.get("user_id", req.user_id),
            tier=result.get("tier", req.tier),
            billing_period=result.get("billing_period", req.billing_period),
            amount=result.get("amount", 0),
            currency=result.get("currency", "INR"),
            status=result.get("status", "CREATED"),
            payment_link=result.get("payment_link", ""),
            upi_link=result.get("upi_link", ""),
            created_at=result.get("created_at", ""),
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Payment link creation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/status/{payment_id}")
async def get_payment_status(payment_id: str):
    """Check payment status."""
    result = await setu_payment_service.get_payment_status(payment_id)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result


@router.post("/confirm/{payment_id}")
async def confirm_payment(payment_id: str):
    """Mock-confirm a payment (development only).
    In production, payments are confirmed via Setu webhooks."""
    result = await setu_payment_service.confirm_payment(payment_id)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return {"message": "Payment confirmed", "payment": result}


@router.post("/webhook")
async def payment_webhook(request: Request):
    """Receive Setu UPI payment notifications.

    In production, verify webhook signature before processing.
    """
    body = await request.json()
    event_type = body.get("type", "")
    payment_id = body.get("paymentLinkId", "") or body.get("id", "")

    logger.info(f"Setu payment webhook: type={event_type}, paymentId={payment_id}")

    if event_type in ("PAYMENT_SUCCESSFUL", "BILL_FULFILLED"):
        logger.info(f"Payment {payment_id} successful")
        # In production: activate subscription via subscription_service
    elif event_type == "PAYMENT_FAILED":
        logger.warning(f"Payment {payment_id} failed")

    return {"success": True, "message": "Webhook received"}
