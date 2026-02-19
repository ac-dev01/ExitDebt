import React from 'react';
import Link from 'next/link';

export default function TermsOfService() {
    return (
        <main className="min-h-screen py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <Link href="/" className="text-xl font-bold inline-block mb-8">
                    <span className="text-text-primary">Exit</span>
                    <span className="gradient-text">Debt</span>
                </Link>

                <h1 className="text-3xl font-bold text-text-primary mb-6">Terms of Service</h1>
                <p className="text-text-secondary text-sm mb-8">Last updated: February 2026</p>

                <div className="space-y-8 text-text-secondary leading-relaxed text-[15px]">
                    <section>
                        <h2 className="text-lg font-semibold text-text-primary mb-3">Service Description</h2>
                        <p>ExitDebt provides a debt analysis and advisory platform. We analyze your credit report to calculate a Debt Health Score and offer restructuring recommendations.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-text-primary mb-3">User Obligations</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Provide accurate personal information</li>
                            <li>Maintain confidentiality of OTP and account access</li>
                            <li>Use the platform for personal financial analysis only</li>
                            <li>Not attempt to reverse-engineer or exploit the platform</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-text-primary mb-3">Credit Report Access</h2>
                        <p>By consenting, you authorize ExitDebt to perform a soft pull on your credit report via authorized bureau partners. This does not affect your credit score.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-text-primary mb-3">Advisory Services</h2>
                        <p>Paid advisory plans provide access to certified debt advisors. Advisory recommendations are guidance only and do not constitute legal or financial advice. Outcomes depend on lender cooperation and individual circumstances.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-text-primary mb-3">Disclaimer</h2>
                        <p>The Debt Health Score is algorithmic and provided for informational purposes. ExitDebt does not guarantee debt settlement outcomes. Savings estimates are projections based on historical data.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-text-primary mb-3">Limitation of Liability</h2>
                        <p>ExitDebt is not liable for decisions made based on our analysis. Our maximum liability is limited to fees paid for advisory services.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-text-primary mb-3">Governing Law</h2>
                        <p>These terms are governed by the laws of India. Disputes shall be subject to the jurisdiction of courts in Bengaluru, Karnataka.</p>
                    </section>
                </div>

                <div className="mt-12 pt-6 border-t border-border text-sm text-text-muted">
                    <Link href="/" className="text-purple hover:underline">← Back to Home</Link>
                </div>
            </div>
        </main>
    );
}
