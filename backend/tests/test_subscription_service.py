"""Unit tests for the subscription service pure functions.

Tests compute_expiry, compute_days_remaining, PLANS pricing, and validation
constants without requiring a database connection.
"""

import sys
import pytest
from unittest.mock import MagicMock
from datetime import datetime, timedelta

# Mock psycopg2 to prevent database engine creation at import time
sys.modules.setdefault("psycopg2", MagicMock())

from app.services.subscription_service import (
    compute_expiry,
    compute_days_remaining,
    PLANS,
    VALID_TIERS,
    VALID_PERIODS,
)


class TestComputeExpiry:
    """Test subscription expiry computation."""

    def test_monthly_expiry_is_30_days_from_now(self):
        before = datetime.utcnow()
        result = compute_expiry("monthly")
        delta = result - before
        assert 29 <= delta.days <= 30

    def test_annual_expiry_is_365_days_from_now(self):
        before = datetime.utcnow()
        result = compute_expiry("annual")
        delta = result - before
        assert 364 <= delta.days <= 365

    def test_unknown_period_defaults_to_monthly(self):
        """Non-annual period should fall through to 30-day default."""
        before = datetime.utcnow()
        result = compute_expiry("weekly")
        delta = result - before
        assert 29 <= delta.days <= 30


class TestComputeDaysRemaining:
    """Test trial days remaining computation."""

    def test_future_date_returns_positive_days(self):
        future = datetime.utcnow() + timedelta(days=10)
        remaining = compute_days_remaining(future)
        assert remaining >= 9

    def test_past_date_returns_zero(self):
        past = datetime.utcnow() - timedelta(days=5)
        remaining = compute_days_remaining(past)
        assert remaining == 0

    def test_today_returns_zero(self):
        now = datetime.utcnow()
        remaining = compute_days_remaining(now)
        assert remaining == 0


class TestPlanPricing:
    """Test plan pricing constants."""

    def test_lite_monthly_price(self):
        assert PLANS["lite"]["monthly"] == 499

    def test_lite_annual_price(self):
        assert PLANS["lite"]["annual"] == 4999

    def test_shield_monthly_price(self):
        assert PLANS["shield"]["monthly"] == 1999

    def test_shield_annual_price(self):
        assert PLANS["shield"]["annual"] == 14999

    def test_annual_is_cheaper_per_month(self):
        for tier in PLANS:
            monthly_cost = PLANS[tier]["monthly"] * 12
            annual_cost = PLANS[tier]["annual"]
            assert annual_cost < monthly_cost, f"{tier} annual should be cheaper"


class TestValidation:
    """Test tier and period validation sets."""

    def test_valid_tiers(self):
        assert VALID_TIERS == {"lite", "shield"}

    def test_valid_periods(self):
        assert VALID_PERIODS == {"monthly", "annual"}

    def test_invalid_tier_not_in_set(self):
        assert "free" not in VALID_TIERS
        assert "premium" not in VALID_TIERS

    def test_invalid_period_not_in_set(self):
        assert "weekly" not in VALID_PERIODS
        assert "daily" not in VALID_PERIODS
