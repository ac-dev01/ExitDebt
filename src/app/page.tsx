"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { MockProfile } from "@/lib/mockProfiles";
import DebtForm from "@/components/Form";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const STEPS = [
  {
    num: "01",
    title: "Enter your PAN",
    desc: "We use your PAN card number to securely pull your credit report. Nothing else is needed.",
  },
  {
    num: "02",
    title: "Get your score",
    desc: "You'll see a debt health score that tells you exactly how well you're managing your debt.",
  },
  {
    num: "03",
    title: "See the full picture",
    desc: <>Every loan, every card — with interest rates and what they{"'re"} really <span style={{ color: "var(--color-danger)", fontWeight: 600 }}>costing you</span>.</>,
  },
];

const TRUST_ICONS: Record<string, React.ReactNode> = {
  shield: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  chart: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  dollar: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  block: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>,
};

const TRUST_POINTS = [
  { icon: "shield", title: "Bank-grade encryption", desc: "Your data is encrypted end-to-end. We never store your PAN." },
  { icon: "chart", title: "No CIBIL impact", desc: "This is a soft pull. Your credit score stays exactly where it is." },
  { icon: "dollar", title: "Always free", desc: "We make money from lenders, not from you. You never pay us anything." },
  { icon: "block", title: "No data selling", desc: "We don't sell, share, or trade your personal data. Period." },
];

const ARTICLES = [
  {
    slug: "credit-card-mistakes",
    title: "5 mistakes people make with credit cards",
    category: "Credit Cards",
    desc: <>Most people don{"'t"} realise how much revolving credit actually <span style={{ color: "var(--color-danger)", fontWeight: 600 }}>costs them</span>.</>,
  },
  {
    slug: "priya-saved-62k",
    title: "How Priya saved ₹62K/year by restructuring her debt",
    category: "Success Story",
    desc: "A real story of someone who turned their finances around in 3 months.",
  },
  {
    slug: "personal-loan-vs-credit-card",
    title: <>Personal loan vs. <span style={{ color: "var(--color-danger)" }}>credit card debt</span>: which to pay first?</>,
    category: "Strategy",
    desc: "The answer isn't always obvious. Here's a framework to decide.",
  },
];

