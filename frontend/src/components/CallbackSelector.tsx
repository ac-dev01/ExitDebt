'use client';

import React, { useState } from 'react';
import PrimaryButton from './PrimaryButton';

interface CallbackSelectorProps {
    onSubmit: (dateTime: string) => void;
    loading?: boolean;
}

export default function CallbackSelector({ onSubmit, loading = false }: CallbackSelectorProps) {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('10:00');

    const dates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i + 1);
        return d.toISOString().split('T')[0];
    });

    const times = [
        '09:00', '10:00', '11:00', '12:00',
        '14:00', '15:00', '16:00', '17:00', '18:00',
    ];

    const handleSubmit = () => {
        if (date && time) onSubmit(`${date}T${time}:00`);
    };

    const formatDate = (d: string) => {
        const dt = new Date(d);
        return dt.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
    };

    return (
        <div className="space-y-4">
            <h3 className="text-base font-semibold text-text-primary">Talk to Someone Who Understands</h3>
            <p className="text-sm text-text-secondary">We start by listening to your situation. Pick a time — the call takes about 15 minutes. No commitment.</p>

            <div className="flex flex-wrap gap-2">
                {dates.map((d) => (
                    <button
                        key={d}
                        onClick={() => setDate(d)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${date === d
                            ? 'bg-purple text-white'
                            : 'bg-bg-soft text-text-secondary hover:text-text-primary hover:bg-border'
                            }`}
                    >
                        {formatDate(d)}
                    </button>
                ))}
            </div>

            {date && (
                <div className="flex flex-wrap gap-2 animate-fade-in-up">
                    {times.map((t) => (
                        <button
                            key={t}
                            onClick={() => setTime(t)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${time === t
                                ? 'bg-purple text-white'
                                : 'bg-bg-soft text-text-secondary hover:text-text-primary hover:bg-border'
                                }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            )}

            {date && time && (
                <PrimaryButton onClick={handleSubmit} loading={loading}>
                    Book My Private Call
                </PrimaryButton>
            )}
        </div>
    );
}
