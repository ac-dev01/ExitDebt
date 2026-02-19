'use client';

import React from 'react';
import type { InterestLeakResult } from '@/lib/calculations';

interface InterestLeakProps {
  data: InterestLeakResult;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function InterestLeak({ data }: InterestLeakProps) {
  const principalPct = data.totalEMI > 0 ? Math.round((data.toPrincipal / data.totalEMI) * 100) : 50;
  const interestPct = 100 - principalPct;

  return (
    <div className="glass-card p-6 animate-fade-in-up animate-delay-2">
      <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-6">
        💸 Interest Leak Report (This Month)
      </h3>

      <div className="mb-6">
        <div className="text-2xl font-bold text-text-primary mb-1">
          {formatCurrency(data.totalEMI)}
        </div>
        <div className="text-sm text-text-secondary">Total Monthly EMI</div>
      </div>

      {/* Visual split bar */}
      <div className="h-4 w-full flex rounded-full overflow-hidden mb-4 bg-bg-soft">
        <div className="h-full bg-blue" style={{ width: `${principalPct}%` }} />
        <div className="h-full bg-warning" style={{ width: `${interestPct}%` }} />
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-blue" />
            <span className="text-text-secondary font-medium">Principal</span>
          </div>
          <div className="font-bold text-text-primary pl-4">{formatCurrency(data.toPrincipal)}</div>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-warning" />
            <span className="text-text-secondary font-medium">Interest</span>
          </div>
          <div className="font-bold text-text-primary pl-4">{formatCurrency(data.toInterest)}</div>
        </div>
      </div>

      {/* Avoidable alert */}
      {data.avoidableInterest > 0 && (
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex gap-3 items-start">
            <div className="shrink-0 w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center text-warning font-bold text-sm">
              !
            </div>
            <p className="text-sm text-text-secondary">
              <strong className="text-text-primary block mb-0.5">Avoidable Interest</strong>
              {formatCurrency(data.avoidableInterest)} of your monthly interest is avoidable with better rates.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
