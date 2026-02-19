import React from 'react';

interface AlertBannerProps {
    type: 'info' | 'warning' | 'error' | 'success';
    message: string;
    onDismiss?: () => void;
}

const styles = {
    info: 'bg-blue/5 border-blue/20 text-blue',
    warning: 'bg-warning/5 border-warning/20 text-warning',
    error: 'bg-danger/5 border-danger/20 text-danger',
    success: 'bg-success/5 border-success/20 text-success',
};

export default function AlertBanner({ type, message, onDismiss }: AlertBannerProps) {
    return (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${styles[type]}`}>
            <p className="flex-1 text-sm">{message}</p>
            {onDismiss && (
                <button
                    onClick={onDismiss}
                    className="text-current opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
                >
                    ✕
                </button>
            )}
        </div>
    );
}
