"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import {
    calculateInterestLeak,
    calculateCashFlow,
} from "@/lib/calculations";
import DashboardBanner from "@/components/dashboard/DashboardBanner";
import DashboardScoreGauge from "@/components/dashboard/DashboardScoreGauge";
import DebtSummaryCards from "@/components/dashboard/DebtSummaryCards";
import DashboardAccountList from "@/components/dashboard/DashboardAccountList";
import DebtFreedomGPS from "@/components/dashboard/DebtFreedomGPS";
import InterestLeakReport from "@/components/dashboard/InterestLeakReport";
import SmartPaymentPrioritizer from "@/components/dashboard/SmartPaymentPrioritizer";
import SalaryCashFlow from "@/components/dashboard/SalaryCashFlow";
import RefreshShare from "@/components/dashboard/RefreshShare";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function DashboardPage() {
    const { user, isLoggedIn } = useAuth();
    const router = useRouter();
    const [lastUpdated, setLastUpdated] = useState(new Date());

    useEffect(() => {
        if (!isLoggedIn) {
            router.push("/");
        }
    }, [isLoggedIn, router]);

    if (!isLoggedIn || !user) return null;

    const interestLeak = calculateInterestLeak(
        user.accounts,
        user.monthlyEmi,
        user.totalOutstanding,
        user.optimalRate
    );

    const cashFlow = calculateCashFlow(
        user.salary,
        user.salaryDate,
        user.accounts
    );

    function handleRefresh() {
        setLastUpdated(new Date());
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: "var(--color-bg)" }}>
            <Navbar />

            <main className="max-w-[1200px] mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-6">
                <div className="mb-2 animate-fadeIn">
                    <h1
                        className="text-2xl sm:text-3xl font-bold"
                        style={{ color: "var(--color-text-primary)" }}
                    >
                        Hi, {user.name}
                    </h1>
                    <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
                        Here&apos;s your complete debt intelligence overview.
                    </p>
                </div>

                <DashboardBanner lastUpdated={lastUpdated} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-5">
                        <DashboardScoreGauge score={user.score} label={user.scoreLabel} color={user.color} />
                    </div>
                    <div className="lg:col-span-7 flex flex-col justify-center">
                        <DebtSummaryCards
                            totalOutstanding={user.totalOutstanding}
                            monthlyEmi={user.monthlyEmi}
                            activeAccounts={user.activeAccounts}
                            avgInterestRate={user.avgInterestRate}
                        />
                    </div>
                </div>

                <DashboardAccountList accounts={user.accounts} />

                <DebtFreedomGPS
                    currentTimeline={user.currentTimeline}
                    optimizedTimeline={user.optimizedTimeline}
                    timelineSaved={user.timelineSaved}
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <InterestLeakReport leak={interestLeak} />
                    <SmartPaymentPrioritizer accounts={user.accounts} optimalRate={user.optimalRate} />
                </div>

                <SalaryCashFlow cashFlow={cashFlow} />
                <RefreshShare onRefresh={handleRefresh} />
            </main>

            <Footer />
        </div>
    );
}
