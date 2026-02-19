"use client";

import { MockProfile } from "@/lib/mockProfiles";
import { formatCurrency } from "@/lib/utils";
import ScoreGauge from "./ScoreGauge";
import AccountList from "./AccountList";
import CallbackBooking from "./CallbackBooking";

interface ResultsProps {
    profile: MockProfile;
}

const MESSAGE_MAP: Record<string, string> = {
    Critical: "Your debt situation needs immediate attention. High-interest debt is eating into your savings significantly.",
    "Needs Attention": "Your debt load has room for improvement. A few strategic changes could save you thousands.",
    Fair: "You're managing your debt reasonably, but there's still opportunity to optimize your interest costs.",
    Good: "Great job managing your debt! You're in a strong position with relatively low interest rates.",
};

export default function Results({ profile }: ResultsProps) {
    const summaryCards = [
        { label: "Total Outstanding", value: formatCurrency(profile.totalOutstanding) },
        { label: "Monthly EMI", value: formatCurrency(profile.monthlyEmi) },
        { label: "Active Accounts", value: profile.activeAccounts.toString() },
        { label: "Avg Interest Rate", value: `${profile.avgInterestRate}%` },
    ];

    return (
        <section id="results-section" className="max-w-4xl mx-auto px-4 py-16 space-y-8">
            {/* Report header */}
            <div className="text-center animate-fadeIn">
                <p className="text-xs font-medium text-teal-600 uppercase tracking-widest mb-2">Debt Health Report</p>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {profile.name}&apos;s Financial Summary
                </h2>
                <p className="text-gray-400 mt-1 text-sm">
                    Generated on {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </p>
            </div>

            {/* Score gauge */}
            <div className="flex justify-center animate-fadeIn" style={{ animationDelay: "0.1s" }}>
                <ScoreGauge score={profile.score} label={profile.scoreLabel} color={profile.color} />
            </div>

            {/* Score message */}
            <p className="text-center text-sm text-gray-500 max-w-lg mx-auto leading-relaxed animate-fadeIn" style={{ animationDelay: "0.15s" }}>
                {MESSAGE_MAP[profile.scoreLabel]}
            </p>

            {/* Summary cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-slideUp" style={{ animationDelay: "0.1s" }}>
                {summaryCards.map((card) => (
                    <div
                        key={card.label}
                        className="bg-white border border-gray-100 rounded-xl p-5 text-center hover:shadow-sm transition-shadow"
                    >
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{card.label}</p>
                        <p className="text-xl font-bold text-gray-900 mt-2 tabular-nums">{card.value}</p>
                    </div>
                ))}
            </div>

            {/* Overpayment banner */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-6 sm:p-8 text-center animate-slideUp" style={{ animationDelay: "0.15s" }}>
                <p className="text-sm font-medium text-amber-700 uppercase tracking-wide">You&apos;re Overpaying</p>
                <p className="text-3xl sm:text-4xl font-bold text-amber-900 mt-2 tabular-nums">
                    {formatCurrency(profile.overpayment)}<span className="text-lg font-medium text-amber-600">/year</span>
                </p>
                <p className="text-sm text-amber-700/80 mt-3 max-w-md mx-auto">
                    By restructuring your debt at an optimal rate of {profile.optimalRate}%, you could save this amount every year.
                </p>
            </div>

            {/* Account list */}
            <AccountList accounts={profile.accounts} />

            {/* Callback booking */}
            <div className="animate-slideUp" style={{ animationDelay: "0.25s" }}>
                <CallbackBooking userName={profile.name} />
            </div>
        </section>
    );
}
