'use client';

import React, { useEffect, useState } from 'react';

interface ScoreGaugeProps {
    score: number;
    size?: number;
    category: string;
}

export default function ScoreGauge({ score, size = 200, category }: ScoreGaugeProps) {
    const [animatedScore, setAnimatedScore] = useState(0);

    useEffect(() => {
        const duration = 1500;
        const start = performance.now();
        const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setAnimatedScore(Math.round(eased * score));
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [score]);

    const radius = (size - 20) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

    const getColor = () => {
        if (score >= 85) return '#059669';
        if (score >= 65) return '#00B1FF';
        if (score >= 40) return '#D97706';
        return '#DC2626';
    };

    return (
        <div className="flex flex-col items-center score-gauge">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="10"
                    strokeLinecap="round"
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={getColor()}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                    style={{ transition: 'stroke-dashoffset 0.1s ease' }}
                />
                <text
                    x={size / 2}
                    y={size / 2 - 8}
                    textAnchor="middle"
                    fill={getColor()}
                    fontSize="42"
                    fontWeight="800"
                    fontFamily="Inter, sans-serif"
                >
                    {animatedScore}
                </text>
                <text
                    x={size / 2}
                    y={size / 2 + 18}
                    textAnchor="middle"
                    fill="#9CA3AF"
                    fontSize="13"
                    fontFamily="Inter, sans-serif"
                >
                    out of 100
                </text>
            </svg>
            <span
                className="mt-2 text-base font-semibold"
                style={{ color: getColor() }}
            >
                {category}
            </span>
        </div>
    );
}
