"""PAN Verification router.

Endpoints:
  POST /api/pan/verify  – Verify a PAN card number via Setu
"""

import logging
import re
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, field_validator
from typing import Optional
from app.services import setu_pan_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/pan", tags=["PAN Verification"])

PAN_REGEX = re.compile(r"^[A-Z]{5}[0-9]{4}[A-Z]$")


# ── Schemas ──────────────────────────────────────────────────────────

class PANVerifyRequest(BaseModel):
    pan: str
    consent: str = "Y"
    reason: str = "Debt health check for ExitDebt user"

    @field_validator("pan")
    @classmethod
    def validate_pan_format(cls, v: str) -> str:
        v = v.upper().strip()
        if not PAN_REGEX.match(v):
            raise ValueError("Invalid PAN format. Expected: ABCDE1234F")
        return v

    @field_validator("consent")
    @classmethod
    def validate_consent(cls, v: str) -> str:
        if v.upper() not in ("Y", "YES"):
            raise ValueError("Consent must be 'Y' to proceed with verification")
        return v.upper()

    @field_validator("reason")
    @classmethod
    def validate_reason(cls, v: str) -> str:
        if len(v.strip()) < 20:
            raise ValueError("Reason must be at least 20 characters")
        return v.strip()


class PANVerifyData(BaseModel):
    full_name: str = ""
    first_name: Optional[str] = None
    middle_name: Optional[str] = None
    last_name: Optional[str] = None
    category: Optional[str] = None
    aadhaar_seeding_status: Optional[str] = None


class PANVerifyResponse(BaseModel):
    verification: str  # "success", "failed", "error"
    message: str
    data: Optional[PANVerifyData] = None


# ── Endpoints ────────────────────────────────────────────────────────

@router.post("/verify", response_model=PANVerifyResponse)
async def verify_pan(req: PANVerifyRequest):
    """Verify a PAN card number using Setu PAN API.

    In mock mode (default), returns synthetic data.
    In setu mode, calls the real Setu Data Gateway API.

    Sandbox test values:
    - ABCDE1234A → valid PAN
    - ABCDE1234B → invalid PAN
    """
    try:
        result = await setu_pan_service.verify_pan(
            pan=req.pan,
            consent=req.consent,
            reason=req.reason,
        )

        # Handle error responses from the service
        if "error" in result and result.get("verification") == "error":
            raise HTTPException(
                status_code=400,
                detail={
                    "verification": "error",
                    "message": result.get("message", "Verification failed"),
                    "error": result.get("error", {}),
                },
            )

        return PANVerifyResponse(
            verification=result.get("verification", "error"),
            message=result.get("message", ""),
            data=PANVerifyData(**result["data"]) if "data" in result else None,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"PAN verification failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
