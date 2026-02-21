"""Setu Account Aggregator router.

Endpoints:
  POST /aa/consent       – Create consent request, get redirect URL
  GET  /aa/consent/{id}  – Check consent status
  POST /aa/consent/{id}/approve – Mock-approve (dev only)
  GET  /aa/data/{id}     – Fetch financial data after consent approval
  POST /aa/webhook       – Receive Setu notifications
"""

import logging
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import Optional
from app.services import setu_aa_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/aa", tags=["Account Aggregator"])


# ── Schemas ──────────────────────────────────────────────────────────

class ConsentCreateRequest(BaseModel):
    phone: str
    fi_types: list[str] = ["DEPOSIT", "CREDIT_CARD", "TERM_DEPOSIT"]


class ConsentResponse(BaseModel):
    id: str
    url: str
    status: str


# ── Endpoints ────────────────────────────────────────────────────────

@router.post("/consent", response_model=ConsentResponse)
async def create_consent(req: ConsentCreateRequest):
    """Create an AA consent request. Returns redirect URL for user."""
    try:
        result = await setu_aa_service.create_consent(req.phone, req.fi_types)
        return ConsentResponse(
            id=result.get("id", ""),
            url=result.get("url", ""),
            status=result.get("status", "PENDING"),
        )
    except Exception as e:
        logger.error(f"Failed to create AA consent: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/consent/{consent_id}")
async def get_consent(consent_id: str):
    """Check consent status."""
    result = await setu_aa_service.get_consent_status(consent_id)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result


@router.post("/consent/{consent_id}/approve")
async def approve_consent(consent_id: str):
    """Mock-approve a consent (development only).
    In production, users approve via Setu's consent screens."""
    result = await setu_aa_service.approve_consent(consent_id)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return {"message": "Consent approved", "consent": result}


@router.get("/data/{consent_id}")
async def fetch_data(consent_id: str):
    """Fetch financial data after consent is approved."""
    # Verify consent is approved
    consent = await setu_aa_service.get_consent_status(consent_id)
    if consent.get("status") not in ("APPROVED", "ACTIVE"):
        raise HTTPException(
            status_code=400,
            detail=f"Consent not approved. Current status: {consent.get('status', 'UNKNOWN')}",
        )

    try:
        fi_data = await setu_aa_service.fetch_financial_data(consent_id)
        debt_accounts = setu_aa_service.parse_fi_to_debt_accounts(fi_data)
        return {
            "consent_id": consent_id,
            "status": fi_data.get("status", "COMPLETED"),
            "accounts": debt_accounts,
            "raw_fi_count": len(fi_data.get("fi_data", [])),
        }
    except Exception as e:
        logger.error(f"Failed to fetch AA data: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/webhook")
async def setu_webhook(request: Request):
    """Receive Setu AA notifications (consent approved/rejected, data ready).

    In production, verify webhook signature before processing.
    """
    body = await request.json()
    event_type = body.get("type", "")
    consent_id = body.get("consentId", "")

    logger.info(f"Setu AA webhook: type={event_type}, consentId={consent_id}")

    if event_type == "CONSENT_STATUS_UPDATE":
        status = body.get("data", {}).get("status", "")
        logger.info(f"Consent {consent_id} status updated to: {status}")
        # In production: update AAConsent record in DB

    elif event_type == "FI_DATA_READY":
        session_id = body.get("dataSessionId", "")
        logger.info(f"FI data ready for consent {consent_id}, session: {session_id}")
        # In production: trigger data fetch and update user profile

    return {"success": True, "message": "Webhook received"}
