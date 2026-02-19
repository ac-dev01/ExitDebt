'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function IncomePage() {
  const router = useRouter();
  const { isAuthenticated, name, setIncomeDetails } = useAuth();
  const [salary, setSalary] = useState('');
  const [salaryDate, setSalaryDate] = useState(5);
  const [error, setError] = useState('');

  // Redirect if not authenticated
  if (typeof window !== 'undefined' && !isAuthenticated) {
    router.replace('/');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const salaryNum = parseInt(salary.replace(/,/g, ''), 10);
    if (!salaryNum || salaryNum < 10000) {
      setError('Please enter a valid monthly salary (minimum ₹10,000).');
      return;
    }
    if (salaryNum > 10000000) {
      setError('Please enter a realistic salary amount.');
      return;
    }

    setIncomeDetails(salaryNum, salaryDate);
    router.push('/dashboard');
  };

  const formatInput = (value: string) => {
    const num = value.replace(/[^0-9]/g, '');
    if (!num) return '';
    return parseInt(num).toLocaleString('en-IN');
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-purple mb-8"
        >
          ← Back
        </Link>

        {/* Card */}
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <Link href="/" className="text-xl font-bold inline-block mb-6">
              <span className="text-text-primary">Exit</span>
              <span className="gradient-text">Debt</span>
            </Link>
            <h1 className="text-2xl font-bold text-text-primary mb-2">
              Almost there, {name}! 👋
            </h1>
            <p className="text-text-secondary text-sm">
              We need a few income details to build your personalized dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Salary Input */}
            <div>
              <label
                htmlFor="salary"
                className="block text-sm font-medium text-text-primary mb-2"
              >
                Monthly Take-Home Salary
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted font-medium">
                  ₹
                </span>
                <input
                  id="salary"
                  type="text"
                  inputMode="numeric"
                  value={salary}
                  onChange={(e) => setSalary(formatInput(e.target.value))}
                  placeholder="60,000"
                  className="w-full pl-8 pr-4 py-3 rounded-lg border border-border focus:border-border-focus focus:ring-2 focus:ring-purple/20 outline-none text-text-primary bg-white transition-colors"
                />
              </div>
              <p className="mt-1 text-xs text-text-muted">
                Net salary after tax deductions
              </p>
            </div>

            {/* Salary Date */}
            <div>
              <label
                htmlFor="salaryDate"
                className="block text-sm font-medium text-text-primary mb-2"
              >
                Salary Credit Date
              </label>
              <select
                id="salaryDate"
                value={salaryDate}
                onChange={(e) => setSalaryDate(parseInt(e.target.value))}
                className="w-full px-4 py-3 rounded-lg border border-border focus:border-border-focus focus:ring-2 focus:ring-purple/20 outline-none text-text-primary bg-white transition-colors appearance-none cursor-pointer"
              >
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <option key={day} value={day}>
                    {day}{day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th'} of every month
                  </option>
                ))}
              </select>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-danger/10 text-danger text-sm px-4 py-2 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 px-6 rounded-lg bg-purple text-white font-semibold text-base hover:opacity-90 transition-opacity shadow-lg shadow-purple/20"
            >
              See My Dashboard →
            </button>
          </form>

          <p className="text-center text-xs text-text-muted mt-6">
            This data stays on your device. We never store your salary information.
          </p>
        </div>
      </div>
    </main>
  );
}
