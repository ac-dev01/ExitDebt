'use client';

import React from 'react';
import type { DebtAccountProfile } from '@/lib/mockProfiles';

interface DebtSummaryProps {
  accounts: DebtAccountProfile[];
  totalOutstanding: number;
  totalEMI: number;
  avgRate: number;
  annualSavings: number;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function DebtSummary({
  accounts,
  totalOutstanding,
  totalEMI,
  avgRate,
  annualSavings,
}: DebtSummaryProps) {
  return (
    <div className="animate-fade-in-up animate-delay-1">
      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Outstanding', value: formatCurrency(totalOutstanding), color: 'text-text-primary' },
          { label: 'Monthly EMI', value: formatCurrency(totalEMI), color: 'text-text-primary' },
          { label: 'Active Accounts', value: String(accounts.length), color: 'text-text-primary' },
          { label: 'Avg Rate', value: `${avgRate.toFixed(1)}%`, color: avgRate > 20 ? 'text-danger' : 'text-blue' },
        ].map((item, i) => (
          <div key={i} className="glass-card p-4">
            <p className="text-xs text-text-muted mb-1">{item.label}</p>
            <p className={`text-lg font-bold ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Savings callout */}
      {annualSavings > 0 && (
        <div className="glass-card p-4 mb-6 border-l-4 border-danger">
          <p className="text-sm font-semibold text-text-primary">
            You&apos;re overpaying ~{formatCurrency(annualSavings)} every year in excess interest.
          </p>
        </div>
      )}

      {/* Account list */}
      <div className="glass-card p-6">
        <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4">
          Your Debt Accounts
        </h3>
        <div className="space-y-3">
          {accounts.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between p-3 rounded-lg bg-bg-soft border border-border"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-text-primary truncate">
                    {a.lender_name}
                  </span>
                  {a.interest_rate > 18 && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-danger/10 text-danger font-medium">
                      ⚠️ High
                    </span>
                  )}
                </div>
                <p className="text-xs text-text-muted mt-0.5">{a.account_type}</p>
              </div>
              <div className="text-right ml-4">
                <p className="text-sm font-bold text-text-primary">{formatCurrency(a.outstanding)}</p>
                <p className="text-xs text-text-muted">{a.interest_rate}% APR</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
