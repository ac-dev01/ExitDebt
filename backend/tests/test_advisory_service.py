"""Unit tests for the advisory service.

Covers:
- ADVISORY_TIERS pricing structure
- get_tier_info (valid/invalid lookups)
- payment service getter/setter
"""

import pytest
from app.services.advisory_service import (
    ADVISORY_TIERS,
    get_tier_info,
    get_payment_service,
    set_payment_service,
)
from app.integrations.mock_providers import MockPaymentService


class TestAdvisoryTiers:
    """Test tier data structure and pricing."""

    def test_has_three_tiers(self):
        assert len(ADVISORY_TIERS) == 3
        assert set(ADVISORY_TIERS.keys()) == {"basic", "standard", "premium"}

    def test_basic_tier_price(self):
        assert ADVISORY_TIERS["basic"]["price"] == 499.0

    def test_standard_tier_price(self):
        assert ADVISORY_TIERS["standard"]["price"] == 1499.0

    def test_premium_tier_price(self):
        assert ADVISORY_TIERS["premium"]["price"] == 2999.0

    def test_each_tier_has_features(self):
        for tier_name, tier_data in ADVISORY_TIERS.items():
            assert "features" in tier_data, f"{tier_name} missing features"
            assert len(tier_data["features"]) > 0, f"{tier_name} has no features"

    def test_each_tier_has_description(self):
        for tier_name, tier_data in ADVISORY_TIERS.items():
            assert "description" in tier_data, f"{tier_name} missing description"
            assert len(tier_data["description"]) > 0

    def test_price_increases_with_tier(self):
        assert (
            ADVISORY_TIERS["basic"]["price"]
            < ADVISORY_TIERS["standard"]["price"]
            < ADVISORY_TIERS["premium"]["price"]
        )


class TestGetTierInfo:
    """Test tier lookup function."""

    def test_valid_tier_returns_dict(self):
        info = get_tier_info("basic")
        assert info is not None
        assert info["price"] == 499.0

    def test_invalid_tier_returns_none(self):
        assert get_tier_info("enterprise") is None
        assert get_tier_info("") is None

    def test_returns_all_fields(self):
        info = get_tier_info("premium")
        assert "price" in info
        assert "description" in info
        assert "features" in info


class TestPaymentService:
    """Test payment service getter/setter (dependency injection)."""

    def test_default_service_is_mock(self):
        service = get_payment_service()
        assert isinstance(service, MockPaymentService)

    def test_set_payment_service_overrides(self):
        original = get_payment_service()
        custom = MockPaymentService()
        set_payment_service(custom)
        assert get_payment_service() is custom
        # Restore
        set_payment_service(original)
