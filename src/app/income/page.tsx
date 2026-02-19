"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import Navbar from "@/components/Navbar";

export default function IncomePage() {
    const { user, isLoggedIn, updateIncome } = useAuth();
    const router = useRouter();

    const [salary, setSalary] = useState("");
    const [salaryDate, setSalaryDate] = useState("");
    const [otherIncome, setOtherIncome] = useState("");
    const [errors, setErrors] = useState<{ salary?: string; salaryDate?: string }>({});
    const [touched, setTouched] = useState<{ salary?: boolean; salaryDate?: boolean }>({});

    useEffect(() => {
        if (!isLoggedIn) {
            router.push("/");
        }
    }, [isLoggedIn, router]);

    useEffect(() => {
        if (user) {
            if (user.salary) setSalary(user.salary.toString());
            if (user.salaryDate) setSalaryDate(user.salaryDate.toString());
        }
    }, [user]);

    if (!isLoggedIn || !user) return null;

    const salaryNum = parseInt(salary.replace(/,/g, ""), 10);
    const dateNum = parseInt(salaryDate, 10);
    const otherNum = parseInt(otherIncome.replace(/,/g, ""), 10) || 0;

    const salaryValid = !isNaN(salaryNum) && salaryNum > 0;
    const dateValid = !isNaN(dateNum) && dateNum >= 1 && dateNum <= 31;
    const formValid = salaryValid && dateValid;

    function validate() {
        const e: { salary?: string; salaryDate?: string } = {};
        if (!salaryValid) e.salary = "Please enter your monthly salary.";
        if (!dateValid) e.salaryDate = "Enter a valid day (1–31).";
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    function handleSubmit(ev: React.FormEvent) {
        ev.preventDefault();
        setTouched({ salary: true, salaryDate: true });
        if (!validate()) return;
        updateIncome(salaryNum, dateNum, otherNum);
        router.push("/dashboard");
    }

    function handleBack() {
        router.push("/");
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: "var(--color-bg)" }}>
            <Navbar />

            <main className="max-w-xl mx-auto px-4 sm:px-8 py-12 sm:py-20">
                {/* Back link */}
                <button
                    onClick={handleBack}
                    className="inline-flex items-center gap-1 text-sm transition-colors mb-8 cursor-pointer"
                    style={{ color: "var(--color-text-muted)" }}
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to edit
                </button>

                {/* Card */}
                <form
                    onSubmit={handleSubmit}
                    className="rounded-2xl p-8 sm:p-10 animate-scaleIn"
                    style={{
                        backgroundColor: "var(--color-bg-card)",
                        boxShadow: "0 4px 32px rgba(0,0,0,0.06)",
                        border: "1px solid var(--color-border)",
                    }}
                >
                    <h1
                        className="text-2xl sm:text-3xl font-bold mb-2"
                        style={{ color: "var(--color-text-primary)" }}
                    >
                        Almost there!
                    </h1>
                    <p className="text-sm leading-relaxed mb-8" style={{ color: "var(--color-text-muted)" }}>
                        Tell us about your income so we can calculate your debt health
                        accurately and show you the most relevant insights. Your data is
                        encrypted and never shared without consent.
                    </p>

                    {/* Monthly Salary */}
                    <div className="mb-6">
                        <label
                            htmlFor="salary"
                            className="block text-sm font-semibold mb-2"
                            style={{ color: "var(--color-text-primary)" }}
                        >
                            Monthly Salary (after tax) <span style={{ color: "var(--color-danger)" }}>*</span>
                        </label>
                        <div className="relative">
                            <span
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium"
                                style={{ color: "var(--color-text-muted)" }}
                            >
                                ₹
                            </span>
                            <input
                                id="salary"
                                type="number"
                                min={1}
                                max={9999999}
                                placeholder="e.g. 60000"
                                value={salary}
                                onChange={(e) => {
                                    setSalary(e.target.value);
                                    if (touched.salary) {
                                        const v = parseInt(e.target.value, 10);
                                        if (!isNaN(v) && v > 0) setErrors((p) => ({ ...p, salary: undefined }));
                                    }
                                }}
                                onBlur={() => {
                                    setTouched((p) => ({ ...p, salary: true }));
                                    if (!salaryValid) setErrors((p) => ({ ...p, salary: "Please enter your monthly salary." }));
                                }}
                                className="w-full rounded-xl pl-8 pr-4 py-3.5 text-sm font-medium transition-all focus:outline-none focus:ring-2"
                                style={{
                                    backgroundColor: "var(--color-bg-soft)",
                                    border: `1px solid ${errors.salary && touched.salary ? "var(--color-danger)" : "var(--color-border)"}`,
                                    color: "var(--color-text-primary)",
                                    // @ts-expect-error -- focus ring via CSS
                                    "--tw-ring-color": "var(--color-border-focus)",
                                }}
                            />
                        </div>
                        {errors.salary && touched.salary && (
                            <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: "var(--color-danger)" }}>
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                {errors.salary}
                            </p>
                        )}
                    </div>

                    {/* Salary Date */}
                    <div className="mb-6">
                        <label
                            htmlFor="salary-date"
                            className="block text-sm font-semibold mb-2"
                            style={{ color: "var(--color-text-primary)" }}
                        >
                            Salary Date (day you receive salary) <span style={{ color: "var(--color-danger)" }}>*</span>
                        </label>
                        <div className="relative">
                            <span
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-medium"
                                style={{ color: "var(--color-text-muted)" }}
                            >
                                Day of month
                            </span>
                            <input
                                id="salary-date"
                                type="number"
                                min={1}
                                max={31}
                                placeholder="5"
                                value={salaryDate}
                                onChange={(e) => {
                                    setSalaryDate(e.target.value);
                                    if (touched.salaryDate) {
                                        const v = parseInt(e.target.value, 10);
                                        if (!isNaN(v) && v >= 1 && v <= 31) setErrors((p) => ({ ...p, salaryDate: undefined }));
                                    }
                                }}
                                onBlur={() => {
                                    setTouched((p) => ({ ...p, salaryDate: true }));
                                    if (!dateValid) setErrors((p) => ({ ...p, salaryDate: "Enter a valid day (1–31)." }));
                                }}
                                className="w-full rounded-xl pl-24 pr-4 py-3.5 text-sm font-medium transition-all focus:outline-none focus:ring-2"
                                style={{
                                    backgroundColor: "var(--color-bg-soft)",
                                    border: `1px solid ${errors.salaryDate && touched.salaryDate ? "var(--color-danger)" : "var(--color-border)"}`,
                                    color: "var(--color-text-primary)",
                                    // @ts-expect-error -- focus ring via CSS
                                    "--tw-ring-color": "var(--color-border-focus)",
                                }}
                            />
                        </div>
                        {errors.salaryDate && touched.salaryDate && (
                            <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: "var(--color-danger)" }}>
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                {errors.salaryDate}
                            </p>
                        )}
                    </div>

                    {/* Other Income */}
                    <div className="mb-8">
                        <label
                            htmlFor="other-income"
                            className="block text-sm font-semibold mb-2"
                            style={{ color: "var(--color-text-primary)" }}
                        >
                            Other monthly income{" "}
                            <span style={{ color: "var(--color-text-muted)" }} className="font-normal">(optional)</span>
                        </label>
                        <div className="relative">
                            <span
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium"
                                style={{ color: "var(--color-text-muted)" }}
                            >
                                ₹
                            </span>
                            <input
                                id="other-income"
                                type="number"
                                min={0}
                                max={9999999}
                                placeholder="e.g. 5000"
                                value={otherIncome}
                                onChange={(e) => setOtherIncome(e.target.value)}
                                className="w-full rounded-xl pl-8 pr-4 py-3.5 text-sm font-medium transition-all focus:outline-none focus:ring-2"
                                style={{
                                    backgroundColor: "var(--color-bg-soft)",
                                    border: "1px solid var(--color-border)",
                                    color: "var(--color-text-primary)",
                                    // @ts-expect-error -- focus ring via CSS
                                    "--tw-ring-color": "var(--color-border-focus)",
                                }}
                            />
                        </div>
                    </div>

                    {/* Legal */}
                    <p className="text-xs leading-relaxed mb-6" style={{ color: "var(--color-text-muted)" }}>
                        By continuing, you agree to our{" "}
                        <Link href="#" className="underline transition-colors" style={{ color: "var(--color-text-secondary)" }}>
                            Privacy Policy
                        </Link>{" "}
                        and{" "}
                        <Link href="#" className="underline transition-colors" style={{ color: "var(--color-text-secondary)" }}>
                            Terms of Service
                        </Link>
                        .
                    </p>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={!formValid}
                        className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
                        style={{ backgroundColor: "var(--color-purple)" }}
                    >
                        Continue to Dashboard →
                    </button>
                </form>

                {/* Trust note */}
                <p
                    className="text-xs text-center mt-6 leading-relaxed max-w-md mx-auto"
                    style={{ color: "var(--color-text-muted)" }}
                >
                    We use this only to calculate your debt-to-income ratio and cash flow.
                    You can update this anytime in settings.
                </p>
            </main>
        </div>
    );
}
