'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { selectProfile, type MockProfile } from '@/lib/mockProfiles';

// ─── Types ────────────────────────────────────────────────────────────────

interface AuthState {
  isAuthenticated: boolean;
  pan: string;
  phone: string;
  name: string;
  monthlySalary: number;
  salaryDate: number;
  mockProfile: MockProfile | null;
  lastUpdated: Date | null;
}

interface AuthContextType extends AuthState {
  login: (pan: string, phone: string) => void;
  setIncomeDetails: (salary: number, salaryDate: number) => void;
  refreshData: () => void;
  logout: () => void;
  isReady: boolean;
}

// ─── Context ──────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const COOKIE_NAME = 'exidebt_session';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days (PRD: auto-delete after 30 days)

const initialState: AuthState = {
  isAuthenticated: false,
  pan: '',
  phone: '',
  name: '',
  monthlySalary: 0,
  salaryDate: 1,
  mockProfile: null,
  lastUpdated: null,
};

// ─── Cookie Helpers ───────────────────────────────────────────────────────

function setCookie(data: Record<string, unknown>) {
  if (typeof document === 'undefined') return;
  const value = encodeURIComponent(JSON.stringify(data));
  document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Strict`;
}

function getCookie(): Record<string, unknown> | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match[1]));
  } catch {
    return null;
  }
}

function deleteCookie() {
  if (typeof document === 'undefined') return;
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Strict`;
}

// ─── Provider ─────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);
  const [isReady, setIsReady] = useState(false);

  // Hydrate from cookie on mount
  useEffect(() => {
    const data = getCookie();
    if (data && data.pan && data.phone) {
      const profile = selectProfile(data.pan as string);
      setState({
        isAuthenticated: true,
        pan: data.pan as string,
        phone: data.phone as string,
        name: (data.name as string) || profile.name,
        monthlySalary: (data.monthlySalary as number) || 0,
        salaryDate: (data.salaryDate as number) || 1,
        mockProfile: profile,
        lastUpdated: data.lastUpdated ? new Date(data.lastUpdated as string) : null,
      });
    }
    setIsReady(true);
  }, []);

  // Persist to cookie on state change
  useEffect(() => {
    if (!isReady) return;
    if (state.isAuthenticated) {
      setCookie({
        pan: state.pan,
        phone: state.phone,
        name: state.name,
        monthlySalary: state.monthlySalary,
        salaryDate: state.salaryDate,
        lastUpdated: state.lastUpdated?.toISOString() || null,
      });
    } else {
      deleteCookie();
    }
  }, [state, isReady]);

  const login = useCallback((pan: string, phone: string) => {
    const profile = selectProfile(pan);
    setState((prev: AuthState) => ({
      ...prev,
      isAuthenticated: true,
      pan,
      phone,
      name: profile.name,
      mockProfile: profile,
      lastUpdated: new Date(),
    }));
  }, []);

  const setIncomeDetails = useCallback((salary: number, salaryDate: number) => {
    setState((prev: AuthState) => ({
      ...prev,
      monthlySalary: salary,
      salaryDate,
    }));
  }, []);

  const refreshData = useCallback(() => {
    setState((prev: AuthState) => ({
      ...prev,
      lastUpdated: new Date(),
    }));
  }, []);

  const logout = useCallback(() => {
    setState(initialState);
    deleteCookie();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        setIncomeDetails,
        refreshData,
        logout,
        isReady,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
