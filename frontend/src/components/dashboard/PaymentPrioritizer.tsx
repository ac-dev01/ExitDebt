'use client';

import React, { useState } from 'react';
import { calculatePrioritizer } from '@/lib/calculations';
import type { DebtAccountProfile } from '@/lib/mockProfiles';

interface PaymentPrioritizerProps {
  accounts: DebtAccountProfile[];
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function PaymentPrioritizer({ accounts }: PaymentPrioritizerProps) {
  const [inputValue, setInputValue] = useState('');
  const [allocations, setAllocations] = useState<ReturnType<typeof calculatePrioritizer>>([]);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(inputValue.replace(/[^0-9]/g, ''), 10);
    if (!amount || amount <= 0) return;
    const result = calculatePrioritizer(accounts, amount);
    setAllocations(result);
  };

  const formatInput = (value: string) => {
    const num = value.replace(/[^0-9]/g, '');
    if (!num) return '';
    return parseInt(num).toLocaleString('en-IN');
  };

  return (
    <div className="glass-card p-6 animate-fade-in-up animate-delay-3">
      <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4">
        💰 Smart Payment Prioritizer
      </h3>

      <p className="text-sm text-text-secondary mb-4">
        Have extra cash? Enter the amount and we&apos;ll tell you where to put it for maximum savings.
      </p>

      <form onSubmit={handleCalculate} className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted font-medium">₹</span>
          <input
            type="text"
            inputMode="numeric"
            value={inputValue}
            onChange={(e) => setInputValue(formatInput(e.target.value))}
            placeholder="10,000"
            className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-border focus:border-border-focus focus:ring-2 focus:ring-purple/20 outline-none text-text-primary bg-white text-sm transition-colors"
          />
        </div>
        <button
          type="submit"
          className="px-5 py-2.5 rounded-lg bg-purple text-white font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          Advise
        </button>
      </form>

      {/* Results */}
      {allocations.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">
            Recommended Allocation
          </p>
          {allocations.map((alloc, i) => (
            <div
              key={alloc.accountId}
              className="flex items-center justify-between p-3 rounded-lg bg-bg-soft border border-border"
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  i === 0 ? 'bg-purple/10 text-purple' : 'bg-bg-soft text-text-muted border border-border'
                }`}>
                  {i + 1}
                </div>
                <div>
                  <div className="text-sm font-semibold text-text-primary">{alloc.lenderName}</div>
                  <div className="text-xs text-success">Saves {formatCurrency(alloc.annualSavings)}/yr</div>
                </div>
              </div>
              <div className="font-bold text-sm text-text-primary">
                {formatCurrency(alloc.allocation)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
