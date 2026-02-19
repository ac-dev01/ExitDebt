"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { MockProfile } from "@/lib/mockProfiles";

interface AuthState {
    user: MockProfile | null;
    isLoggedIn: boolean;
    login: (profile: MockProfile) => void;
    updateIncome: (salary: number, salaryDate: number, otherIncome?: number) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthState>({
    user: null,
    isLoggedIn: false,
    login: () => { },
    updateIncome: () => { },
    logout: () => { },
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<MockProfile | null>(null);

    function login(profile: MockProfile) {
        setUser(profile);
    }

    function updateIncome(salary: number, salaryDate: number, otherIncome?: number) {
        setUser((prev) =>
            prev ? { ...prev, salary, salaryDate, otherIncome: otherIncome ?? 0 } : prev
        );
    }

    function logout() {
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, updateIncome, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
