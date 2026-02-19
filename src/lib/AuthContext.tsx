"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { MockProfile } from "@/lib/mockProfiles";

interface AuthState {
    user: MockProfile | null;
    isLoggedIn: boolean;
    login: (profile: MockProfile) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthState>({
    user: null,
    isLoggedIn: false,
    login: () => { },
    logout: () => { },
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<MockProfile | null>(null);

    function login(profile: MockProfile) {
        setUser(profile);
    }

    function logout() {
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
