'use client';

import React, { useState } from 'react';

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQAccordionProps {
    items: FAQItem[];
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <div className="space-y-3">
            {items.map((item, index) => (
                <div
                    key={index}
                    className="glass-card overflow-hidden transition-all duration-200"
                >
                    <button
                        onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        className="w-full px-5 py-4 flex items-center justify-between text-left cursor-pointer"
                    >
                        <span className="font-medium text-text-primary pr-4 text-sm">{item.question}</span>
                        <svg
                            className={`w-4 h-4 text-text-muted transition-transform duration-200 flex-shrink-0 ${openIndex === index ? 'rotate-180' : ''
                                }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <div
                        className={`px-5 overflow-hidden transition-all duration-200 ${openIndex === index ? 'max-h-96 pb-4' : 'max-h-0'
                            }`}
                    >
                        <p className="text-text-secondary text-sm leading-relaxed">{item.answer}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
