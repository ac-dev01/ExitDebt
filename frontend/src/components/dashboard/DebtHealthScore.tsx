'use client';

import React, { useEffect, useState } from 'react';

interface DebtHealthScoreProps {
  score: number;
  category: { label: string; emoji: string; color: string; message: string };
  creditScore: number;
}

export default function DebtHealthScore({ score, category, creditScore }: DebtHealthScoreProps) {
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

  const size = 200;
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="glass-card p-8 text-center animate-fade-in-up">
      <h2 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-6">
        Your Debt Health Score
      </h2>

      <div className="flex flex-col items-center score-gauge">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="#E5E7EB" strokeWidth="10" strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke={category.color} strokeWidth="10" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: 'stroke-dashoffset 0.1s ease' }}
          />
          <text x={size / 2} y={size / 2 - 8} textAnchor="middle"
            fill={category.color} fontSize="42" fontWeight="800" fontFamily="Inter, sans-serif">
            {animatedScore}
          </text>
          <text x={size / 2} y={size / 2 + 18} textAnchor="middle"
            fill="#9CA3AF" fontSize="13" fontFamily="Inter, sans-serif">
            out of 100
          </text>
        </svg>

        <span className="mt-2 text-base font-semibold" style={{ color: category.color }}>
          {category.emoji} {category.label}
        </span>
        <p className="mt-2 text-sm text-text-secondary">{category.message}</p>
      </div>

      {creditScore > 0 && (
        <p className="mt-4 text-sm text-text-secondary">
          CIBIL Score: <span className="text-text-primary font-semibold">{creditScore}</span>
        </p>
      )}
    </div>
  );
}
