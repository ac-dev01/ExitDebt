import { mockProfiles, MockProfile } from "./mockProfiles";

/**
 * Validate PAN card number format: ABCDE1234F
 */
export function validatePAN(pan: string): boolean {
    return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan.toUpperCase().trim());
}

/**
 * Validate Indian mobile number: starts with 6-9, 10 digits
 */
export function validatePhone(phone: string): boolean {
    return /^[6-9]\d{9}$/.test(phone.trim());
}

/**
 * Format number as Indian currency (₹XX,XX,XXX)
 */
export function formatCurrency(amount: number): string {
    return "₹" + amount.toLocaleString("en-IN");
}

/**
 * Select a mock profile based on PAN input.
 * Normalizes PAN to lowercase and matches against predefined hashes.
 * Falls back to a deterministic selection based on PAN character sum.
 */
export function selectProfile(pan: string): MockProfile {
    const normalized = pan.toLowerCase().replace(/[^a-z0-9]/g, "");
    const matched = mockProfiles.find((p) => p.panHash === normalized);
    if (matched) return matched;

    // Deterministic fallback: sum char codes and pick a profile
    const charSum = normalized
        .split("")
        .reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
    return mockProfiles[charSum % mockProfiles.length];
}

/**
 * Calculate yearly overpayment for a single account
 * compared to the optimal interest rate.
 */
export function calculateSavings(
    outstanding: number,
    apr: number,
    optimalRate: number
): number {
    if (apr <= optimalRate) return 0;
    return Math.round((outstanding * (apr - optimalRate)) / 100);
}
