'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PrimaryButton from '@/components/PrimaryButton';
import OTPInput from '@/components/OTPInput';
import AlertBanner from '@/components/AlertBanner';
import FAQAccordion from '@/components/FAQAccordion';
import { sendOTP, verifyOTP, submitHealthCheck } from '@/lib/api';
import { analytics } from '@/lib/analytics';

type Step = 'details' | 'otp' | 'processing';

const faqs = [
  {
    question: 'Is this a scam?',
    answer:
      'ExitDebt is a registered debt advisory platform. We don\'t ask for your bank password. We don\'t move your money. We only read your credit report to show you where you\'re overpaying.',
  },
  {
    question: 'Will this hurt my CIBIL score?',
    answer:
      'No. We do a soft credit check. This has zero impact on your CIBIL score. Only hard inquiries from loan applications affect your score.',
  },
  {
    question: 'Is my PAN safe?',
    answer:
      'Your PAN is hashed instantly using SHA-256. We never store your raw PAN. All data is encrypted with bank-grade AES-256 encryption and auto-deleted after 30 days.',
  },
  {
    question: 'Will my bank find out?',
    answer:
      'No. We only read your credit report. Your bank is never contacted or notified. This is completely private.',
  },
  {
    question: 'Is this really free?',
    answer:
      'The debt check is 100% free. Always. We earn from lenders when you choose to restructure — never from you.',
  },
];

const testimonials = [
  {
    name: 'Priya M.',
    city: 'Pune',
    savings: '₹62,400',
    timeline: '11 days',
    quote: 'I had no idea I was overpaying so much on my personal loan. The call was calm and private — no pressure at all.',
  },
  {
    name: 'Rahul K.',
    city: 'Bangalore',
    savings: '₹48,000',
    timeline: '17 days',
    quote: 'I was nervous about sharing my PAN. But the check took 30 seconds and nothing showed up on my CIBIL.',
  },
  {
    name: 'Sneha D.',
    city: 'Mumbai',
    savings: '₹1,12,000',
    timeline: '21 days',
    quote: 'Three credit cards and a personal loan — I didn\'t know where to start. They gave me a clear plan.',
  },
];

