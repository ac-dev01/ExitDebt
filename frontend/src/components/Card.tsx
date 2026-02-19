import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    padding?: 'sm' | 'md' | 'lg';
    style?: React.CSSProperties;
}

export default function Card({ children, className = '', padding = 'md', style }: CardProps) {
    const paddings = { sm: 'p-4', md: 'p-6', lg: 'p-8' };
    return (
        <div className={`glass-card ${paddings[padding]} ${className}`} style={style}>
            {children}
        </div>
    );
}
