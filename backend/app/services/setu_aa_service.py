"""Setu Account Aggregator (AA) service.

Supports both real Setu API integration and mock/sandbox mode.
When SETU_AA_PROVIDER=mock, returns synthetic data for local development.
When SETU_AA_PROVIDER=setu, calls the real Setu FIU APIs.

Setu AA Flow:
  1. Create consent (POST /consents) → get redirect URL
  2. User approves at Setu screens → webhook notification
  3. Create data session (POST /sessions) → fetch FI data
  4. Parse FI data into ExitDebt debt accounts
"""

import uuid
import logging
import httpx
from datetime import datetime, timedelta
from typing import Optional
from app.config import get_settings

logger = logging.getLogger(__name__)

# ── Token Cache ──────────────────────────────────────────────────────
_token_cache: dict = {"access_token": None, "expires_at": 0}


async def _get_setu_token() -> str:
    """Get or refresh Setu auth token (cached for 280s of the 300s expiry)."""
    settings = get_settings()
    now = datetime.utcnow().timestamp()

    if _token_cache["access_token"] and _token_cache["expires_at"] > now:
        return _token_cache["access_token"]

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{settings.SETU_AUTH_URL}/v1/users/login",
            json={
                "clientID": settings.SETU_AA_CLIENT_ID,
                "secret": settings.SETU_AA_CLIENT_SECRET,
                "grant_type": "client_credentials",
            },
            headers={"Content-Type": "application/json"},
        )
        resp.raise_for_status()
        data = resp.json()
        _token_cache["access_token"] = data["access_token"]
        _token_cache["expires_at"] = now + 280  # refresh 20s before expiry
        return data["access_token"]


def _setu_headers(token: str, settings=None) -> dict:
    """Build Setu API request headers."""
    if settings is None:
        settings = get_settings()
    return {
        "Authorization": f"Bearer {token}",
        "x-product-instance-id": settings.SETU_AA_PRODUCT_INSTANCE_ID,
        "Content-Type": "application/json",
    }


# ── Mock Consent Flow ────────────────────────────────────────────────

MOCK_CONSENTS: dict = {}


def _mock_create_consent(phone: str, fi_types: list[str]) -> dict:
    """Create a mock consent for local development."""
    consent_id = str(uuid.uuid4())
    consent = {
        "id": consent_id,
        "url": f"http://localhost:3000/aa/callback?mock=true&consentId={consent_id}",
        "status": "PENDING",
        "vua": f"{phone}@setu-mock",
        "fi_types": fi_types,
        "created_at": datetime.utcnow().isoformat(),
    }
    MOCK_CONSENTS[consent_id] = consent
    return consent


def _mock_approve_consent(consent_id: str) -> dict:
    """Simulate consent approval in mock mode."""
    if consent_id in MOCK_CONSENTS:
        MOCK_CONSENTS[consent_id]["status"] = "APPROVED"
        MOCK_CONSENTS[consent_id]["approved_at"] = datetime.utcnow().isoformat()
    return MOCK_CONSENTS.get(consent_id, {"error": "Not found"})


def _mock_get_consent(consent_id: str) -> dict:
    """Get mock consent status."""
    return MOCK_CONSENTS.get(consent_id, {"error": "Not found"})


