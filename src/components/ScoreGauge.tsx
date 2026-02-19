"use client";

import { useEffect, useState } from "react";

interface ScoreGaugeProps {
    score: number;
    label: string;
    color: "red" | "orange" | "yellow" | "green";
}

const ARC_COLORS: Record<string, string> = {
    red: "#EF4444",
    orange: "#F97316",
    yellow: "#EAB308",
    green: "#22C55E",
};

const LABEL_BG: Record<string, string> = {
    red: "#FEF2F2",
    orange: "#FFF7ED",
    yellow: "#FEFCE8",
    green: "#F0FDF4",
};

const LABEL_TEXT: Record<string, string> = {
    red: "#DC2626",
    orange: "#EA580C",
    yellow: "#CA8A04",
    green: "#16A34A",
};

export default function ScoreGauge({ score, label, color }: ScoreGaugeProps) {
    const [animatedScore, setAnimatedScore] = useState(0);
    const arcColor = ARC_COLORS[color];

    useEffect(() => {
        let current = 0;
        const step = score / 50;
        const interval = setInterval(() => {
            current += step;
            if (current >= score) {
                setAnimatedScore(score);
                clearInterval(interval);
            } else {
                setAnimatedScore(Math.round(current));
            }
        }, 20);
        return () => clearInterval(interval);
    }, [score]);

    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const progress = (animatedScore / 100) * circumference;
    const dashOffset = circumference - progress;

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative w-48 h-48">
                <svg viewBox="0 0 180 180" className="w-full h-full -rotate-90">
                    <circle cx="90" cy="90" r={radius} fill="none" stroke="#F3F4F6" strokeWidth="10" strokeLinecap="round" />
                    <circle
                        cx="90" cy="90" r={radius} fill="none"
                        stroke={arcColor} strokeWidth="10" strokeLinecap="round"
                        strokeDasharray={circumference} strokeDashoffset={dashOffset}
                        style={{ transition: "stroke-dashoffset 0.04s linear" }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-gray-900 tabular-nums">{animatedScore}</span>
                    <span className="text-sm text-gray-400 font-medium">/100</span>
                </div>
            </div>
            <span
                className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
                style={{ backgroundColor: LABEL_BG[color], color: LABEL_TEXT[color] }}
            >
                {label}
            </span>
        </div>
    );
}
