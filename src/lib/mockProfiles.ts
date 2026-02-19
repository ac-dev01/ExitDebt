export interface Account {
  lender: string;
  outstanding: number;
  apr: number;
  type: "credit_card" | "loan" | "emi";
}

export interface MockProfile {
  name: string;
  panHash: string;
  score: number;
  scoreLabel: string;
  color: "red" | "orange" | "yellow" | "green";
  totalOutstanding: number;
  monthlyEmi: number;
  activeAccounts: number;
  avgInterestRate: number;
  accounts: Account[];
  overpayment: number;
  optimalRate: number;
}

export const mockProfiles: MockProfile[] = [
  {
    name: "Saurabh",
    panHash: "abcde1234f",
    score: 38,
    scoreLabel: "Critical",
    color: "red",
    totalOutstanding: 624000,
    monthlyEmi: 28400,
    activeAccounts: 4,
    avgInterestRate: 22.3,
    accounts: [
      { lender: "HDFC Credit Card", outstanding: 182000, apr: 42, type: "credit_card" },
      { lender: "Bajaj Personal Loan", outstanding: 300000, apr: 14, type: "loan" },
      { lender: "Amazon Pay EMI", outstanding: 42000, apr: 18, type: "emi" },
      { lender: "ICICI Credit Card", outstanding: 100000, apr: 36, type: "credit_card" },
    ],
    overpayment: 47200,
    optimalRate: 12,
  },
  {
    name: "Priya",
    panHash: "fghij5678k",
    score: 72,
    scoreLabel: "Fair",
    color: "yellow",
    totalOutstanding: 320000,
    monthlyEmi: 12500,
    activeAccounts: 2,
    avgInterestRate: 16.2,
    accounts: [
      { lender: "SBI Credit Card", outstanding: 85000, apr: 24, type: "credit_card" },
      { lender: "HDFC Personal Loan", outstanding: 235000, apr: 13.5, type: "loan" },
    ],
    overpayment: 18400,
    optimalRate: 11,
  },
  {
    name: "Rahul",
    panHash: "klmno9012p",
    score: 55,
    scoreLabel: "Needs Attention",
    color: "orange",
    totalOutstanding: 485000,
    monthlyEmi: 19800,
    activeAccounts: 3,
    avgInterestRate: 19.7,
    accounts: [
      { lender: "Axis Credit Card", outstanding: 145000, apr: 38, type: "credit_card" },
      { lender: "Tata Capital Loan", outstanding: 250000, apr: 15, type: "loan" },
      { lender: "Flipkart Pay Later", outstanding: 90000, apr: 21, type: "emi" },
    ],
    overpayment: 32600,
    optimalRate: 11.5,
  },
  {
    name: "Meera",
    panHash: "qrstu3456v",
    score: 85,
    scoreLabel: "Good",
    color: "green",
    totalOutstanding: 180000,
    monthlyEmi: 8200,
    activeAccounts: 2,
    avgInterestRate: 13.8,
    accounts: [
      { lender: "Kotak Personal Loan", outstanding: 150000, apr: 12.5, type: "loan" },
      { lender: "CRED Pay EMI", outstanding: 30000, apr: 16, type: "emi" },
    ],
    overpayment: 5400,
    optimalRate: 11,
  },
];
