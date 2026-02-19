'use client';

import React from 'react';
import Link from 'next/link';

export default function CallbackConfirmedPage() {
    return (
        <main className="min-h-screen flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center animate-fade-in-up">
                <div className="glass-card p-10">
                    <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-text-primary mb-3">You&apos;ve Taken the First Step</h1>
                    <p className="text-text-secondary mb-8 leading-relaxed">
                        Someone from our team will quietly walk you through your options at your chosen time.
                    </p>
                    <div className="space-y-4 text-left mb-8">
                        {['We listen to your situation first', 'You get a clear, simple plan', 'No pressure. No judgment.'].map((s, i) => (
                            <div key={i} className="flex items-center gap-3 text-sm text-text-secondary">
                                <div className="w-1.5 h-1.5 rounded-full bg-purple flex-shrink-0" />
                                {s}
                            </div>
                        ))}
                    </div>
                    <Link href="/" className="w-full inline-block px-6 py-3 rounded-xl text-white text-sm font-semibold bg-blue-600 hover:bg-blue-700 transition-colors text-center">
                        Back to Home
                    </Link>
                </div>
            </div>
        </main>
    );
}

