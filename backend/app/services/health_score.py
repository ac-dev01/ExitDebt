"""Debt Health Score calculation engine.

Scoring Model Weights:
    DTI (Debt-to-Income ratio):    30%
    Average Interest Rate:         25%
    Active Accounts:               15%
    Credit Utilization:            15%
    Payment History:               15%

Score Range: 0–100
Categories:
    85–100: Healthy
    65–84:  Fair
    40–64:  Needs Attention
    0–39:   Critical
"""

from typing import List, Dict, Any, Optional
from dataclasses import dataclass


@dataclass
class HealthScoreResult:
    """Result of health score calculation."""
    score: int
    category: str
    total_outstanding: float
    total_emi: float
    avg_rate: float
    dti_ratio: float
    savings_est: float
    flagged_accounts: List[Dict[str, Any]]


# ─── Scoring Sub-Components ─────────────────────────────────────────────────

def _score_dti(dti_ratio: float) -> float:
    """Score DTI ratio (0–100). Lower DTI = higher score."""
    if dti_ratio <= 0.20:
        return 100
    elif dti_ratio <= 0.35:
        return 80
    elif dti_ratio <= 0.50:
        return 60
    elif dti_ratio <= 0.70:
        return 35
    else:
        return 10


def _score_avg_rate(avg_rate: float) -> float:
    """Score average interest rate (0–100). Lower rate = higher score."""
    if avg_rate <= 10:
        return 100
    elif avg_rate <= 14:
        return 85
    elif avg_rate <= 20:
        return 60
    elif avg_rate <= 30:
        return 35
    else:
        return 10


def _score_active_accounts(count: int) -> float:
    """Score number of active debt accounts (0–100). Fewer = better."""
    if count <= 2:
        return 100
    elif count <= 4:
        return 75
    elif count <= 6:
        return 50
    elif count <= 8:
        return 30
    else:
        return 10


def _score_utilization(avg_utilization: float) -> float:
    """Score average credit utilization (0–100). Lower = better."""
    if avg_utilization <= 0.30:
        return 100
    elif avg_utilization <= 0.50:
        return 75
    elif avg_utilization <= 0.70:
        return 45
    elif avg_utilization <= 0.90:
        return 20
    else:
        return 5


def _score_payment_history(avg_history: float) -> float:
    """Score average payment history (0–100). Higher = better."""
    return min(100, max(0, avg_history * 100))


# ─── Savings Estimation ─────────────────────────────────────────────────────

def _estimate_savings(
    accounts: List[Dict[str, Any]],
    optimal_rate_low: float = 10.0,
    optimal_rate_high: float = 14.0,
) -> float:
    """
    Estimate annual savings if debts were consolidated at optimal rate.
    Compares current interest payments vs optimal consolidation rate.
    """
    optimal_rate = (optimal_rate_low + optimal_rate_high) / 2  # 12% midpoint
    total_savings = 0.0

    for acc in accounts:
        current_rate = acc.get("interest_rate", 0)
        outstanding = acc.get("outstanding", 0)
        if current_rate > optimal_rate and outstanding > 0:
            current_annual_interest = outstanding * (current_rate / 100)
            optimal_annual_interest = outstanding * (optimal_rate / 100)
            total_savings += current_annual_interest - optimal_annual_interest

    return round(total_savings, 2)


# ─── Flagged Accounts ───────────────────────────────────────────────────────

def _flag_accounts(accounts: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Identify accounts that need attention."""
    flagged = []
    for acc in accounts:
        reasons = []
        if acc.get("status") == "overdue":
            reasons.append("Account is overdue")
        if acc.get("interest_rate", 0) > 24:
            reasons.append(f"High interest rate ({acc['interest_rate']}%)")
        if acc.get("utilization", 0) > 0.75:
            reasons.append(f"High utilization ({acc['utilization'] * 100:.0f}%)")
        if acc.get("payment_history", 1.0) < 0.7:
            reasons.append("Poor payment history")

        if reasons:
            flagged.append({
                "lender_name": acc.get("lender_name", "Unknown"),
                "account_type": acc.get("account_type", "unknown"),
                "reason": "; ".join(reasons),
                "outstanding": acc.get("outstanding", 0),
            })

    return flagged


# ─── Main Calculator ────────────────────────────────────────────────────────

def calculate_health_score(
    accounts: List[Dict[str, Any]],
    monthly_income: Optional[float] = None,
) -> HealthScoreResult:
    """
    Calculate the comprehensive debt health score.

    Args:
        accounts: List of debt account dicts from CIBIL data.
        monthly_income: Optional monthly income for DTI calculation.
                       If not provided, estimated from total EMI.

    Returns:
        HealthScoreResult with score, category, and detailed breakdown.
    """
    if not accounts:
        return HealthScoreResult(
            score=100,
            category="Healthy",
            total_outstanding=0,
            total_emi=0,
            avg_rate=0,
            dti_ratio=0,
            savings_est=0,
            flagged_accounts=[],
        )

    # Aggregate metrics
    active_accounts = [a for a in accounts if a.get("status") in ("active", "overdue")]
    total_outstanding = sum(a.get("outstanding", 0) for a in active_accounts)
    total_emi = sum(a.get("emi_amount", 0) for a in active_accounts)

    # Average interest rate (weighted by outstanding)
    weighted_rates = sum(
        a.get("interest_rate", 0) * a.get("outstanding", 0) for a in active_accounts
    )
    avg_rate = (weighted_rates / total_outstanding) if total_outstanding > 0 else 0

    # DTI ratio
    if monthly_income and monthly_income > 0:
        dti_ratio = total_emi / monthly_income
    else:
        # Estimate: assume EMI is ~40% of income if not provided
        estimated_income = total_emi / 0.4 if total_emi > 0 else 1
        dti_ratio = total_emi / estimated_income

    # Utilization (for revolving credit like credit cards)
    utilization_accounts = [a for a in active_accounts if a.get("utilization", 0) > 0]
    avg_utilization = (
        sum(a.get("utilization", 0) for a in utilization_accounts) / len(utilization_accounts)
        if utilization_accounts
        else 0
    )

    # Payment history
    avg_payment_history = (
        sum(a.get("payment_history", 1.0) for a in active_accounts) / len(active_accounts)
        if active_accounts
        else 1.0
    )

    # Calculate component scores
    dti_score = _score_dti(dti_ratio)
    rate_score = _score_avg_rate(avg_rate)
    accounts_score = _score_active_accounts(len(active_accounts))
    utilization_score = _score_utilization(avg_utilization)
    history_score = _score_payment_history(avg_payment_history)

    # Weighted final score
    final_score = int(
        dti_score * 0.30
        + rate_score * 0.25
        + accounts_score * 0.15
        + utilization_score * 0.15
        + history_score * 0.15
    )
    final_score = max(0, min(100, final_score))

    # Determine category
    if final_score >= 85:
        category = "Healthy"
    elif final_score >= 65:
        category = "Fair"
    elif final_score >= 40:
        category = "Needs Attention"
    else:
        category = "Critical"

    # Savings estimation
    savings_est = _estimate_savings(accounts)

    # Flagged accounts
    flagged = _flag_accounts(accounts)

    return HealthScoreResult(
        score=final_score,
        category=category,
        total_outstanding=round(total_outstanding, 2),
        total_emi=round(total_emi, 2),
        avg_rate=round(avg_rate, 2),
        dti_ratio=round(dti_ratio, 4),
        savings_est=savings_est,
        flagged_accounts=flagged,
    )
