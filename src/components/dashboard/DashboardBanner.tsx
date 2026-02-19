"use client";

import { useState, useEffect } from "react";

interface DashboardBannerProps {
    lastUpdated: Date;
}

export default function DashboardBanner({ lastUpdated }: DashboardBannerProps) {
    const [dateStr, setDateStr] = useState("");

    useEffect(() => {
        setDateStr(
            lastUpdated.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) +
            ", " +
            lastUpdated.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
        );
    }, [lastUpdated]);

    return (
        <div
            className="w-full rounded-xl px-5 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 animate-fadeIn"
            style={{ backgroundColor: "var(--color-bg-soft)", border: "1px solid var(--color-border)" }}
        >
            <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "var(--color-purple)" }} />
                <span className="text-sm font-medium" style={{ color: "var(--color-purple)" }}>
                    Full access free for 3 months
                </span>
            </div>
            <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                Last updated: {dateStr}
            </span>
        </div>
    );
}