export default function LandingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('details');
  const [name, setName] = useState('');
  const [pan, setPan] = useState('');
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
  const phoneRegex = /^[6-9]\d{9}$/;

  const validateDetails = (): boolean => {
    if (!name.trim() || name.trim().length < 2) {
      setError('Please enter your full name.');
      return false;
    }
    if (!panRegex.test(pan.toUpperCase())) {
      setError('Invalid PAN format. Expected: ABCDE1234F');
      return false;
    }
    if (!phoneRegex.test(phone)) {
      setError('Invalid phone number. Enter a 10-digit Indian mobile number.');
      return false;
    }
    if (!consent) {
      setError('Please provide consent to proceed.');
      return false;
    }
    return true;
  };

  const handleSendOTP = async () => {
    setError('');
    if (!validateDetails()) return;
    setLoading(true);
    try {
      await sendOTP(phone);
      analytics.otpSent(phone);
      setStep('otp');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (code: string) => {
    setError('');
    setLoading(true);
    try {
      const result = await verifyOTP(phone, code);
      if (result.token) {
        analytics.otpSuccess();
        await runHealthCheck();
      }
    } catch (err: unknown) {
      analytics.otpFailed();
      setError(err instanceof Error ? err.message : 'Invalid OTP. Please try again.');
      setLoading(false);
    }
  };

  const runHealthCheck = async () => {
    setStep('processing');
    setError('');
    analytics.healthCheckStarted();
    try {
      const result = await submitHealthCheck({
        pan: pan.toUpperCase(),
        phone,
        name,
        consent: true,
      });
      analytics.healthCheckSuccess(result.score);
      router.push(`/results/${result.id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      analytics.healthCheckFailed(msg);
      setError(msg);
      setStep('details');
    }
  };

  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-bg/90 backdrop-blur-md border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            <span className="text-text-primary">Exit</span>
            <span className="gradient-text">Debt</span>
          </Link>
          <div className="hidden sm:flex items-center gap-6 text-sm text-text-secondary">
            <a href="#how-it-works" className="hover:text-purple transition-colors">How It Works</a>
            <a href="#faq" className="hover:text-purple transition-colors">FAQ</a>
          </div>
        </div>
      </nav>

      {/* Hero + Form */}
      <section className="pt-28 pb-16 px-4">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Copy */}
          <div className="animate-fade-in-up">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-5 text-text-primary">
              You&apos;re Paying More Than{' '}
              <span className="gradient-text">You Should</span>
            </h1>
            <p className="text-base text-text-secondary leading-relaxed mb-8 max-w-md">
              Most salaried Indians overpay ₹30,000–₹1,50,000 per year on their loans.
              Check yours in 30 seconds — and see exactly where your money is going.
            </p>
            <div className="flex items-center gap-6 text-sm text-text-muted">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-purple" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                Your PAN is never stored
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-blue" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                Zero impact on your CIBIL
              </span>
            </div>
          </div>

          {/* Right: Form */}
          <div className="animate-fade-in-up animate-delay-1">
            {error && (
              <div className="mb-4">
                <AlertBanner type="error" message={error} onDismiss={() => setError('')} />
              </div>
            )}

            {step === 'details' && (
              <div className="glass-card p-6 sm:p-8">
                <h2 className="text-lg font-semibold text-text-primary mb-1">See How Much You&apos;re Losing</h2>
                <p className="text-sm text-text-muted mb-5">Takes 30 seconds. Completely private.</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="As per PAN card"
                      className="w-full px-4 py-3 bg-bg-soft border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:border-purple focus:outline-none focus:ring-2 focus:ring-purple/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">PAN Number</label>
                    <input
                      type="text"
                      value={pan}
                      onChange={(e) => setPan(e.target.value.toUpperCase().slice(0, 10))}
                      placeholder="ABCDE1234F"
                      maxLength={10}
                      className="w-full px-4 py-3 bg-bg-soft border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:border-purple focus:outline-none focus:ring-2 focus:ring-purple/10 transition-all uppercase tracking-wider"
                    />
                    {pan && !panRegex.test(pan) && (
                      <p className="text-xs text-danger mt-1">Format: 5 letters + 4 digits + 1 letter</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Phone Number</label>
                    <div className="flex">
                      <span className="px-3 py-3 bg-bg-soft border border-r-0 border-border rounded-l-xl text-text-muted text-sm flex items-center">
                        +91
                      </span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="9876543210"
                        maxLength={10}
                        className="flex-1 px-4 py-3 bg-bg-soft border border-border rounded-r-xl text-text-primary placeholder:text-text-muted focus:border-purple focus:outline-none focus:ring-2 focus:ring-purple/10 transition-all"
                      />
                    </div>
                  </div>
                  <label className="flex items-start gap-3 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-purple"
                    />
                    <span className="text-xs text-text-muted leading-relaxed">
                      I consent to ExitDebt accessing my credit report for debt analysis. Data is encrypted
                      and auto-deleted after 30 days. <a href="/privacy" className="text-purple hover:underline">Privacy Policy</a>.
                    </span>
                  </label>
                  <PrimaryButton
                    onClick={handleSendOTP}
                    loading={loading}
                    disabled={!name || !pan || !phone || !consent}
                    className="w-full"
                  >
                    Show Me My Savings
                  </PrimaryButton>
                  <p className="text-xs text-text-muted text-center">
                    We don&apos;t charge you to check your debt. Ever.
                  </p>
                </div>
              </div>
            )}

            {step === 'otp' && (
              <div className="glass-card p-6 sm:p-8">
                <h2 className="text-lg font-semibold text-text-primary mb-2">Verify Your Phone</h2>
                <p className="text-sm text-text-secondary mb-6">
                  We sent a 6-digit code to {phone.slice(0, 2)}****{phone.slice(-4)}
                </p>
                <div className="space-y-5">
                  <OTPInput onComplete={handleVerifyOTP} disabled={loading} />
                  {loading && (
                    <p className="text-center text-sm text-purple">Verifying...</p>
                  )}
                  <div className="text-center">
                    <button
                      onClick={handleSendOTP}
                      disabled={loading}
                      className="text-sm text-text-secondary hover:text-purple transition-colors cursor-pointer"
                    >
                      Didn&apos;t receive it? Resend OTP
                    </button>
                  </div>
                  <button
                    onClick={() => setStep('details')}
                    className="w-full text-sm text-text-muted hover:text-text-secondary transition-colors cursor-pointer"
                  >
                    ← Back to details
                  </button>
                </div>
              </div>
            )}

            {step === 'processing' && (
              <div className="glass-card p-8 text-center">
                <div className="space-y-5">
                  <div className="flex justify-center">
                    <div className="w-12 h-12 border-3 border-border border-t-purple rounded-full animate-spin" />
                  </div>
                  <div>
                    <p className="text-text-primary font-medium">Finding where your money is going...</p>
                    <p className="text-sm text-text-muted mt-1">This takes about 10 seconds</p>
                  </div>
                  <div className="space-y-2 max-w-xs mx-auto text-left">
                    {['Verifying your identity', 'Reading your credit report', 'Checking your interest rates', 'Calculating your savings'].map(
                      (s, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm">
                          <div
                            className="w-1.5 h-1.5 rounded-full bg-purple animate-pulse"
                            style={{ animationDelay: `${i * 0.5}s` }}
                          />
                          <span className="text-text-secondary">{s}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-text-primary text-center mb-10">
            How It Works
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { num: '1', title: 'Enter Your Details', desc: 'PAN + phone number. Takes 30 seconds.' },
              { num: '2', title: 'See What You\'re Losing', desc: 'We show you exactly how much you overpay every year.' },
              { num: '3', title: 'Take Back Control', desc: 'Get a clear plan to lower your EMIs and reduce pressure.' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-10 h-10 rounded-full bg-purple/10 text-purple font-bold text-lg flex items-center justify-center mx-auto mb-4">
                  {s.num}
                </div>
                <h3 className="font-semibold text-text-primary mb-2">{s.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust indicators */}
      <section className="py-12 px-4 bg-bg-soft">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { value: '50,000+', label: 'Checks Completed' },
            { value: '₹2.4Cr+', label: 'Savings Found' },
            { value: '30 sec', label: 'Average Check Time' },
            { value: '4.8★', label: 'User Satisfaction' },
          ].map((stat, i) => (
            <div key={i}>
              <p className="text-xl sm:text-2xl font-bold text-purple">{stat.value}</p>
              <p className="text-xs text-text-muted mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-text-primary text-center mb-3">
            Real People. Real Savings.
          </h2>
          <p className="text-sm text-text-secondary text-center mb-10">
            Here&apos;s what happened when they checked.
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="glass-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-purple/10 text-purple font-bold text-sm flex items-center justify-center flex-shrink-0">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary text-sm">{t.name}</p>
                    <p className="text-xs text-text-muted">{t.city}</p>
                  </div>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
                <div className="pt-3 border-t border-border">
                  <p className="text-sm font-semibold text-success">Saved {t.savings}/year</p>
                  <p className="text-xs text-text-muted">in {t.timeline}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 px-4 bg-bg-soft">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-text-primary text-center mb-3">
            Your Questions, Answered
          </h2>
          <p className="text-sm text-text-secondary text-center mb-10">
            No jargon. No fine print. Just clear answers.
          </p>
          <FAQAccordion items={faqs} />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-text-muted">
            © {new Date().getFullYear()} ExitDebt. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm text-text-secondary">
            <Link href="/privacy" className="hover:text-purple transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-purple transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
