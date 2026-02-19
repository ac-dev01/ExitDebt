import { Account } from "./mockProfiles";

export interface InterestLeak {
    totalEmi: number;
    principal: number;
    interest: number;
    avoidable: number;
}

export interface PaymentAllocation {
    lender: string;
    amount: number;
    savings: number;
}

export interface CashFlowResult {
    salaryDay: number;
    salary: number;
    emis: { day: number; lender: string; amount: number }[];
    totalEmi: number;
    remaining: number;
    ratio: number; // EMI-to-salary percentage
}

/**
 * Calculate interest leak for the current month.
 * Splits total EMI into principal vs interest portions
 * and identifies avoidable interest vs optimal rate.
 */
export function calculateInterestLeak(
    accounts: Account[],
    totalEmi: number,
    totalOutstanding: number,
    optimalRate: number
): InterestLeak {
    // Monthly interest = sum of each account's outstanding × (APR/12/100)
    const interest = accounts.reduce(
        (sum, acc) => sum + (acc.outstanding * acc.apr) / 100 / 12,
        0
    );
    const principal = totalEmi - interest;
    // What interest *would* be at the optimal rate
    const optimalInterest = (totalOutstanding * optimalRate) / 100 / 12;
    const avoidable = Math.max(0, Math.round(interest - optimalInterest));

    return {
        totalEmi,
        principal: Math.round(Math.max(0, principal)),
        interest: Math.round(interest),
        avoidable,
    };
}

/**
 * Allocate extra cash to accounts sorted by highest APR first (avalanche method).
 * Returns per-account allocation and estimated annual savings.
 */
export function calculatePaymentPrioritizer(
    extraAmount: number,
    accounts: Account[],
    optimalRate: number
): PaymentAllocation[] {
    if (extraAmount <= 0) return [];

    const sorted = [...accounts].sort((a, b) => b.apr - a.apr);
    const allocations: PaymentAllocation[] = [];
    let remaining = extraAmount;

    for (const acc of sorted) {
        if (remaining <= 0) break;
        const allocated = Math.min(remaining, acc.outstanding);
        const annualSavings = Math.round((allocated * (acc.apr - optimalRate)) / 100);
        allocations.push({
            lender: acc.lender,
            amount: allocated,
            savings: Math.max(0, annualSavings),
        });
        remaining -= allocated;
    }

    return allocations;
}

/**
 * Calculate salary-day cash flow: lists EMIs in order of due date,
 * computes remaining income after EMIs and EMI-to-salary ratio.
 */
export function calculateCashFlow(
    salary: number,
    salaryDate: number,
    accounts: Account[]
): CashFlowResult {
    const emis = [...accounts]
        .sort((a, b) => a.dueDate - b.dueDate)
        .map((acc) => ({
            day: acc.dueDate,
            lender: acc.lender,
            amount: acc.emi,
        }));

    const totalEmi = emis.reduce((sum, e) => sum + e.amount, 0);
    const remaining = salary - totalEmi;
    const ratio = Math.round((totalEmi / salary) * 100);

    return { salaryDay: salaryDate, salary, emis, totalEmi, remaining, ratio };
}