export default function Home() {
  const { isLoggedIn, user, login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();
  const formCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function triggerGlow() {
      if (formCardRef.current) {
        formCardRef.current.classList.remove("form-glow");
        void formCardRef.current.offsetWidth; // force reflow to restart animation
        formCardRef.current.classList.add("form-glow");
      }
    }
    function handleClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement).closest('a[href*="#start"]');
      if (anchor) setTimeout(triggerGlow, 100);
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  function handleResult(p: MockProfile) {
    login(p);
    setIsLoading(false);
    setSubmitted(true);
    router.push("/income");
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-bg)" }}>
      <Navbar />

      {/* ───────────────── HERO ───────────────── */}
      <section id="start" style={{ backgroundColor: "var(--color-bg-soft)" }}>
        <div className="max-w-6xl mx-auto px-8 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left — Headline */}
            <div className="lg:col-span-7 animate-fadeIn">
              <div
                className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-6"
                style={{ backgroundColor: "rgba(115,0,190,0.08)", color: "var(--color-purple)" }}
              >
                Free debt health check
              </div>

              <h1
                className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold leading-[1.15] tracking-tight mb-6"
                style={{ color: "var(--color-text-primary)" }}
              >
                Find out if you&apos;re{" "}
                <span
                  className="relative inline-block"
                  style={{ color: "var(--color-danger)" }}
                >
                  overpaying
                  <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 200 6" fill="none">
                    <path d="M0 3C40 0.5 80 5 120 2.5C160 0 200 4 200 3" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </span>{" "}
                on your loans.
              </h1>

              <p
                className="text-lg leading-relaxed max-w-lg mb-8"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Enter your PAN and we&apos;ll pull your credit report. You&apos;ll see
                exactly where your money is going — in 30 seconds.
              </p>

              {/* Trust pills */}
              <div className="flex flex-wrap gap-3">
                {["No CIBIL impact", "256-bit encrypted", "Free forever"].map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: "var(--color-bg-card)",
                      border: "1px solid var(--color-border)",
                      color: "var(--color-text-secondary)",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--color-purple)" }} />
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — Form Card */}
            <div className="lg:col-span-5 animate-slideUp stagger-1">
              <div
                ref={formCardRef}
                className="rounded-2xl p-7 sm:p-8"
                style={{
                  backgroundColor: "var(--color-bg-card)",
                  boxShadow: "0 4px 32px rgba(0,0,0,0.06)",
                }}
              >
                <h2
                  className="text-lg font-bold mb-1"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  Check your debt health
                </h2>
                <p className="text-sm mb-6" style={{ color: "var(--color-text-muted)" }}>
                  Takes 30 seconds. Completely free.
                </p>

                {isLoggedIn && user ? (
                  <div className="text-center space-y-5 py-6">
                    <div
                      className="w-14 h-14 rounded-full mx-auto flex items-center justify-center text-xl font-bold text-white"
                      style={{ backgroundColor: "var(--color-purple)" }}
                    >
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                        Welcome back, <span className="font-semibold" style={{ color: "var(--color-text-primary)" }}>{user.name}</span>
                      </p>
                    </div>
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                      style={{ backgroundColor: "var(--color-purple)" }}
                    >
                      View your dashboard
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                ) : (
                  <DebtForm
                    onResult={handleResult}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    submitted={submitted}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── HOW IT WORKS ───────────────── */}
      <section id="steps" className="max-w-6xl mx-auto px-8 py-20 lg:py-24">
        <div className="text-center mb-14 animate-fadeIn">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--color-purple)" }}>
            How it works
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold"
            style={{ color: "var(--color-text-primary)" }}
          >
            Three steps to clarity
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((step, i) => (
            <div
              key={step.num}
              className={`relative rounded-2xl p-8 hover-lift animate-slideUp stagger-${i + 1}`}
              style={{
                backgroundColor: "var(--color-bg-card)",
                boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
                border: "1px solid var(--color-border)",
              }}
            >
              <span
                className="text-4xl font-black"
                style={{ color: "var(--color-blue)" }}
              >
                {step.num}
              </span>
              <h3
                className="text-base font-bold mt-4 mb-2"
                style={{ color: "var(--color-text-primary)" }}
              >
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────────── TRUST BAND ───────────────── */}
      <section id="trust" className="max-w-6xl mx-auto px-8 py-20 lg:py-24">
        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--color-purple)" }}>
            Your data is safe
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold"
            style={{ color: "var(--color-text-primary)" }}
          >
            Things you should know
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRUST_POINTS.map((point, i) => (
            <div
              key={point.title}
              className={`rounded-2xl p-7 hover-lift animate-fadeIn stagger-${i + 1}`}
              style={{
                backgroundColor: "var(--color-bg-card)",
                boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
                border: "1px solid var(--color-border)",
              }}
            >
              <span style={{ color: "var(--color-purple)" }}>{TRUST_ICONS[point.icon]}</span>
              <h3
                className="text-sm font-bold mt-4 mb-2"
                style={{ color: "var(--color-text-primary)" }}
              >
                {point.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                {point.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────────── ARTICLES ───────────────── */}
      <section id="articles" className="max-w-6xl mx-auto px-8 py-20 lg:py-24">
        <div className="text-center mb-14 animate-fadeIn">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--color-purple)" }}>
            Learn more
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold"
            style={{ color: "var(--color-text-primary)" }}
          >
            Understand how debt really works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ARTICLES.map((article, i) => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className={`group rounded-2xl p-7 hover-lift animate-slideUp stagger-${i + 1}`}
              style={{
                backgroundColor: "var(--color-bg-card)",
                boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
                border: "1px solid var(--color-border)",
              }}
            >
              <span
                className="inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-white mb-4"
                style={{ backgroundColor: "var(--color-purple)" }}
              >
                {article.category}
              </span>
              <h3
                className="text-base font-bold mb-2 transition-colors"
                style={{ color: "var(--color-text-primary)" }}
              >
                {article.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                {article.desc}
              </p>
              <div className="mt-5 flex items-center gap-1 text-sm font-semibold" style={{ color: "var(--color-purple)" }}>
                Read more
                <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ───────────────── FOOTER ───────────────── */}
      <Footer />
    </div>
  );
}
