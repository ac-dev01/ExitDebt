'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const steps = [
  {
    num: '1',
    icon: '📝',
    title: 'Enter Your Details',
    desc: 'Share your PAN and phone number. This takes just 30 seconds.',
    detail:
      'We use your PAN to fetch your credit report from the bureaus. Your PAN is hashed with SHA-256 — we never store it in plain text. The phone number is used for OTP verification only.',
  },
  {
    num: '2',
    icon: '🔍',
    title: 'We Analyze Your Debt',
    desc: "Our algorithm reads your credit report and finds where you\u2019re overpaying.",
    detail:
      'We map every active loan and credit card, calculate your weighted average interest rate, and compare it against current market rates. We also check your debt-to-income ratio and EMI schedule to find savings opportunities.',
  },
  {
    num: '3',
    icon: '📊',
    title: 'See Your Dashboard',
    desc: 'Get a comprehensive view of your debt health, Freedom GPS, and savings potential.',
    detail:
      'Your personal dashboard includes a Debt Health Score, Freedom GPS (your path to ₹0 debt), Interest Leak Report, Payment Prioritizer, and Salary-Day Cash Flow timeline. Everything is calculated in real-time.',
  },
  {
    num: '4',
    icon: '📞',
    title: 'Talk to an Expert',
    desc: 'Schedule a free call to discuss your savings plan with no commitment.',
    detail:
      'Our debt restructuring experts will walk you through your report and help you create a plan. This consultation is always free, completely confidential, and involves zero pressure to sign up for anything.',
  },
];

const securityFeatures = [
  { icon: '🔒', title: 'AES-256 Encryption', desc: 'Bank-grade encryption for all data at rest and in transit.' },
  { icon: '🛡️', title: 'No CIBIL Impact', desc: 'Soft pull only — zero impact on your credit score.' },
  { icon: '🗑️', title: 'Auto-Delete', desc: 'Your data is automatically deleted after 30 days.' },
  { icon: '📜', title: 'DPDP Compliant', desc: "Fully compliant with India\u2019s Digital Personal Data Protection Act." },
];

export default function HowItWorksPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple/10 text-purple text-xs font-bold uppercase tracking-wider mb-4">
              ✨ Simple & Transparent
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-3">
              How ExitDebt Works
            </h1>
            <p className="text-text-secondary max-w-xl mx-auto">
              Four simple steps from overwhelmed by debt to in control of your finances. Free, private, no strings attached.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-8 mb-20">
            {steps.map((s, i) => (
              <div key={i} className="glass-card p-6 sm:p-8 flex gap-5 items-start">
                <div className="w-12 h-12 rounded-xl bg-purple/10 text-2xl flex items-center justify-center flex-shrink-0">
                  {s.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-purple bg-purple/5 px-2 py-0.5 rounded-full">
                      Step {s.num}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-text-primary mb-1">{s.title}</h3>
                  <p className="text-sm text-text-secondary mb-2">{s.desc}</p>
                  <p className="text-sm text-text-muted leading-relaxed">{s.detail}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Security */}
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-text-primary mb-2">Your Privacy, Our Priority</h2>
            <p className="text-sm text-text-secondary">Built with security from day one.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5 mb-14">
            {securityFeatures.map((f, i) => (
              <div key={i} className="glass-card p-5 flex items-start gap-4">
                <span className="text-2xl">{f.icon}</span>
                <div>
                  <h4 className="font-semibold text-text-primary text-sm mb-0.5">{f.title}</h4>
                  <p className="text-xs text-text-secondary">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="glass-card p-8 text-center">
            <h3 className="text-xl font-bold text-text-primary mb-2">Ready to find out?</h3>
            <p className="text-sm text-text-secondary mb-6">
              Takes 30 seconds. Completely free. No impact on your credit score.
            </p>
            <Link
              href="/"
              className="inline-block px-8 py-3 rounded-xl bg-purple text-white font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-purple/20"
            >
              Check My Debt Health →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
