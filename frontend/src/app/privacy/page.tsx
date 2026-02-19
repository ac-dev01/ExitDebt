import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicy() {
    return (
        <main className="min-h-screen py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <Link href="/" className="text-xl font-bold inline-block mb-8">
                    <span className="text-text-primary">Exit</span>
                    <span className="gradient-text">Debt</span>
                </Link>

                <h1 className="text-3xl font-bold text-text-primary mb-6">Privacy Policy</h1>
                <p className="text-text-secondary text-sm mb-8">Last updated: February 2026</p>

                <div className="space-y-8 text-text-secondary leading-relaxed text-[15px]">
                    <section>
                        <h2 className="text-lg font-semibold text-text-primary mb-3">Data We Collect</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>PAN Number</strong> — hashed with SHA-256, never stored in plaintext</li>
                            <li><strong>Phone Number</strong> — for OTP verification</li>
                            <li><strong>Name</strong> — as per PAN card</li>
                            <li><strong>Credit Report Data</strong> — encrypted with AES-256-CBC</li>
                            <li><strong>Consent Timestamp & IP</strong> — for regulatory compliance</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-text-primary mb-3">How We Use Your Data</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Calculate your Debt Health Score</li>
                            <li>Generate personalized debt restructuring recommendations</li>
                            <li>Facilitate callbacks with our advisory team</li>
                            <li>Improve our service through anonymized analytics</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-text-primary mb-3">Data Security</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>PAN is hashed (SHA-256) — we cannot recover your PAN number</li>
                            <li>Credit data is encrypted at rest (AES-256-CBC)</li>
                            <li>All API transmissions use HTTPS/TLS 1.3</li>
                            <li>Raw credit data is auto-deleted after 30 days</li>
                            <li>Access logging and audit trails for all data operations</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-text-primary mb-3">Data Retention</h2>
                        <p>Raw CIBIL data: 30 days (auto-deleted). Health scores: retained for account lifetime. PAN hashes: retained for deduplication. Audit logs: 365 days.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-text-primary mb-3">Your Rights</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Access</strong> — request a copy of your processed data</li>
                            <li><strong>Deletion</strong> — request complete data erasure</li>
                            <li><strong>Portability</strong> — receive data in machine-readable format</li>
                            <li><strong>Withdrawal</strong> — revoke consent at any time</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-text-primary mb-3">Contact</h2>
                        <p>For data-related inquiries: <a href="mailto:privacy@exitdebt.in" className="text-purple hover:underline">privacy@exitdebt.in</a></p>
                    </section>
                </div>

                <div className="mt-12 pt-6 border-t border-border text-sm text-text-muted">
                    <Link href="/" className="text-purple hover:underline">← Back to Home</Link>
                </div>
            </div>
        </main>
    );
}
