/**
 * All PRD algorithms for the Debt Intelligence Dashboard.
 * Pure functions — no side effects, no API calls.
 */

import type { DebtAccountProfile } from './mockProfiles';

// ─── Types ────────────────────────────────────────────────────────────────

export interface ScoreBreakdown {
  score: number;
  dtiScore: number;
  rateScore: number;
  accountsScore: number;
  utilizationScore: number;
  paymentScore: number;
}

export interface ScoreCategory {
  label: string;
  emoji: string;
  color: string;
  message: string;
}

export interface FreedomGPSResult {
  currentMonths: number;
  optimizedMonths: number;
  monthsSaved: number;
}

export interface InterestLeakResult {
  totalEMI: number;
  toPrincipal: number;
  toInterest: number;
  avoidableInterest: number;
}

export interface PrioritizerAllocation {
  accountId: string;
  lenderName: string;
  allocation: number;
  annualSavings: number;
}

export interface CashFlowEntry {
  day: number;
  label: string;
  amount: number; // positive = inflow, negative = outflow
  type: 'salary' | 'emi';
}

export interface CashFlowResult {
  entries: CashFlowEntry[];
  totalEMI: number;
  remainingAfterEMI: number;
  emiToSalaryRatio: number;
}

// ─── Formatters ───────────────────────────────────────────────────────────

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatMonths(months: number): string {
  const years = Math.floor(months / 12);
  const mo = months % 12;
  if (years === 0) return `${mo}mo`;
  if (mo === 0) return `${years}y`;
  return `${years}y ${mo}mo`;
}

// ─── Debt Health Score (PRD Section 3) ────────────────────────────────────

export function calculateDebtHealthScore(
  accounts: DebtAccountProfile[],
  monthlySalary: number
): ScoreBreakdown {
  if (accounts.length === 0) {
    return { score: 100, dtiScore: 30, rateScore: 25, accountsScore: 15, utilizationScore: 15, paymentScore: 15 };
  }

  const totalEMI = accounts.reduce((sum, a) => sum + a.emi_amount, 0);
  const totalOutstanding = accounts.reduce((sum, a) => sum + a.outstanding, 0);

  // 1. DTI Ratio (30%)
  const dtiRatio = monthlySalary > 0 ? (totalEMI / monthlySalary) * 100 : 100;
  let dtiScore: number;
  if (dtiRatio < 30) dtiScore = 30;
  else if (dtiRatio < 50) dtiScore = 20;
  else if (dtiRatio < 70) dtiScore = 10;
  else dtiScore = 0;

  // 2. Average Interest Rate (25%)
  const weightedRate = totalOutstanding > 0
    ? accounts.reduce((sum, a) => sum + a.interest_rate * a.outstanding, 0) / totalOutstanding
    : 0;
  let rateScore: number;
  if (weightedRate < 12) rateScore = 25;
  else if (weightedRate < 18) rateScore = 18;
  else if (weightedRate < 30) rateScore = 10;
  else rateScore = 0;

  // 3. Number of Active Accounts (15%)
  const activeCount = accounts.length;
  let accountsScore: number;
  if (activeCount <= 2) accountsScore = 15;
  else if (activeCount <= 4) accountsScore = 10;
  else if (activeCount <= 6) accountsScore = 5;
  else accountsScore = 0;

  // 4. Credit Utilization (15%) — only for credit cards
  const cards = accounts.filter(a => a.account_type === 'Credit Card' && a.credit_limit);
  let utilizationScore: number;
  if (cards.length === 0) {
    utilizationScore = 15; // no revolving credit = good
  } else {
    const totalUsed = cards.reduce((s, a) => s + a.outstanding, 0);
    const totalLimit = cards.reduce((s, a) => s + (a.credit_limit || 0), 0);
    const utilization = totalLimit > 0 ? (totalUsed / totalLimit) * 100 : 0;
    if (utilization < 30) utilizationScore = 15;
    else if (utilization < 50) utilizationScore = 10;
    else if (utilization < 75) utilizationScore = 5;
    else utilizationScore = 0;
  }

  // 5. Payment History (15%)
  const totalMissed = accounts.reduce((s, a) => s + a.missed_payments, 0);
  let paymentScore: number;
  if (totalMissed === 0) paymentScore = 15;
  else if (totalMissed <= 2) paymentScore = 10;
  else paymentScore = 0;

  const score = dtiScore + rateScore + accountsScore + utilizationScore + paymentScore;

  return { score, dtiScore, rateScore, accountsScore, utilizationScore, paymentScore };
}

export function getScoreCategory(score: number): ScoreCategory {
  if (score >= 80) return { label: 'Healthy', emoji: '✅', color: '#22C55E', message: 'Your debt structure is well-managed.' };
  if (score >= 60) return { label: 'Fair', emoji: '⚡', color: '#F59E0B', message: "There's room to optimize and save." };
  if (score >= 40) return { label: 'Needs Attention', emoji: '⚠️', color: '#F97316', message: 'Your debt is costing you more than necessary.' };
  return { label: 'Critical', emoji: '🚨', color: '#EF4444', message: 'Your debt structure needs immediate restructuring.' };
}

// ─── Savings Calculation ──────────────────────────────────────────────────

const OPTIMAL_RATE = 12; // Estimated best consolidation rate

export function calculateAnnualSavings(accounts: DebtAccountProfile[]): number {
  return accounts.reduce((total, a) => {
    if (a.interest_rate > OPTIMAL_RATE) {
      const currentCost = a.outstanding * (a.interest_rate / 100);
      const optimalCost = a.outstanding * (OPTIMAL_RATE / 100);
      return total + (currentCost - optimalCost);
    }
    return total;
  }, 0);
}

