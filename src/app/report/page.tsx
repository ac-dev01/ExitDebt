"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { formatCurrency } from "@/lib/utils";
import ScoreGauge from "@/components/ScoreGauge";
import Footer from "@/components/Footer";

const ARTICLES = [
    {
        slug: "credit-card-mistakes",
        title: "5 mistakes people make with credit cards",
        category: "Credit Cards",
    },
    {
        slug: "priya-saved-62k",
        title: "How Priya saved ₹62K/year by restructuring",
        category: "Success Story",
    },
    {
        slug: "personal-loan-vs-credit-card",
        title: "Personal loan vs. credit card: which first?",
        category: "Strategy",
    },
];

const SCORE_MESSAGE: Record<string, React.ReactNode> = {
    Critical: <>Your debt is <span style={{ color: "var(--danger)", fontWeight: 600 }}>costing you significantly more</span> than it should. This is fixable, but it needs attention now.</>,
    "Needs Attention": <>Your debt is manageable, but some of your interest rates are <span style={{ color: "var(--danger)", fontWeight: 600 }}>higher than they need to be</span>.</>,
    Fair: "You're doing okay, but there's room to reduce your interest costs with a few changes.",
    Good: "Your debt is well-managed. Your interest rates are reasonable and your load is light.",
};

export default function ReportPage() {
    const { user, isLoggedIn, logout } = useAuth();
    const router = useRouter();
    const printRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isLoggedIn) {
            router.push("/");
        }
    }, [isLoggedIn, router]);

    if (!isLoggedIn || !user) return null;

    const sortedAccounts = [...user.accounts].sort((a, b) => b.apr - a.apr);
    const highInterest = sortedAccounts.filter((a) => a.apr > 18);
    const normalInterest = sortedAccounts.filter((a) => a.apr <= 18);

    const insights: string[] = [];
    if (highInterest.length > 0) {
        insights.push(
            `You have ${highInterest.length} account${highInterest.length > 1 ? "s" : ""} with interest rates above 18%. These are costing you the most.`
        );
    }
    if (user.avgInterestRate > 15) {
        insights.push(
            `Your average interest rate is ${user.avgInterestRate}%. That's higher than what most consolidation options offer.`
        );
    }
    if (user.monthlyEmi > 20000) {
        insights.push(
            `You're paying ${formatCurrency(user.monthlyEmi)} per month in EMIs. That's a significant portion of most take-home salaries.`
        );
    }
    if (normalInterest.length > 0) {
        insights.push(
            `${normalInterest.length} of your accounts ${normalInterest.length > 1 ? "have" : "has"} reasonable rates. No urgent action needed there.`
        );
    }

    function handleSignOut() {
        logout();
        router.push("/");
    }

    function handleDownload() {
        window.print();
    }

    function typeLabel(type: string): string {
        switch (type) {
            case "credit_card": return "Credit Card";
            case "loan": return "Personal Loan";
            case "emi": return "EMI";
            default: return type;
        }
    }

    const reportDate = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

    const STAT_CARDS = [
        { label: "Total Debt", value: formatCurrency(user.totalOutstanding), sub: `${user.activeAccounts} active accounts` },
        { label: "Monthly EMI", value: formatCurrency(user.monthlyEmi), sub: "Across all accounts" },
        { label: "Avg Interest", value: `${user.avgInterestRate}%`, sub: "Weighted average APR" },
        { label: "Overpayment", value: formatCurrency(user.overpayment), sub: `vs. ${user.optimalRate}% optimal` },
    ];

    return (
        <div className="min-h-screen bg-white" ref={printRef}>
            {/* ─── Nav ─── */}
            <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm no-print" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
                <div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: "var(--navy)" }}>
                            E
                        </div>
                        <span className="text-lg font-bold tracking-tight text-gray-900">ExitDebt</span>
                    </Link>
                    <div className="flex items-center gap-5">
                        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">
                            Home
                        </Link>
                        <button
                            onClick={handleSignOut}
                            className="text-sm text-gray-400 hover:text-red-500 transition-colors cursor-pointer font-medium"
                        >
                            Sign out
                        </button>
                    </div>
                </div>
            </nav>

            {/* ───────── TOP SECTION: Gauge Left + Stats Right ───────── */}
            <section className="max-w-6xl mx-auto px-8 py-14 lg:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
                    {/* Left — Score Gauge */}
                    <div className="lg:col-span-5 animate-scaleIn">
                        <div
                            className="bg-white rounded-2xl p-8 lg:p-10 text-center"
                            style={{ boxShadow: "0 2px 24px rgba(0,0,0,0.05)" }}
                        >
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Debt Health Score</p>
                            <ScoreGauge score={user.score} label={user.scoreLabel} color={user.color} />
                            <p className="text-sm text-gray-500 mt-6 leading-relaxed max-w-xs mx-auto">
                                {SCORE_MESSAGE[user.scoreLabel]}
                            </p>
                        </div>
                    </div>

                    {/* Right — Greeting + Stats */}
                    <div className="lg:col-span-7 animate-fadeIn stagger-1">
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Your Report</p>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                            Hi {user.name}, here&apos;s where you stand.
                        </h1>
                        <p className="text-sm text-gray-400 mb-8">
                            Based on your credit report pulled on {reportDate}.
                        </p>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            {STAT_CARDS.map((card, i) => (
                                <div
                                    key={card.label}
                                    className={`bg-white rounded-xl p-5 animate-slideUp stagger-${i + 1}`}
                                    style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)", border: "1px solid #f3f4f6" }}
                                >
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{card.label}</p>
                                    <p className="text-xl font-bold text-gray-900 tabular-nums mt-1.5">{card.value}</p>
                                    <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
                                </div>
                            ))}
                        </div>

                        {/* Download Button */}
                        <button
                            onClick={handleDownload}
                            className="no-print inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-colors cursor-pointer"
                            style={{ backgroundColor: "var(--cobalt)", boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Download Report
                        </button>
                    </div>
                </div>
            </section>

            {/* ───────── DETAILED REPORT ───────── */}
            <section className="max-w-6xl mx-auto px-8 pb-16">
                {/* Accounts Table */}
                <div
                    className="bg-white rounded-2xl overflow-hidden animate-fadeIn stagger-2"
                    style={{ boxShadow: "0 2px 24px rgba(0,0,0,0.05)" }}
                >
                    <div className="px-7 py-5 border-b border-gray-100 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Your Accounts</h2>
                            <p className="text-sm text-gray-400 mt-0.5">Sorted by interest rate — highest first</p>
                        </div>
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider hidden sm:block">
                            {user.activeAccounts} active
                        </span>
                    </div>

                    {/* Table Header */}
                    <div className="hidden sm:grid grid-cols-12 gap-4 px-7 py-3 bg-gray-50 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        <div className="col-span-4">Account</div>
                        <div className="col-span-2">Type</div>
                        <div className="col-span-3 text-right">Outstanding</div>
                        <div className="col-span-3 text-right">Interest Rate</div>
                    </div>

                    {/* High Interest Group */}
                    {highInterest.length > 0 && (
                        <>
                            <div className="px-7 py-2.5 bg-red-50/50">
                                <span className="text-xs font-bold text-red-500 uppercase tracking-wider">High Interest</span>
                            </div>
                            {highInterest.map((acc) => (
                                <div
                                    key={acc.lender}
                                    className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-7 py-4 border-b border-gray-50 hover:bg-gray-50/50 transition-colors items-center"
                                >
                                    <div className="sm:col-span-4">
                                        <p className="text-sm font-semibold text-gray-900">{acc.lender}</p>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <span className="text-xs text-gray-400">{typeLabel(acc.type)}</span>
                                    </div>
                                    <div className="sm:col-span-3 sm:text-right">
                                        <p className="text-sm font-semibold text-gray-900 tabular-nums">{formatCurrency(acc.outstanding)}</p>
                                    </div>
                                    <div className="sm:col-span-3 sm:text-right">
                                        <span className="inline-block px-2.5 py-1 rounded-md text-xs font-bold bg-red-50 text-red-600 tabular-nums">
                                            {acc.apr}% APR
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}

                    {/* Normal Interest Group */}
                    {normalInterest.length > 0 && (
                        <>
                            <div className="px-7 py-2.5 bg-green-50/50">
                                <span className="text-xs font-bold text-green-600 uppercase tracking-wider">Reasonable</span>
                            </div>
                            {normalInterest.map((acc) => (
                                <div
                                    key={acc.lender}
                                    className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-7 py-4 border-b border-gray-50 hover:bg-gray-50/50 transition-colors items-center"
                                >
                                    <div className="sm:col-span-4">
                                        <p className="text-sm font-semibold text-gray-900">{acc.lender}</p>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <span className="text-xs text-gray-400">{typeLabel(acc.type)}</span>
                                    </div>
                                    <div className="sm:col-span-3 sm:text-right">
                                        <p className="text-sm font-semibold text-gray-900 tabular-nums">{formatCurrency(acc.outstanding)}</p>
                                    </div>
                                    <div className="sm:col-span-3 sm:text-right">
                                        <span className="inline-block px-2.5 py-1 rounded-md text-xs font-bold bg-green-50 text-green-600 tabular-nums">
                                            {acc.apr}% APR
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>

                {/* ─── Overpayment Card ─── */}
                <div
                    className="bg-white rounded-2xl p-8 lg:p-10 mt-6 animate-fadeIn stagger-3"
                    style={{ boxShadow: "0 2px 24px rgba(0,0,0,0.05)" }}
                >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        <div className="lg:col-span-4 text-center lg:text-left">
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Annual Overpayment</p>
                            <p className="text-4xl sm:text-5xl font-bold text-gray-900 tabular-nums">
                                {formatCurrency(user.overpayment)}
                            </p>
                            <p className="text-sm text-gray-400 mt-2">per year in excess interest</p>
                        </div>
                        <div className="lg:col-span-8">
                            <p className="text-sm text-gray-500 leading-relaxed mb-4">
                                This is how much extra you&apos;re paying compared to an optimal rate of {user.optimalRate}%.
                                Over 5 years, that&apos;s roughly <span className="font-bold text-gray-900">{formatCurrency(user.overpayment * 5)}</span> lost to unnecessary interest.
                            </p>
                            <div className="w-full bg-gray-100 rounded-full h-2.5">
                                <div
                                    className="h-2.5 rounded-full transition-all duration-1000"
                                    style={{
                                        width: `${Math.min((user.overpayment / user.totalOutstanding) * 100 * 3, 100)}%`,
                                        backgroundColor: user.overpayment > 30000 ? "#EF4444" : user.overpayment > 15000 ? "#F97316" : "#22C55E"
                                    }}
                                />
                            </div>
                            <div className="flex justify-between mt-1.5 text-xs text-gray-400">
                                <span>Low impact</span>
                                <span>High impact</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── Insights ─── */}
                <div
                    className="bg-white rounded-2xl p-8 mt-6 animate-fadeIn stagger-4"
                    style={{ boxShadow: "0 2px 24px rgba(0,0,0,0.05)" }}
                >
                    <h2 className="text-lg font-bold text-gray-900 mb-5">What this means for you</h2>
                    <div className="space-y-4">
                        {insights.map((insight, i) => (
                            <div key={i} className="flex gap-3 items-start">
                                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                                    <span className="text-xs font-bold text-gray-400">{i + 1}</span>
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed">{insight}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ─── Articles ─── */}
                <div
                    className="bg-white rounded-2xl p-8 mt-6 animate-fadeIn stagger-5"
                    style={{ boxShadow: "0 2px 24px rgba(0,0,0,0.05)" }}
                >
                    <h2 className="text-lg font-bold text-gray-900 mb-2">Want to learn more?</h2>
                    <p className="text-sm text-gray-400 mb-6">Optional reading to help you understand your options.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {ARTICLES.map((article) => (
                            <Link
                                key={article.slug}
                                href={`/articles/${article.slug}`}
                                className="group p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all"
                            >
                                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                    {article.category}
                                </span>
                                <p className="text-sm font-semibold text-gray-900 mt-1.5 group-hover:text-gray-700 transition-colors leading-snug">
                                    {article.title}
                                </p>
                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-400 mt-3 group-hover:text-gray-600 transition-colors">
                                    Read
                                    <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                    </svg>
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Footer ─── */}
            <Footer />
        </div>
    );
}
