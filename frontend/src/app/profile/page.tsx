'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, name, pan, phone, monthlySalary, salaryDate, mockProfile, logout } = useAuth();

  if (typeof window !== 'undefined' && !isAuthenticated) {
    router.replace('/');
    return null;
  }

  const maskedPan = pan ? `${pan.slice(0, 2)}****${pan.slice(-2)}` : '—';
  const maskedPhone = phone ? `+91 ${phone.slice(0, 2)}****${phone.slice(-4)}` : '—';

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-text-primary mb-6">Your Profile</h1>

          <div className="glass-card overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-border flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-purple/10 text-purple flex items-center justify-center text-xl font-bold">
                {name?.charAt(0) || 'U'}
              </div>
              <div>
                <h2 className="text-lg font-bold text-text-primary">{name || 'User'}</h2>
                <p className="text-sm text-text-secondary flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-success" />
                  Verified via PAN
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="p-6 grid sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest">Personal</h3>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 w-8 h-8 rounded-lg bg-bg-soft flex items-center justify-center text-purple text-sm">📱</div>
                  <div>
                    <p className="text-xs text-text-muted mb-0.5">Phone</p>
                    <p className="text-sm font-medium text-text-primary">{maskedPhone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 w-8 h-8 rounded-lg bg-bg-soft flex items-center justify-center text-purple text-sm">💳</div>
                  <div>
                    <p className="text-xs text-text-muted mb-0.5">PAN</p>
                    <p className="text-sm font-medium text-text-primary">{maskedPan}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest">Financial</h3>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 w-8 h-8 rounded-lg bg-bg-soft flex items-center justify-center text-purple text-sm">💰</div>
                  <div>
                    <p className="text-xs text-text-muted mb-0.5">Monthly Salary</p>
                    <p className="text-sm font-medium text-text-primary">
                      {monthlySalary > 0
                        ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(monthlySalary)
                        : 'Not set'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 w-8 h-8 rounded-lg bg-bg-soft flex items-center justify-center text-purple text-sm">📅</div>
                  <div>
                    <p className="text-xs text-text-muted mb-0.5">Salary Credit Date</p>
                    <p className="text-sm font-medium text-text-primary">{salaryDate > 0 ? `${salaryDate}th of every month` : 'Not set'}</p>
                  </div>
                </div>

                {mockProfile && (
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 w-8 h-8 rounded-lg bg-bg-soft flex items-center justify-center text-purple text-sm">📊</div>
                    <div>
                      <p className="text-xs text-text-muted mb-0.5">CIBIL Score</p>
                      <p className="text-sm font-medium text-text-primary">{mockProfile.creditScore}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-border flex flex-col sm:flex-row gap-3">
              <Link
                href="/"
                className="flex-1 text-center py-2.5 px-4 rounded-lg bg-purple text-white font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                ← Back to Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="flex-1 text-center py-2.5 px-4 rounded-lg border border-border text-text-secondary font-medium text-sm hover:bg-bg-soft transition-colors"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
