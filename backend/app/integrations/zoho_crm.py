"""Zoho CRM integration — real implementation using OAuth2.

Uses refresh token flow to maintain access. Falls back gracefully
if credentials are not configured.
"""

import httpx
import logging
from typing import Optional, Dict, Any
from datetime import datetime, timedelta

from app.integrations.base import CRMServiceBase
from app.config import get_settings

logger = logging.getLogger(__name__)


class ZohoCRMService(CRMServiceBase):
    """Real Zoho CRM integration with OAuth2 token management."""

    def __init__(self):
        self._settings = get_settings()
        self._access_token: Optional[str] = None
        self._token_expires_at: Optional[datetime] = None

    async def _refresh_access_token(self) -> bool:
        """Refresh the OAuth2 access token using the refresh token."""
        settings = self._settings

        if not settings.ZOHO_REFRESH_TOKEN:
            logger.warning("[ZOHO CRM] No refresh token configured. Skipping.")
            return False

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.post(
                    settings.ZOHO_ACCOUNTS_URL,
                    data={
                        "refresh_token": settings.ZOHO_REFRESH_TOKEN,
                        "client_id": settings.ZOHO_CLIENT_ID,
                        "client_secret": settings.ZOHO_CLIENT_SECRET,
                        "redirect_uri": settings.ZOHO_REDIRECT_URI,
                        "grant_type": "refresh_token",
                    },
                )
                response.raise_for_status()
                data = response.json()

                self._access_token = data.get("access_token")
                expires_in = data.get("expires_in", 3600)
                self._token_expires_at = datetime.utcnow() + timedelta(seconds=expires_in - 60)

                logger.info("[ZOHO CRM] Access token refreshed successfully.")
                return True

        except Exception as e:
            logger.error(f"[ZOHO CRM] Token refresh failed: {e}")
            return False

    async def _get_token(self) -> Optional[str]:
        """Get a valid access token, refreshing if needed."""
        if self._access_token and self._token_expires_at and datetime.utcnow() < self._token_expires_at:
            return self._access_token

        success = await self._refresh_access_token()
        return self._access_token if success else None

    def _headers(self, token: str) -> Dict[str, str]:
        return {
            "Authorization": f"Zoho-oauthtoken {token}",
            "Content-Type": "application/json",
        }

    async def create_lead(self, data: Dict[str, Any]) -> Optional[str]:
        """
        Create a lead in Zoho CRM.

        Maps ExitDebt data to Zoho CRM Lead fields:
        - Last_Name → user name
        - Phone → phone number
        - Description → score + outstanding summary
        - Lead_Source → "ExitDebt Website"
        """
        token = await self._get_token()
        if not token:
            logger.warning("[ZOHO CRM] No valid token. Lead not created.")
            return None

        zoho_lead = {
            "data": [
                {
                    "Last_Name": data.get("name", "Unknown"),
                    "Phone": data.get("phone", ""),
                    "Lead_Source": "ExitDebt Website",
                    "Description": self._build_description(data),
                    # Custom fields (create these in Zoho CRM settings)
                    "Debt_Health_Score": data.get("score"),
                    "Total_Outstanding": data.get("total_outstanding"),
                    "Preferred_Callback_Time": data.get("preferred_time"),
                    "Savings_Estimate": data.get("savings_est"),
                }
            ]
        }

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.post(
                    f"{self._settings.ZOHO_CRM_URL}/Leads",
                    json=zoho_lead,
                    headers=self._headers(token),
                )

                # Retry once on 401 (token may have expired)
                if response.status_code == 401:
                    logger.info("[ZOHO CRM] Token expired mid-request. Refreshing...")
                    await self._refresh_access_token()
                    token = self._access_token
                    if token:
                        response = await client.post(
                            f"{self._settings.ZOHO_CRM_URL}/Leads",
                            json=zoho_lead,
                            headers=self._headers(token),
                        )

                response.raise_for_status()
                result = response.json()

                lead_id = result.get("data", [{}])[0].get("details", {}).get("id")
                logger.info(f"[ZOHO CRM] Lead created: {lead_id}")
                return lead_id

        except Exception as e:
            logger.error(f"[ZOHO CRM] Failed to create lead: {e}")
            return None

    async def update_lead(self, lead_id: str, data: Dict[str, Any]) -> bool:
        """Update an existing lead in Zoho CRM."""
        token = await self._get_token()
        if not token:
            return False

        zoho_data = {"data": [data]}

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.put(
                    f"{self._settings.ZOHO_CRM_URL}/Leads/{lead_id}",
                    json=zoho_data,
                    headers=self._headers(token),
                )
                response.raise_for_status()
                logger.info(f"[ZOHO CRM] Lead updated: {lead_id}")
                return True

        except Exception as e:
            logger.error(f"[ZOHO CRM] Failed to update lead {lead_id}: {e}")
            return False

    async def get_lead(self, lead_id: str) -> Optional[Dict[str, Any]]:
        """Get lead details from Zoho CRM."""
        token = await self._get_token()
        if not token:
            return None

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.get(
                    f"{self._settings.ZOHO_CRM_URL}/Leads/{lead_id}",
                    headers=self._headers(token),
                )
                response.raise_for_status()
                result = response.json()
                return result.get("data", [None])[0]

        except Exception as e:
            logger.error(f"[ZOHO CRM] Failed to get lead {lead_id}: {e}")
            return None

    @staticmethod
    def _build_description(data: Dict[str, Any]) -> str:
        """Build a human-readable description for the Zoho CRM lead."""
        parts = ["ExitDebt Lead"]
        if data.get("score"):
            parts.append(f"Debt Health Score: {data['score']}/100")
        if data.get("total_outstanding"):
            parts.append(f"Total Outstanding: ₹{data['total_outstanding']:,.0f}")
        if data.get("savings_est"):
            parts.append(f"Est. Annual Savings: ₹{data['savings_est']:,.0f}")
        if data.get("preferred_time"):
            parts.append(f"Preferred Callback: {data['preferred_time']}")
        return " | ".join(parts)