def _mock_fetch_fi_data(consent_id: str) -> dict:
    """Return mock financial data matching Setu FI schema."""
    return {
        "consent_id": consent_id,
        "status": "COMPLETED",
        "fi_data": [
            {
                "fipId": "SETU-FIP-MOCK",
                "data": [
                    {
                        "linkRefNumber": "MOCK-SAVINGS-001",
                        "maskedAccNumber": "XXXX1234",
                        "fiType": "DEPOSIT",
                        "account": {
                            "profile": {
                                "holders": {
                                    "holder": [
                                        {"name": "User", "pan": "XXXXX0000X"}
                                    ]
                                }
                            },
                            "summary": {
                                "type": "SAVINGS",
                                "branch": "Mumbai",
                                "currentBalance": "125000.00",
                                "currency": "INR",
                                "openingDate": "2020-01-15",
                            },
                            "transactions": {
                                "transaction": [
                                    {
                                        "txnId": "TXN001",
                                        "type": "DEBIT",
                                        "mode": "UPI",
                                        "amount": "15000.00",
                                        "narration": "EMI - HDFC Personal Loan",
                                        "transactionTimestamp": "2026-02-05T10:00:00Z",
                                        "currentBalance": "110000.00",
                                    },
                                    {
                                        "txnId": "TXN002",
                                        "type": "DEBIT",
                                        "mode": "AUTO_DEBIT",
                                        "amount": "8400.00",
                                        "narration": "EMI - Bajaj Finserv",
                                        "transactionTimestamp": "2026-02-07T10:00:00Z",
                                        "currentBalance": "101600.00",
                                    },
                                    {
                                        "txnId": "TXN003",
                                        "type": "DEBIT",
                                        "mode": "AUTO_DEBIT",
                                        "amount": "5000.00",
                                        "narration": "CC Min Payment - ICICI",
                                        "transactionTimestamp": "2026-02-15T10:00:00Z",
                                        "currentBalance": "96600.00",
                                    },
                                    {
                                        "txnId": "TXN004",
                                        "type": "CREDIT",
                                        "mode": "NEFT",
                                        "amount": "60000.00",
                                        "narration": "Salary Credit - Employer",
                                        "transactionTimestamp": "2026-02-01T10:00:00Z",
                                        "currentBalance": "125000.00",
                                    },
                                ],
                            },
                        },
                    },
                    {
                        "linkRefNumber": "MOCK-CC-001",
                        "maskedAccNumber": "XXXX5678",
                        "fiType": "CREDIT_CARD",
                        "account": {
                            "profile": {
                                "holders": {
                                    "holder": [
                                        {"name": "User", "pan": "XXXXX0000X"}
                                    ]
                                }
                            },
                            "summary": {
                                "type": "CREDIT_CARD",
                                "currentDue": "42000.00",
                                "totalLimit": "200000.00",
                                "availableLimit": "158000.00",
                                "dueDate": "2026-03-05",
                                "currency": "INR",
                            },
                        },
                    },
                ],
            }
        ],
    }


# ── Real Setu API Calls ──────────────────────────────────────────────

async def _setu_create_consent(phone: str, fi_types: list[str]) -> dict:
    """Create consent via Setu FIU API."""
    settings = get_settings()
    token = await _get_setu_token()

    now = datetime.utcnow()
    payload = {
        "consentDuration": {"unit": "MONTH", "value": "6"},
        "vua": phone,
        "dataRange": {
            "from": (now - timedelta(days=180)).strftime("%Y-%m-%dT00:00:00Z"),
            "to": now.strftime("%Y-%m-%dT00:00:00Z"),
        },
        "context": [],
    }

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{settings.SETU_AA_BASE_URL}/consents",
            json=payload,
            headers=_setu_headers(token, settings),
        )
        resp.raise_for_status()
        data = resp.json()
        logger.info(f"Setu consent created: {data.get('id')}")
        return data


async def _setu_get_consent(consent_id: str) -> dict:
    """Check consent status via Setu GET API."""
    settings = get_settings()
    token = await _get_setu_token()

    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{settings.SETU_AA_BASE_URL}/consents/{consent_id}",
            headers=_setu_headers(token, settings),
        )
        resp.raise_for_status()
        return resp.json()


async def _setu_create_data_session(consent_id: str) -> dict:
    """Create a data session to fetch FI data after consent approval."""
    settings = get_settings()
    token = await _get_setu_token()

    now = datetime.utcnow()
    payload = {
        "consentId": consent_id,
        "dataRange": {
            "from": (now - timedelta(days=180)).strftime("%Y-%m-%dT00:00:00Z"),
            "to": now.strftime("%Y-%m-%dT00:00:00Z"),
        },
        "format": "json",
    }

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{settings.SETU_AA_BASE_URL}/sessions",
            json=payload,
            headers=_setu_headers(token, settings),
        )
        resp.raise_for_status()
        return resp.json()


