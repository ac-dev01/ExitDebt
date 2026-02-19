'use client';

import React from 'react';
import type { CashFlowResult } from '@/lib/calculations';

interface SalaryCashFlowProps {
  data: CashFlowResult;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Math.abs(amount));
}

function ordinal(day: number): string {
  if (day === 1 || day === 21 || day === 31) return `${day}st`;
  if (day === 2 || day === 22) return `${day}nd`;
  if (day === 3 || day === 23) return `${day}rd`;
  return `${day}th`;
}

export default function SalaryCashFlow({ data }: SalaryCashFlowProps) {
  return (
    <div className="glass-card p-6 animate-fade-in-up animate-delay-3">
      <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-6">
        📅 Salary Day Cash Flow
      </h3>

      {/* Timeline */}
      <div className="relative pl-6 border-l-2 border-border space-y-5">
        {data.entries.map((entry, i) => (
          <div key={i} className="relative">
            <div
              className={`absolute -left-[25px] top-1 h-3 w-3 rounded-full border-2 border-white shadow-sm ${
                entry.type === 'salary' ? 'bg-success' : 'bg-text-muted'
              }`}
            />
            <div className="flex justify-between items-baseline mb-0.5">
              <span className={`text-sm ${entry.type === 'salary' ? 'font-bold text-text-primary' : 'font-medium text-text-secondary'}`}>
                {entry.label}
              </span>
              <span className={`text-sm font-medium ${entry.amount > 0 ? 'text-success' : 'text-text-primary'}`}>
                {entry.amount > 0 ? '+' : '-'} {formatCurrency(entry.amount)}
              </span>
            </div>
            <p className="text-xs text-text-muted">{ordinal(entry.day)} of Month</p>
          </div>
        ))}

        {/* Net result */}
        <div className="relative pt-2">
          <div className="absolute -left-[25px] top-4 h-3 w-3 rounded-full bg-purple border-2 border-white shadow-sm" />
          <div className="p-4 bg-bg-soft rounded-lg border border-border">
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-sm font-bold text-text-primary">After All EMIs</span>
              <span className={`text-lg font-bold ${data.remainingAfterEMI >= 0 ? 'text-text-primary' : 'text-danger'}`}>
                {formatCurrency(data.remainingAfterEMI)}
              </span>
            </div>
            <div className="w-full bg-border h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full ${data.emiToSalaryRatio > 50 ? 'bg-danger' : data.emiToSalaryRatio > 40 ? 'bg-warning' : 'bg-success'}`}
                style={{ width: `${Math.min(data.emiToSalaryRatio, 100)}%` }}
              />
            </div>
            <p className="text-xs text-text-muted mt-2">
              EMI-to-Salary:{' '}
              <span className={`font-medium ${data.emiToSalaryRatio > 50 ? 'text-danger' : 'text-text-primary'}`}>
                {data.emiToSalaryRatio}%
              </span>
              {data.emiToSalaryRatio > 50 && ' ⚠️'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
