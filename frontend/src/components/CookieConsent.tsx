'use client';

import React, { useState, useEffect } from 'react';

export default function CookieConsent() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('exitdebt_cookie_consent');
        if (!consent) {
            setTimeout(() => setVisible(true), 2000);
        }
    }, []);

    const accept = () => {
        localStorage.setItem('exitdebt_cookie_consent', 'accepted');
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-fade-in-up">
            <div className="max-w-3xl mx-auto glass-card p-4 flex flex-col sm:flex-row items-center gap-4">
                <p className="text-sm text-text-secondary flex-1">
                    We use cookies to improve your experience. See{' '}
                    <a href="/privacy" className="text-purple hover:underline">Privacy Policy</a>.
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={accept}
                        className="px-4 py-2 bg-purple text-white text-sm font-medium rounded-lg hover:bg-purple-light transition-colors cursor-pointer"
                    >
                        Accept
                    </button>
                    <button
                        onClick={() => setVisible(false)}
                        className="px-4 py-2 text-text-muted text-sm hover:text-text-primary transition-colors cursor-pointer"
                    >
                        Dismiss
                    </button>
                </div>
            </div>
        </div>
    );
}
