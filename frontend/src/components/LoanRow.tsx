import React from 'react';

interface LoanRowProps {
    lenderName: string;
    accountType: string;
    outstanding: number;
    interestRate: number | null;
    emiAmount: number | null;
    status: string;
}

const statusColors: Record<string, string> = {
    active: 'bg-blue/10 text-blue',
    closed: 'bg-text-muted/10 text-text-muted',
    overdue: 'bg-danger/10 text-danger',
    written_off: 'bg-danger/15 text-danger',
};

const typeLabels: Record<string, string> = {
    personal_loan: 'Personal Loan',
    credit_card: 'Credit Card',
    home_loan: 'Home Loan',
    auto_loan: 'Auto Loan',
    education_loan: 'Education Loan',
    business_loan: 'Business Loan',
};

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount);
}

export default function LoanRow({
    lenderName,
    accountType,
    outstanding,
    interestRate,
    emiAmount,
    status,
}: LoanRowProps) {
    return (
        <div className="glass-card p-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-purple/20 transition-colors duration-200">
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-semibold text-text-primary truncate text-sm">{lenderName}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[status] || statusColors.active}`}>
                        {status.toUpperCase()}
                    </span>
                </div>
                <p className="text-sm text-text-muted">{typeLabels[accountType] || accountType}</p>
            </div>
            <div className="flex gap-6 text-sm">
                <div>
                    <p className="text-text-muted text-xs">Outstanding</p>
                    <p className="font-semibold text-text-primary">{formatCurrency(outstanding)}</p>
                </div>
                {interestRate !== null && (
                    <div>
                        <p className="text-text-muted text-xs">Rate</p>
                        <p className={`font-semibold ${interestRate > 24 ? 'text-danger' : 'text-text-primary'}`}>
                            {interestRate}%
                        </p>
                    </div>
                )}
                {emiAmount !== null && emiAmount > 0 && (
                    <div>
                        <p className="text-text-muted text-xs">EMI</p>
                        <p className="font-semibold text-text-primary">{formatCurrency(emiAmount)}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
