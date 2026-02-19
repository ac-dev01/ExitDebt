"""Callback scheduling service.

Auto-selects Zoho CRM when credentials are configured,
otherwise falls back to mock.
"""

import logging
from app.config import get_settings
from app.integrations.base import CRMServiceBase
from app.integrations.mock_providers import MockCRMService

logger = logging.getLogger(__name__)

_crm_service: CRMServiceBase | None = None


def get_crm_service() -> CRMServiceBase:
    """Get CRM service — auto-selects real Zoho when configured."""
    global _crm_service
    if _crm_service is not None:
        return _crm_service

    settings = get_settings()
    if settings.ZOHO_REFRESH_TOKEN:
        from app.integrations.zoho_crm import ZohoCRMService
        _crm_service = ZohoCRMService()
        logger.info("[CRM] Using Zoho CRM (credentials configured)")
    else:
        _crm_service = MockCRMService()
        logger.info("[CRM] Using Mock CRM (no Zoho credentials)")

    return _crm_service


def set_crm_service(service: CRMServiceBase) -> None:
    """Override CRM service (useful for testing)."""
    global _crm_service
    _crm_service = service
