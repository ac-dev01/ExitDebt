'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

interface IncomeOverlayProps {
  onComplete: () => void;
}

export default function IncomeOverlay({ onComplete }: IncomeOverlayProps) {
  const { setIncomeDetails } = useAuth();

  const [salary, setSalary] = useState('');
  const [date, setDate] = useState('1');
  const [error, setError] = useState('');

  const formatDisplay = (val: string) => {
    const num = val.replace(/\D/g, '');
    if (!num) return '';
    return new Intl.NumberFormat('en-IN').format(Number(num));
  };

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    setSalary(raw);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const numSalary = Number(salary);
    if (!numSalary || numSalary < 5000) {
      setError('Please enter a valid monthly salary (min ₹5,000).');
      return;
    }

    const numDate = Number(date);
    if (numDate < 1 || numDate > 31) {
      setError('Please select a valid salary date (1–31).');
      return;
    }

    setIncomeDetails(numSalary, numDate);
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-text-primary/40 backdrop-blur-sm" />

      {/* Overlay card */}
      <div className="relative w-full max-w-md bg-bg-card rounded-2xl border border-border shadow-2xl p-8 animate-fade-in-up">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple/10 text-purple text-xl mb-3">
            💰
          </div>
          <h2 className="text-xl font-bold text-text-primary">One Last Step</h2>
          <p className="text-sm text-text-secondary mt-1">
            We need your income details to calculate your debt health accurately.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Salary */}
          <div>
            <label htmlFor="salary" className="block text-sm font-medium text-text-primary mb-1.5">
              Monthly Take-Home Salary
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-border bg-bg-soft text-text-muted text-sm font-medium">
                ₹
              </span>
              <input
                id="salary"
                type="text"
                inputMode="numeric"
                value={formatDisplay(salary)}
                onChange={handleSalaryChange}
                placeholder="60,000"
                className="w-full px-4 py-3 rounded-r-xl border border-border bg-bg-soft text-text-primary placeholder:text-text-muted focus:border-purple focus:outline-none focus:ring-2 focus:ring-purple/10 transition-all text-lg font-semibold"
                autoFocus
              />
            </div>
            <p className="text-xs text-text-muted mt-1">After-tax salary credited to your bank</p>
          </div>

          {/* Salary Date */}
          <div>
            <label htmlFor="salary-date" className="block text-sm font-medium text-text-primary mb-1.5">
              Salary Credit Date
            </label>
            <select
              id="salary-date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-bg-soft text-text-primary focus:border-purple focus:outline-none focus:ring-2 focus:ring-purple/10 transition-all appearance-none"
            >
              {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>
                  {d}{d === 1 ? 'st' : d === 2 ? 'nd' : d === 3 ? 'rd' : 'th'} of every month
                </option>
              ))}
            </select>
            <p className="text-xs text-text-muted mt-1">Day your employer credits salary</p>
          </div>

          {error && (
            <div className="bg-danger/10 text-danger text-sm px-4 py-2 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 px-6 rounded-xl bg-purple text-white font-semibold text-base hover:opacity-90 transition-opacity shadow-lg shadow-purple/20"
          >
            See My Dashboard →
          </button>

          <p className="text-xs text-text-muted text-center">
            🔒 Your income data is encrypted and never shared with third parties.
          </p>
        </form>
      </div>
    </div>
  );
}
