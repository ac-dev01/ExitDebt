"""Unit tests for the health score calculation engine."""

import pytest
from app.services.health_score import calculate_health_score


class TestHealthScoreAlgorithm:
    """Test the 5-factor weighted scoring model."""

    def test_healthy_profile(self):
        """Low debt, low rates, good payment history → Healthy."""
        accounts = [
            {
                "lender_name": "SBI",
                "account_type": "home_loan",
                "outstanding": 1000000,
                "interest_rate": 8.5,
                "emi_amount": 10000,
                "status": "active",
                "utilization": 0.0,
                "payment_history": 0.98,
            },
        ]
        result = calculate_health_score(accounts, monthly_income=80000)

        assert result.score >= 85
        assert result.category == "Healthy"
        assert result.total_outstanding == 1000000
        assert result.total_emi == 10000
        assert result.avg_rate == 8.5
        assert len(result.flagged_accounts) == 0

    def test_fair_profile(self):
        """Moderate debt with some high-rate accounts → Fair."""
        accounts = [
            {
                "lender_name": "HDFC",
                "account_type": "personal_loan",
                "outstanding": 300000,
                "interest_rate": 18,
                "emi_amount": 12000,
                "status": "active",
                "utilization": 0.0,
                "payment_history": 0.85,
            },
            {
                "lender_name": "ICICI",
                "account_type": "credit_card",
                "outstanding": 80000,
                "interest_rate": 36,
                "emi_amount": 4000,
                "status": "active",
                "utilization": 0.6,
                "payment_history": 0.75,
            },
            {
                "lender_name": "SBI",
                "account_type": "home_loan",
                "outstanding": 2000000,
                "interest_rate": 9.0,
                "emi_amount": 20000,
                "status": "active",
                "utilization": 0.0,
                "payment_history": 0.95,
            },
        ]
        result = calculate_health_score(accounts, monthly_income=60000)

        assert 40 <= result.score < 85
        assert result.category in ("Fair", "Needs Attention")
        assert result.total_emi == 36000
        assert result.savings_est > 0  # Should recommend savings on high-rate accounts

    def test_critical_profile(self):
        """High debt, overdue accounts, high utilization → Critical."""
        accounts = [
            {
                "lender_name": "MoneyTap",
                "account_type": "personal_loan",
                "outstanding": 500000,
                "interest_rate": 28,
                "emi_amount": 25000,
                "status": "overdue",
                "utilization": 0.0,
                "payment_history": 0.3,
            },
            {
                "lender_name": "ICICI",
                "account_type": "credit_card",
                "outstanding": 200000,
                "interest_rate": 42,
                "emi_amount": 8000,
                "status": "active",
                "utilization": 0.95,
                "payment_history": 0.4,
            },
            {
                "lender_name": "Bajaj",
                "account_type": "personal_loan",
                "outstanding": 400000,
                "interest_rate": 24,
                "emi_amount": 20000,
                "status": "overdue",
                "utilization": 0.0,
                "payment_history": 0.25,
            },
        ]
        result = calculate_health_score(accounts, monthly_income=30000)

        assert result.score < 40
        assert result.category == "Critical"
        assert len(result.flagged_accounts) >= 2  # Overdue + high rate accounts
        assert result.dti_ratio > 1.0  # EMI > income
        assert result.savings_est > 0

    def test_no_accounts(self):
        """No accounts → Healthy with zero values."""
        result = calculate_health_score([])
        assert result.score == 100
        assert result.category == "Healthy"
        assert result.total_outstanding == 0
        assert result.total_emi == 0

    def test_flagging_high_rate(self):
        """Accounts with rate > 24% should be flagged."""
        accounts = [
            {
                "lender_name": "HighRate Lender",
                "account_type": "personal_loan",
                "outstanding": 100000,
                "interest_rate": 30,
                "emi_amount": 5000,
                "status": "active",
                "utilization": 0.0,
                "payment_history": 0.9,
            },
        ]
        result = calculate_health_score(accounts)
        assert len(result.flagged_accounts) == 1
        assert "High interest rate" in result.flagged_accounts[0]["reason"]

    def test_flagging_overdue(self):
        """Overdue accounts should be flagged."""
        accounts = [
            {
                "lender_name": "Overdue Bank",
                "account_type": "personal_loan",
                "outstanding": 100000,
                "interest_rate": 14,
                "emi_amount": 5000,
                "status": "overdue",
                "utilization": 0.0,
                "payment_history": 0.9,
            },
        ]
        result = calculate_health_score(accounts)
        assert len(result.flagged_accounts) == 1
        assert "overdue" in result.flagged_accounts[0]["reason"].lower()

    def test_savings_estimation(self):
        """Accounts above 14% should show consolidation savings."""
        accounts = [
            {
                "lender_name": "Expensive Bank",
                "account_type": "personal_loan",
                "outstanding": 500000,
                "interest_rate": 24,
                "emi_amount": 15000,
                "status": "active",
                "utilization": 0.0,
                "payment_history": 0.9,
            },
        ]
        result = calculate_health_score(accounts)
        # Savings = 500000 * (24% - 12%) = 60000 per year
        assert result.savings_est == 60000.0

    def test_score_in_valid_range(self):
        """Score should always be 0–100."""
        accounts = [
            {
                "lender_name": "Test",
                "account_type": "personal_loan",
                "outstanding": 1000000,
                "interest_rate": 50,
                "emi_amount": 80000,
                "status": "overdue",
                "utilization": 0.99,
                "payment_history": 0.1,
            },
        ] * 10  # Extreme case
        result = calculate_health_score(accounts, monthly_income=10000)
        assert 0 <= result.score <= 100
