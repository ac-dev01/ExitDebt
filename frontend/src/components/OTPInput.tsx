'use client';

import React, { useRef, useState, KeyboardEvent, ClipboardEvent } from 'react';

interface OTPInputProps {
    length?: number;
    onComplete: (code: string) => void;
    disabled?: boolean;
}

export default function OTPInput({ length = 6, onComplete, disabled = false }: OTPInputProps) {
    const [values, setValues] = useState<string[]>(Array(length).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newValues = [...values];
        newValues[index] = value.slice(-1);
        setValues(newValues);

        if (value && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }

        const code = newValues.join('');
        if (code.length === length && !code.includes('')) {
            onComplete(code);
        }
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !values[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
        if (pasted.length === length) {
            const newValues = pasted.split('');
            setValues(newValues);
            inputRefs.current[length - 1]?.focus();
            onComplete(pasted);
        }
    };

    return (
        <div className="flex gap-3 justify-center">
            {values.map((value, index) => (
                <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={value}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    disabled={disabled}
                    className="w-12 h-14 text-center text-xl font-bold bg-bg-soft border border-border rounded-xl text-text-primary focus:border-purple focus:outline-none focus:ring-2 focus:ring-purple/15 transition-all duration-200 disabled:opacity-50"
                    aria-label={`OTP digit ${index + 1}`}
                />
            ))}
        </div>
    );
}
