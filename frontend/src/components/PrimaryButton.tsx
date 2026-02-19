'use client';

import React from 'react';

interface PrimaryButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    loading?: boolean;
    type?: 'button' | 'submit';
    className?: string;
    variant?: 'primary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

export default function PrimaryButton({
    children,
    onClick,
    disabled = false,
    loading = false,
    type = 'button',
    className = '',
    variant = 'primary',
    size = 'md',
}: PrimaryButtonProps) {
    const base = 'font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer';
    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-3.5 text-base',
    };
    const variants = {
        primary:
            'bg-purple text-white hover:bg-purple-light active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed',
        outline:
            'border border-purple text-purple hover:bg-purple/5 disabled:opacity-40',
        ghost:
            'text-purple hover:bg-purple/5 disabled:opacity-40',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
        >
            {loading && (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            )}
            {children}
        </button>
    );
}
