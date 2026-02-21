"""Setu PAN Verification service.

Supports both real Setu PAN API integration and mock/sandbox mode.
When SETU_PAN_PROVIDER=mock, returns synthetic verification data.
When SETU_PAN_PROVIDER=setu, calls the real Setu Data Gateway API.

Setu PAN API:
  POST /api/verify/pan
  Headers: x-client-id, x-client-secret, x-product-instance-id
  Body: { pan, consent, reason }
  Response: { verification, message, data: { full_name, category, ... } }

Sandbox test PANs:
  - ABCDE1234A → valid PAN
  - ABCDE1234B → invalid PAN (found but invalid)
  - Any other  → 404 PAN not found
"""

import logging
import re
import httpx
from typing import Optional
from app.config import get_settings

logger = logging.getLogger(__name__)

# PAN format: 5 letters, 4 digits, 1 letter
PAN_REGEX = re.compile(r"^[A-Z]{5}[0-9]{4}[A-Z]$")

# ── Mock Data ────────────────────────────────────────────────────────

# Mock PAN → verification data mapping (mirrors Setu sandbox responses)
MOCK_PAN_DATA = {
    "ABCDE1234A": {
        "verification": "success",
        "message": "PAN is valid",
        "data": {
            "aadhaar_seeding_status": "LINKED",
            "category": "Individual",
            "full_name": "John Doe",
            "first_name": "John",
            "middle_name": "",
            "last_name": "Doe",
        },
    },
    "ABCDE1234B": {
        "verification": "failed",
        "message": "PAN is invalid",
        "data": {
            "category": "Individual",
            "full_name": "",
        },
    },
    # Sample profiles matching ExitDebt mock profiles
    "ABCDE1234F": {
        "verification": "success",
        "message": "PAN is valid",
        "data": {
            "aadhaar_seeding_status": "LINKED",
            "category": "Individual",
            "full_name": "Saurabh Mehta",
            "first_name": "Saurabh",
            "middle_name": "",
            "last_name": "Mehta",
        },
    },
    "BCDEA2345G": {
        "verification": "success",
        "message": "PAN is valid",
        "data": {
            "aadhaar_seeding_status": "LINKED",
            "category": "Individual",
            "full_name": "Priya Sharma",
            "first_name": "Priya",
            "middle_name": "",
            "last_name": "Sharma",
        },
    },
    "CDEAB3456H": {
        "verification": "success",
        "message": "PAN is valid",
        "data": {
            "aadhaar_seeding_status": "LINKED",
            "category": "Individual",
            "full_name": "Ankit Verma",
            "first_name": "Ankit",
            "middle_name": "",
            "last_name": "Verma",
        },
    },
    "DEABC4567I": {
        "verification": "success",
        "message": "PAN is valid",
        "data": {
            "aadhaar_seeding_status": "LINKED",
            "category": "Individual",
            "full_name": "Neha Gupta",
            "first_name": "Neha",
            "middle_name": "",
            "last_name": "Gupta",
        },
    },
}


def _mock_verify_pan(pan: str, consent: str, reason: str) -> dict:
    """Return mock PAN verification matching Setu's response format."""
    pan = pan.upper().strip()

    if not PAN_REGEX.match(pan):
        return {
            "verification": "error",
            "message": "Invalid PAN format",
            "error": {"code": "BAD_REQUEST", "detail": "PAN format must be ABCDE1234F"},
        }

    if consent.upper() not in ("Y", "YES"):
        return {
            "verification": "error",
            "message": "Consent is required",
            "error": {"code": "BAD_REQUEST", "detail": "consent must be Y"},
        }

    if len(reason) < 20:
        return {
            "verification": "error",
            "message": "Reason too short",
            "error": {"code": "BAD_REQUEST", "detail": "reason must be at least 20 characters"},
        }

    # Check predefined mock PANs
    if pan in MOCK_PAN_DATA:
        return MOCK_PAN_DATA[pan]

    # For any other valid-format PAN, return a generic success (like Setu sandbox)
    return {
        "verification": "success",
        "message": "PAN is valid",
        "data": {
            "aadhaar_seeding_status": "LINKED",
            "category": "Individual",
            "full_name": "ExitDebt User",
            "first_name": "ExitDebt",
            "middle_name": "",
            "last_name": "User",
        },
    }


# ── Real Setu API ────────────────────────────────────────────────────

async def _setu_verify_pan(pan: str, consent: str, reason: str) -> dict:
    """Call Setu Data Gateway PAN verification API.

    Docs: https://docs.setu.co/data/pan
    Sandbox: https://dg-sandbox.setu.co
    Production: https://dg.setu.co
    """
    settings = get_settings()

    headers = {
        "x-client-id": settings.SETU_PAN_CLIENT_ID,
        "x-client-secret": settings.SETU_PAN_CLIENT_SECRET,
        "x-product-instance-id": settings.SETU_PAN_PRODUCT_INSTANCE_ID,
        "Content-Type": "application/json",
    }

    payload = {
        "pan": pan.upper().strip(),
        "consent": consent.upper(),
        "reason": reason,
    }

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(
                f"{settings.SETU_PAN_BASE_URL}/api/verify/pan",
                json=payload,
                headers=headers,
            )

            if resp.status_code == 200:
                data = resp.json()
                logger.info(f"Setu PAN verify success: {pan[:5]}XXXXX")
                return data
            elif resp.status_code == 404:
                logger.warning(f"Setu PAN not found: {pan[:5]}XXXXX")
                return {
                    "verification": "failed",
                    "message": "PAN not found",
                    "error": {"code": "NOT_FOUND", "detail": "No PAN record found"},
                }
            else:
                error_body = resp.text
                logger.error(f"Setu PAN verify error {resp.status_code}: {error_body}")
                return {
                    "verification": "error",
                    "message": f"Setu API error: {resp.status_code}",
                    "error": {"code": "API_ERROR", "detail": error_body},
                }
    except httpx.TimeoutException:
        logger.error("Setu PAN verify timeout")
        return {
            "verification": "error",
            "message": "Setu API timeout",
            "error": {"code": "TIMEOUT", "detail": "Request timed out after 30s"},
        }
    except Exception as e:
        logger.error(f"Setu PAN verify exception: {e}")
        return {
            "verification": "error",
            "message": "Internal error during PAN verification",
            "error": {"code": "INTERNAL_ERROR", "detail": str(e)},
        }


# ── Public API (auto-selects mock vs real) ───────────────────────────

async def verify_pan(pan: str, consent: str = "Y", reason: str = "Debt health check for ExitDebt user") -> dict:
    """Verify a PAN number. Auto-selects mock or real Setu.

    Args:
        pan: PAN card number (e.g. ABCDE1234F)
        consent: User consent indicator (Y/N)
        reason: Reason for verification (min 20 chars)

    Returns:
        dict with verification result matching Setu API response format
    """
    settings = get_settings()

    if settings.SETU_PAN_PROVIDER == "setu" and settings.SETU_PAN_CLIENT_ID:
        logger.info("Using real Setu PAN API")
        return await _setu_verify_pan(pan, consent, reason)

    logger.info("Using mock PAN verification")
    return _mock_verify_pan(pan, consent, reason)


def is_pan_valid(result: dict) -> bool:
    """Check if a PAN verification result indicates a valid PAN."""
    return result.get("verification") == "success"


def get_verified_name(result: dict) -> Optional[str]:
    """Extract the verified full name from a PAN verification result."""
    if is_pan_valid(result):
        return result.get("data", {}).get("full_name")
    return None
