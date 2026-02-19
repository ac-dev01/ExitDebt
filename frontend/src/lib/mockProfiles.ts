/**
 * Mock user profiles simulating CIBIL data.
 * Selected based on the first letter of the user's PAN.
 */

export interface DebtAccountProfile {
  id: string;
  lender_name: string;
  account_type: 'Credit Card' | 'Personal Loan' | 'Consumer Loan' | 'Auto Loan' | 'Home Loan';
  outstanding: number;
  credit_limit: number | null;
  interest_rate: number;
  emi_amount: number;
  due_date: number; // day of month (1-31)
  status: 'active' | 'overdue';
  missed_payments: number;
}

export interface MockProfile {
  name: string;
  creditScore: number;
  debtAccounts: DebtAccountProfile[];
}

// ─── Profile A: High Stress (PAN starts A-F) ─────────────────────────────
const profileA: MockProfile = {
  name: 'Saurabh',
  creditScore: 642,
  debtAccounts: [
    {
      id: 'a1',
      lender_name: 'HDFC Credit Card',
      account_type: 'Credit Card',
      outstanding: 182000,
      credit_limit: 250000,
      interest_rate: 42,
      emi_amount: 5400,
      due_date: 7,
      status: 'overdue',
      missed_payments: 2,
    },
    {
      id: 'a2',
      lender_name: 'Bajaj Personal Loan',
      account_type: 'Personal Loan',
      outstanding: 300000,
      credit_limit: null,
      interest_rate: 14,
      emi_amount: 12000,
      due_date: 10,
      status: 'active',
      missed_payments: 0,
    },
    {
      id: 'a3',
      lender_name: 'Amazon Pay EMI',
      account_type: 'Consumer Loan',
      outstanding: 42000,
      credit_limit: null,
      interest_rate: 18,
      emi_amount: 3500,
      due_date: 15,
      status: 'active',
      missed_payments: 1,
    },
    {
      id: 'a4',
      lender_name: 'ICICI Credit Card',
      account_type: 'Credit Card',
      outstanding: 100000,
      credit_limit: 150000,
      interest_rate: 36,
      emi_amount: 7500,
      due_date: 20,
      status: 'overdue',
      missed_payments: 3,
    },
  ],
};

// ─── Profile B: Moderate (PAN starts G-N) ─────────────────────────────────
const profileB: MockProfile = {
  name: 'Priya',
  creditScore: 720,
  debtAccounts: [
    {
      id: 'b1',
      lender_name: 'SBI Personal Loan',
      account_type: 'Personal Loan',
      outstanding: 200000,
      credit_limit: null,
      interest_rate: 12,
      emi_amount: 8500,
      due_date: 5,
      status: 'active',
      missed_payments: 0,
    },
    {
      id: 'b2',
      lender_name: 'Axis Credit Card',
      account_type: 'Credit Card',
      outstanding: 85000,
      credit_limit: 200000,
      interest_rate: 24,
      emi_amount: 4200,
      due_date: 12,
      status: 'active',
      missed_payments: 1,
    },
    {
      id: 'b3',
      lender_name: 'HDFC Auto Loan',
      account_type: 'Auto Loan',
      outstanding: 65000,
      credit_limit: null,
      interest_rate: 9.5,
      emi_amount: 5800,
      due_date: 18,
      status: 'active',
      missed_payments: 0,
    },
  ],
};

// ─── Profile C: Healthy (PAN starts O-Z) ──────────────────────────────────
const profileC: MockProfile = {
  name: 'Arjun',
  creditScore: 785,
  debtAccounts: [
    {
      id: 'c1',
      lender_name: 'HDFC Home Loan',
      account_type: 'Home Loan',
      outstanding: 1500000,
      credit_limit: null,
      interest_rate: 8.5,
      emi_amount: 15000,
      due_date: 1,
      status: 'active',
      missed_payments: 0,
    },
    {
      id: 'c2',
      lender_name: 'Kotak Credit Card',
      account_type: 'Credit Card',
      outstanding: 30000,
      credit_limit: 300000,
      interest_rate: 18,
      emi_amount: 3000,
      due_date: 22,
      status: 'active',
      missed_payments: 0,
    },
  ],
};

/**
 * Select a mock profile based on the first letter of the PAN.
 * A-F → high stress, G-N → moderate, O-Z → healthy
 */
export function selectProfile(pan: string): MockProfile {
  const firstChar = pan.charAt(0).toUpperCase();
  if (firstChar >= 'A' && firstChar <= 'F') return { ...profileA };
  if (firstChar >= 'G' && firstChar <= 'N') return { ...profileB };
  return { ...profileC };
}
