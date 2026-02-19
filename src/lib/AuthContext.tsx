"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { MockProfile } from "@/lib/mockProfiles";
import { selectProfile } from "@/lib/utils";

/* ─── Types ──────────────────────────────────────────────────────────────── */

interface AuthState {
    user: MockProfile | null;
    isLoggedIn: boolean;
    pan: string;
    phone: string;
    isReady: boolean;
}

interface AuthContextType extends AuthState {
    login: (pan: string, phone: string) => void;
    updateIncome: (salary: number, salaryDate: number, otherIncome?: number) => void;
    refreshData: () => void;
    logout: () => void;
}

/* ─── Cookie Helpers ─────────────────────────────────────────────────────── */

const COOKIE_NAME = "exidebt_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function setCookie(data: Record<string, unknown>) {
    if (typeof document === "undefined") return;
    const value = encodeURIComponent(JSON.stringify(data));
    document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Strict`;
}

function getCookie(): Record<string, unknown> | null {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
    if (!match) return null;
    try {
        return JSON.parse(decodeURIComponent(match[1]));
    } catch {
        return null;
    }
}

function deleteCookie() {
    if (typeof document === "undefined") return;
    document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Strict`;
}

/* ─── Context ────────────────────────────────────────────────────────────── */

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoggedIn: false,
    pan: "",
    phone: "",
    isReady: false,
    login: () => { },
    updateIncome: () => { },
    refreshData: () => { },
    logout: () => { },
});

/* ─── Provider ───────────────────────────────────────────────────────────── */

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<MockProfile | null>(null);
    const [pan, setPan] = useState("");
    const [phone, setPhone] = useState("");
    const [isReady, setIsReady] = useState(false);

    // Hydrate from cookie on mount
    useEffect(() => {
        const data = getCookie();
        if (data && data.pan && data.phone) {
            const profile = selectProfile(data.pan as string);
            // Restore income if saved
            if (data.salary) {
                profile.salary = data.salary as number;
                profile.salaryDate = (data.salaryDate as number) || 1;
                profile.otherIncome = (data.otherIncome as number) || 0;
            }
            setUser(profile);
            setPan(data.pan as string);
            setPhone(data.phone as string);
        }
        setIsReady(true);
    }, []);

    // Persist to cookie on state change
    useEffect(() => {
        if (!isReady) return;
        if (user && pan) {
            setCookie({
                pan,
                phone,
                salary: user.salary,
                salaryDate: user.salaryDate,
                otherIncome: user.otherIncome,
            });
        } else {
            deleteCookie();
        }
    }, [user, pan, phone, isReady]);

    const login = useCallback((panValue: string, phoneValue: string) => {
        const profile = selectProfile(panValue);
        setUser(profile);
        setPan(panValue.toUpperCase());
        setPhone(phoneValue);
    }, []);

    const updateIncome = useCallback(
        (salary: number, salaryDate: number, otherIncome?: number) => {
            setUser((prev) =>
                prev ? { ...prev, salary, salaryDate, otherIncome: otherIncome ?? 0 } : prev
            );
        },
        []
    );

    const refreshData = useCallback(() => {
        if (pan) {
            const profile = selectProfile(pan);
            setUser((prev) =>
                prev ? { ...profile, salary: prev.salary, salaryDate: prev.salaryDate, otherIncome: prev.otherIncome } : profile
            );
        }
    }, [pan]);

    const logout = useCallback(() => {
        setUser(null);
        setPan("");
        setPhone("");
        deleteCookie();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoggedIn: !!user,
                pan,
                phone,
                isReady,
                login,
                updateIncome,
                refreshData,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

/* ─── Hook ───────────────────────────────────────────────────────────────── */

export function useAuth() {
    return useContext(AuthContext);
}