async def _setu_fetch_data(session_id: str) -> dict:
    """Fetch decrypted FI data from a completed session."""
    settings = get_settings()
    token = await _get_setu_token()

    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{settings.SETU_AA_BASE_URL}/sessions/{session_id}",
            headers=_setu_headers(token, settings),
        )
        resp.raise_for_status()
        return resp.json()


# ── Public API (auto-selects mock vs real) ───────────────────────────

async def create_consent(phone: str, fi_types: list[str] | None = None) -> dict:
    """Create an AA consent request. Auto-selects mock or real Setu."""
    if fi_types is None:
        fi_types = ["DEPOSIT", "CREDIT_CARD", "TERM_DEPOSIT"]

    settings = get_settings()
    if settings.SETU_AA_PROVIDER == "setu" and settings.SETU_AA_CLIENT_ID:
        return await _setu_create_consent(phone, fi_types)
    return _mock_create_consent(phone, fi_types)


async def get_consent_status(consent_id: str) -> dict:
    """Check consent status. Auto-selects mock or real Setu."""
    settings = get_settings()
    if settings.SETU_AA_PROVIDER == "setu" and settings.SETU_AA_CLIENT_ID:
        return await _setu_get_consent(consent_id)
    return _mock_get_consent(consent_id)


async def approve_consent(consent_id: str) -> dict:
    """Approve a consent (mock only — real flow uses Setu screens)."""
    return _mock_approve_consent(consent_id)


async def fetch_financial_data(consent_id: str) -> dict:
    """Fetch FI data after consent approval. Auto-selects mock or real Setu."""
    settings = get_settings()
    if settings.SETU_AA_PROVIDER == "setu" and settings.SETU_AA_CLIENT_ID:
        session = await _setu_create_data_session(consent_id)
        session_id = session.get("id")
        if session_id:
            return await _setu_fetch_data(session_id)
        return session
    return _mock_fetch_fi_data(consent_id)


def parse_fi_to_debt_accounts(fi_data: dict) -> list[dict]:
    """Transform Setu FI data into ExitDebt debt account format.

    Returns a list of accounts with fields: lender, outstanding, apr, type, emi, dueDate
    """
    accounts = []
    for fip in fi_data.get("fi_data", []):
        for item in fip.get("data", []):
            fi_type = item.get("fiType", "")
            account = item.get("account", {})
            summary = account.get("summary", {})

            if fi_type == "DEPOSIT":
                # Extract EMI payments from transactions
                transactions = account.get("transactions", {}).get("transaction", [])
                for txn in transactions:
                    narration = txn.get("narration", "")
                    if "EMI" in narration.upper() and txn.get("type") == "DEBIT":
                        lender = narration.replace("EMI - ", "").replace("EMI ", "")
                        accounts.append({
                            "lender": lender,
                            "outstanding": 0,  # Not available from bank statement alone
                            "apr": 0,
                            "type": "loan",
                            "emi": float(txn.get("amount", 0)),
                            "dueDate": 5,  # Approximated from transaction date
                        })

            elif fi_type == "CREDIT_CARD":
                accounts.append({
                    "lender": f"Credit Card ({item.get('maskedAccNumber', 'XXXX')})",
                    "outstanding": float(summary.get("currentDue", 0)),
                    "apr": 36,  # Default CC APR for India
                    "type": "credit_card",
                    "emi": float(summary.get("currentDue", 0)) * 0.05,  # ~5% min payment
                    "dueDate": int(summary.get("dueDate", "2026-03-05").split("-")[2]) if summary.get("dueDate") else 5,
                })

            elif fi_type == "TERM_DEPOSIT":
                # Term deposits aren't debts — skip
                continue

    return accounts