// ─── Freedom GPS (RS-05) ─────────────────────────────────────────────────

export function calculateFreedomGPS(
  accounts: DebtAccountProfile[],
  extraMonthlyPayment: number = 0
): FreedomGPSResult {
  // Calculate months to payoff at current pace
  const currentMonths = estimatePayoffMonths(accounts, 0);
  // Calculate months with optimized rates (12%) + extra payments
  const optimizedMonths = estimatePayoffMonths(accounts, extraMonthlyPayment, true);

  return {
    currentMonths,
    optimizedMonths,
    monthsSaved: Math.max(0, currentMonths - optimizedMonths),
  };
}

function estimatePayoffMonths(
  accounts: DebtAccountProfile[],
  extraMonthly: number,
  useOptimalRate: boolean = false
): number {
  if (accounts.length === 0) return 0;

  let maxMonths = 0;
  const totalEMI = accounts.reduce((s, a) => s + a.emi_amount, 0);

  for (const account of accounts) {
    const rate = useOptimalRate ? Math.min(account.interest_rate, OPTIMAL_RATE) : account.interest_rate;
    const monthlyRate = rate / 100 / 12;
    let balance = account.outstanding;
    // Proportional extra payment
    const extraForThis = totalEMI > 0 ? extraMonthly * (account.emi_amount / totalEMI) : 0;
    const payment = account.emi_amount + extraForThis;

    if (monthlyRate === 0) {
      const months = balance > 0 && payment > 0 ? Math.ceil(balance / payment) : 0;
      maxMonths = Math.max(maxMonths, months);
      continue;
    }

    let months = 0;
    while (balance > 0 && months < 360) {
      const interest = balance * monthlyRate;
      const principal = payment - interest;
      if (principal <= 0) { maxMonths = 360; break; }
      balance -= principal;
      months++;
    }
    maxMonths = Math.max(maxMonths, months);
  }

  return Math.min(maxMonths, 360);
}

// ─── Interest Leak Report (RS-06) ────────────────────────────────────────

export function calculateInterestLeak(accounts: DebtAccountProfile[]): InterestLeakResult {
  let totalEMI = 0;
  let toInterest = 0;
  let avoidableInterest = 0;

  for (const a of accounts) {
    totalEMI += a.emi_amount;
    const monthlyInterest = a.outstanding * (a.interest_rate / 100 / 12);
    toInterest += monthlyInterest;

    if (a.interest_rate > OPTIMAL_RATE) {
      const optimalInterest = a.outstanding * (OPTIMAL_RATE / 100 / 12);
      avoidableInterest += monthlyInterest - optimalInterest;
    }
  }

  const toPrincipal = totalEMI - toInterest;

  return {
    totalEMI: Math.round(totalEMI),
    toPrincipal: Math.round(Math.max(0, toPrincipal)),
    toInterest: Math.round(toInterest),
    avoidableInterest: Math.round(avoidableInterest),
  };
}

// ─── Smart Payment Prioritizer (RS-07) ───────────────────────────────────

export function calculatePrioritizer(
  accounts: DebtAccountProfile[],
  extraAmount: number
): PrioritizerAllocation[] {
  if (extraAmount <= 0 || accounts.length === 0) return [];

  // Avalanche method: highest interest rate first
  const sorted = [...accounts]
    .filter(a => a.interest_rate > 0)
    .sort((a, b) => b.interest_rate - a.interest_rate);

  const allocations: PrioritizerAllocation[] = [];
  let remaining = extraAmount;

  for (const account of sorted) {
    if (remaining <= 0) break;

    const alloc = Math.min(remaining, account.outstanding);
    const annualSavings = alloc * (account.interest_rate / 100);

    allocations.push({
      accountId: account.id,
      lenderName: account.lender_name,
      allocation: Math.round(alloc),
      annualSavings: Math.round(annualSavings),
    });

    remaining -= alloc;
  }

  return allocations;
}

// ─── Salary Day Cash Flow (RS-08) ────────────────────────────────────────

export function calculateCashFlow(
  accounts: DebtAccountProfile[],
  monthlySalary: number,
  salaryDate: number
): CashFlowResult {
  const entries: CashFlowEntry[] = [];

  // Add salary entry
  entries.push({
    day: salaryDate,
    label: 'Salary Credit',
    amount: monthlySalary,
    type: 'salary',
  });

  // Add EMI entries
  let totalEMI = 0;
  for (const a of accounts) {
    entries.push({
      day: a.due_date,
      label: a.lender_name,
      amount: -a.emi_amount,
      type: 'emi',
    });
    totalEMI += a.emi_amount;
  }

  // Sort by day
  entries.sort((a, b) => a.day - b.day);

  const remainingAfterEMI = monthlySalary - totalEMI;
  const emiToSalaryRatio = monthlySalary > 0 ? (totalEMI / monthlySalary) * 100 : 0;

  return {
    entries,
    totalEMI,
    remainingAfterEMI,
    emiToSalaryRatio: Math.round(emiToSalaryRatio),
  };
}

// ─── Average weighted interest rate ──────────────────────────────────────

export function getWeightedAvgRate(accounts: DebtAccountProfile[]): number {
  const totalOutstanding = accounts.reduce((s, a) => s + a.outstanding, 0);
  if (totalOutstanding === 0) return 0;
  const weighted = accounts.reduce((s, a) => s + a.interest_rate * a.outstanding, 0);
  return weighted / totalOutstanding;
}
