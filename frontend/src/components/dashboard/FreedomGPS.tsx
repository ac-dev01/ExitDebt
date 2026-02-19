'use client';

import React from 'react';
import { formatMonths } from '@/lib/calculations';
import type { FreedomGPSResult } from '@/lib/calculations';

interface FreedomGPSProps {
  data: FreedomGPSResult;
}

export default function FreedomGPS({ data }: FreedomGPSProps) {
  const maxMonths = Math.max(data.currentMonths, data.optimizedMonths, 1);
  const currentWidth = Math.round((data.currentMonths / maxMonths) * 100);
  const optimizedWidth = Math.round((data.optimizedMonths / maxMonths) * 100);

  return (
    <div className="glass-card p-6 animate-fade-in-up animate-delay-2">
      <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-6">
        🧭 Debt Freedom GPS
      </h3>

      <div className="space-y-6">
        {/* Current Path */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-text-secondary font-medium">Current Path</span>
            <span className="text-text-primary font-bold">{formatMonths(data.currentMonths)}</span>
          </div>
          <div className="h-3 w-full bg-bg-soft rounded-full overflow-hidden">
            <div
              className="h-full bg-text-muted rounded-full transition-all duration-1000"
              style={{ width: `${currentWidth}%` }}
            />
          </div>
        </div>

        {/* Optimized Path */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-purple font-bold">With Restructuring</span>
            <span className="text-purple font-bold">{formatMonths(data.optimizedMonths)}</span>
          </div>
          <div className="h-3 w-full bg-purple/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple rounded-full transition-all duration-1000"
              style={{ width: `${optimizedWidth}%` }}
            />
          </div>
          {data.monthsSaved > 0 && (
            <p className="text-xs text-success font-medium mt-2 text-right">
              ⚡ {data.monthsSaved} months sooner
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
