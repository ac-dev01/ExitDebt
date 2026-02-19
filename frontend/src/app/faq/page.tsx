'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FAQAccordion from '@/components/FAQAccordion';

const generalFaqs = [
  {
    question: 'Is ExitDebt a scam?',
    answer:
      "ExitDebt is a registered debt advisory platform by Aaditri Technologies Pvt. Ltd. We don't ask for your bank password. We don't move your money. We only read your credit report to show you where you're overpaying.",
  },
  {
    question: 'Will this hurt my CIBIL score?',
    answer:
      'No. We perform a soft credit check. This has zero impact on your CIBIL score. Only hard inquiries from loan applications affect your score.',
  },
  {
    question: 'Is my PAN safe?',
    answer:
      'Your PAN is hashed instantly using SHA-256. We never store your raw PAN. All data is encrypted with bank-grade AES-256 encryption and auto-deleted after 30 days per our data retention policy.',
  },
  {
    question: 'Will my bank find out?',
    answer:
      'No. We only read your credit report from the bureau. Your bank is never contacted or notified. This is completely private.',
  },
  {
    question: 'Is this really free?',
    answer:
      "The debt health check is 100% free. Always. We earn from lenders when you choose to restructure — never from you. There's no catch.",
  },
];

const debtFaqs = [
  {
    question: 'What is debt restructuring?',
    answer:
      'Debt restructuring is a process where you negotiate with lenders to modify your existing loan terms — typically to lower the interest rate, extend the tenure, or consolidate multiple debts into one manageable EMI. It is a fully legal process recognized by the RBI.',
  },
  {
    question: 'How much can I actually save?',
    answer:
      'It depends on your debt profile. On average, our users save between ₹30,000 and ₹80,000 per year in interest charges. Users with high-interest credit card debt often save even more.',
  },
  {
    question: 'What is a Debt Health Score?',
    answer:
      "It's a proprietary score (0–100) that measures your overall debt wellness. It considers your debt-to-income ratio, average interest rates, number of active accounts, credit utilization, and payment regularity. Higher is better.",
  },
  {
    question: 'What is the Freedom GPS?',
    answer:
      "Freedom GPS shows you how many months until you're completely debt-free on your current path, and how many months you could save by optimizing your payments. It's your roadmap to ₹0 debt.",
  },
  {
    question: 'What happens after I check my debt health?',
    answer:
      "You'll see your complete dashboard with actionable insights. You can then schedule a free call with our expert to discuss a savings plan. There's zero obligation — the consultation itself is always free.",
  },
];

export default function FAQPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple/10 text-purple text-xs font-bold uppercase tracking-wider mb-4">
              ❓ Help & FAQ
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-3">
              Frequently Asked Questions
            </h1>
            <p className="text-text-secondary max-w-xl mx-auto">
              No jargon. No fine print. Just clear answers to everything you want to know.
            </p>
          </div>

          {/* General */}
          <div className="mb-12">
            <h2 className="text-lg font-bold text-text-primary mb-5 flex items-center gap-2">
              🔒 Trust &amp; Security
            </h2>
            <FAQAccordion items={generalFaqs} />
          </div>

          {/* Debt-specific */}
          <div className="mb-14">
            <h2 className="text-lg font-bold text-text-primary mb-5 flex items-center gap-2">
              💡 About ExitDebt
            </h2>
            <FAQAccordion items={debtFaqs} />
          </div>

          {/* Still have questions */}
          <div className="glass-card p-8 text-center">
            <h3 className="text-xl font-bold text-text-primary mb-2">Still have questions?</h3>
            <p className="text-sm text-text-secondary mb-6">
              Our experts are happy to answer anything — no obligation, no pressure.
            </p>
            <div className="flex justify-center gap-3">
              <Link
                href="/schedule"
                className="px-6 py-2.5 rounded-xl bg-purple text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-purple/20"
              >
                📞 Schedule a Free Call
              </Link>
              <Link
                href="/"
                className="px-6 py-2.5 rounded-xl border border-border text-text-primary font-medium text-sm hover:bg-bg-soft transition-colors"
              >
                Check My Debt Health
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
