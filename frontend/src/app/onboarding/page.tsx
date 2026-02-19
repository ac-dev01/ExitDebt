'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

type Step = 'form' | 'otp' | 'loading';

export default function OnboardingPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [step, setStep] = useState<Step>('form');
  const [pan, setPan] = useState('');
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);
  const [consentPartner, setConsentPartner] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  // PRD OB-01: PAN validation (AAAAA9999A)
  const validatePan = (value: string): boolean => {
    return /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(value.toUpperCase());
  };

  // PRD OB-02: Phone validation (10 digits)
  const validatePhone = (value: string): boolean => {
    return /^[6-9]\d{9}$/.test(value);
  };

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validatePan(pan)) {
      setError('Please enter a valid PAN (e.g., ABCDE1234F).');
      return;
    }
    if (!validatePhone(phone)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    // PRD OB-04: Consent checkbox must be checked
    if (!consent) {
      setError('Please consent to the credit report check to proceed.');
      return;
    }

    // Move to OTP step
    setStep('otp');
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (otp.length !== 6) {
      setError('Please enter the 6-digit OTP.');
      return;
    }

    // PRD OB-06: Simulated loading state
    setStep('loading');

    // Simulate CIBIL pull delay (PRD: 3-8 sec, we use 2s for MVP)
    setTimeout(() => {
      login(pan.toUpperCase(), phone);
      router.push('/');
    }, 2000);
  };

  // ─── Form Step ────────────────────────────────────────────────
  if (step === 'form') {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-purple mb-8"
          >
            ← Back to Home
          </Link>

          <div className="glass-card p-8">
            <div className="text-center mb-8">
              <Link href="/" className="text-xl font-bold inline-block mb-4">
                <span className="text-text-primary">Exit</span>
                <span className="gradient-text">Debt</span>
              </Link>
              <h1 className="text-2xl font-bold text-text-primary mb-2">
                Check your debt health
              </h1>
              <p className="text-text-secondary text-sm">
                Takes 30 seconds. Completely free.
              </p>
            </div>

            <form onSubmit={handleSendOTP} className="space-y-5">
              {/* PAN Input */}
              <div>
                <label htmlFor="pan" className="block text-sm font-medium text-text-primary mb-2">
                  PAN Card Number
                </label>
                <input
                  id="pan"
                  type="text"
                  maxLength={10}
                  value={pan}
                  onChange={(e) => setPan(e.target.value.toUpperCase())}
                  placeholder="ABCDE1234F"
                  className="w-full px-4 py-3 rounded-lg border border-border focus:border-border-focus focus:ring-2 focus:ring-purple/20 outline-none text-text-primary bg-white uppercase tracking-wider transition-colors"
                />
              </div>

              {/* Phone Input */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-text-primary mb-2">
                  Mobile Number
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-border bg-bg-soft text-text-muted text-sm">
                    +91
                  </span>
                  <input
                    id="phone"
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="9876543210"
                    className="w-full px-4 py-3 rounded-r-lg border border-border focus:border-border-focus focus:ring-2 focus:ring-purple/20 outline-none text-text-primary bg-white transition-colors"
                  />
                </div>
              </div>

              {/* PRD OB-04: Consent checkboxes */}
              <div className="space-y-3">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1 accent-purple"
                  />
                  <span className="text-sm text-text-secondary">
                    I consent to ExitDebt checking my credit report
                  </span>
                </label>
                {/* PRD OB-04b: Optional partner sharing consent */}
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentPartner}
                    onChange={(e) => setConsentPartner(e.target.checked)}
                    className="mt-1 accent-purple"
                  />
                  <span className="text-sm text-text-secondary">
                    I consent to sharing my insights with financial partners (optional)
                  </span>
                </label>
              </div>

              <div className="text-center">
                <Link href="/privacy" className="text-xs text-purple hover:underline">
                  Privacy Policy
                </Link>
              </div>

              {error && (
                <div className="bg-danger/10 text-danger text-sm px-4 py-2 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 px-6 rounded-lg bg-purple text-white font-semibold text-base hover:opacity-90 transition-opacity shadow-lg shadow-purple/20"
              >
                Check My Debt Health →
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  // ─── OTP Step (PRD OB-03: simulated) ─────────────────────────
  if (step === 'otp') {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <button
            onClick={() => setStep('form')}
            className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-purple mb-8"
          >
            ← Back
          </button>

          <div className="glass-card p-8 text-center">
            <Link href="/" className="text-xl font-bold inline-block mb-6">
              <span className="text-text-primary">Exit</span>
              <span className="gradient-text">Debt</span>
            </Link>
            <h2 className="text-xl font-bold text-text-primary mb-2">Verify your number</h2>
            <p className="text-sm text-text-secondary mb-6">
              We sent a 6-digit code to +91 {phone.slice(0, 2)}****{phone.slice(-4)}
            </p>

            <form onSubmit={handleVerifyOTP} className="space-y-5">
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit OTP"
                className="w-full px-4 py-3 rounded-lg border border-border focus:border-border-focus focus:ring-2 focus:ring-purple/20 outline-none text-text-primary bg-white text-center text-2xl tracking-[0.5em] transition-colors"
              />

              <p className="text-xs text-text-muted">
                For demo, enter any 6 digits (e.g., 123456)
              </p>

              {error && (
                <div className="bg-danger/10 text-danger text-sm px-4 py-2 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 px-6 rounded-lg bg-purple text-white font-semibold text-base hover:opacity-90 transition-opacity shadow-lg shadow-purple/20"
              >
                Verify & Continue →
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  // ─── Loading Step (PRD OB-06) ────────────────────────────────
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-border border-t-purple rounded-full animate-spin mx-auto mb-4" />
        <p className="text-text-secondary text-sm mb-1">Pulling your credit report...</p>
        <p className="text-text-muted text-xs">This takes a few seconds</p>
      </div>
    </main>
  );
}
