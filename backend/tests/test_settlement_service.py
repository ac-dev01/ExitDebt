"""Unit tests for the settlement service pure functions.

Tests validate_debt_threshold, compute_fee, and STATE_TRANSITIONS
without requiring a database connection by mocking the database module.
"""

import sys
import math
import pytest
from unittest.mock import MagicMock

# Mock the database module before importing anything that chains to it.
# This prevents psycopg2 import errors in environments without PostgreSQL.
mock_base = MagicMock()
mock_base.Base = type("MockBase", (), {})
sys.modules.setdefault("psycopg2", MagicMock())

from app.services.settlement_service import (
    validate_debt_threshold,
    compute_fee,
    STATE_TRANSITIONS,
    MIN_DEBT_INR,
    FEE_RATE,
    GST_RATE,
)


class TestValidateDebtThreshold:
    """Test minimum debt checks."""

    def test_below_minimum_raises(self):
        with pytest.raises(ValueError, match="Minimum debt"):
            validate_debt_threshold(50000)

    def test_exactly_minimum_passes(self):
        """Should NOT raise at exactly ₹1,00,000."""
        validate_debt_threshold(MIN_DEBT_INR)  # No exception

    def test_above_minimum_passes(self):
        validate_debt_threshold(500000)  # No exception

    def test_zero_raises(self):
        with pytest.raises(ValueError):
            validate_debt_threshold(0)

    def test_negative_raises(self):
        with pytest.raises(ValueError):
            validate_debt_threshold(-10000)


class TestComputeFee:
    """Test fee calculation: 10% base + 18% GST."""

    def test_basic_fee_calculation(self):
        """₹100,000 settled → 10000 base + 1800 GST = 11800."""
        fee = compute_fee(100000)
        expected = math.ceil(100000 * FEE_RATE * (1 + GST_RATE))
        assert fee == expected
        assert fee == 11800

    def test_fee_rounds_up(self):
        """Fee should always round up (ceil)."""
        fee = compute_fee(33333)
        assert fee == math.ceil(33333 * FEE_RATE * (1 + GST_RATE))

    def test_fee_on_large_amount(self):
        fee = compute_fee(5000000)
        assert fee == math.ceil(5000000 * FEE_RATE * (1 + GST_RATE))

    def test_fee_on_small_amount(self):
        fee = compute_fee(1)
        assert fee >= 1  # ceil ensures at least 1


class TestStateTransitions:
    """Test settlement state machine validity."""

    def test_intake_can_move_to_negotiating(self):
        assert "negotiating" in STATE_TRANSITIONS["intake"]

    def test_intake_can_move_to_closed(self):
        assert "closed" in STATE_TRANSITIONS["intake"]

    def test_negotiating_can_settle(self):
        assert "settled" in STATE_TRANSITIONS["negotiating"]

    def test_negotiating_can_close(self):
        assert "closed" in STATE_TRANSITIONS["negotiating"]

    def test_settled_can_only_close(self):
        assert STATE_TRANSITIONS["settled"] == {"closed"}

    def test_closed_is_terminal(self):
        assert STATE_TRANSITIONS["closed"] == set()

    def test_invalid_transition_not_allowed(self):
        """intake → settled is NOT valid (must go through negotiating)."""
        assert "settled" not in STATE_TRANSITIONS["intake"]

    def test_no_back_transition(self):
        """settled → negotiating is NOT valid."""
        assert "negotiating" not in STATE_TRANSITIONS["settled"]
