"use client";

import { useState } from "react";

const FAQ_ITEMS = [
    {
        question: "Is this really free?",
        answer:
            "Yes. The debt health check is completely free. We earn a referral fee from lenders when you choose to restructure your debt through our partners – never from you directly.",
    },
    {
        question: "How do you make money?",
        answer:
            "We earn from lenders, not from you. When we help you consolidate or restructure your debt at a lower rate, the lending partner pays us a referral fee. Your interests are always aligned with ours.",
    },
    {
        question: "Is my PAN data safe?",
        answer:
            "Absolutely. We use bank-grade 256-bit encryption. Your PAN is used solely to fetch your credit report and is never stored on our servers or shared with third parties without your explicit consent.",
    },
    {
        question: "Will this affect my CIBIL score?",
        answer:
            "No. We perform a 'soft pull' of your credit report, which does not impact your CIBIL score in any way. Only hard inquiries (like applying for a loan) can affect your score.",
    },
    {
        question: "What happens during the callback?",
        answer:
            "A certified debt specialist will review your report with you, explain your options for debt restructuring, and answer any questions. There's no obligation to proceed – it's purely advisory.",
    },
    {
        question: "How much can I actually save?",
        answer:
            "Savings depend on your current debt profile. On average, our users save between ₹15,000 to ₹80,000 per year by switching from high-interest credit card debt to lower-rate personal loans or balance transfers.",
    },
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    function toggle(index: number) {
        setOpenIndex(openIndex === index ? null : index);
    }

    return (
        <section id="faq" className="max-w-3xl mx-auto px-4 py-16">
            <div className="text-center mb-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
                <p className="text-gray-500 mt-2 text-sm">Everything you need to know before getting started</p>
            </div>

            <div className="space-y-3">
                {FAQ_ITEMS.map((faq, index) => (
                    <div
                        key={index}
                        className="border border-gray-100 rounded-xl overflow-hidden bg-white transition-shadow duration-200 hover:shadow-sm"
                    >
                        <button
                            onClick={() => toggle(index)}
                            className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50/50 transition-colors duration-200 cursor-pointer"
                            aria-expanded={openIndex === index}
                            aria-controls={`faq-answer-${index}`}
                        >
                            <span className="text-sm font-medium text-gray-900 pr-4">{faq.question}</span>
                            <svg
                                className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""
                                    }`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        <div
                            id={`faq-answer-${index}`}
                            role="region"
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
                                }`}
                        >
                            <p className="px-6 pb-4 text-sm text-gray-500 leading-relaxed">{faq.answer}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
