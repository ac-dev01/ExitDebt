"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

export default function Navbar() {
    const { user, isLoggedIn, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function handleSignOut() {
        setDropdownOpen(false);
        logout();
        router.push("/");
    }

    function handleProfile() {
        setDropdownOpen(false);
        router.push("/report");
    }

    return (
        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
            <div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                        style={{ backgroundColor: "var(--navy)" }}
                    >
                        E
                    </div>
                    <span className="text-lg font-bold tracking-tight" style={{ color: "var(--navy)" }}>
                        ExitDebt
                    </span>
                </Link>

                {/* Center — Nav Links */}
                <div className="hidden sm:flex items-center gap-8">
                    {isLoggedIn && user ? (
                        <>
                            <Link href="/" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                                Home
                            </Link>
                            <Link href="/report" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                                Your Report
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link href="#steps" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                                How it works
                            </Link>
                            <Link href="#trust" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                                Security
                            </Link>
                            <Link href="#articles" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                                Articles
                            </Link>
                        </>
                    )}
                </div>

                {/* Right */}
                <div className="flex items-center gap-6">
                    {isLoggedIn && user ? (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-2.5 py-1.5 px-3 rounded-full hover:bg-gray-50 transition-colors cursor-pointer"
                                aria-expanded={dropdownOpen}
                                aria-haspopup="true"
                            >
                                <div
                                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                                    style={{ backgroundColor: "var(--cobalt)" }}
                                >
                                    {user.name.charAt(0)}
                                </div>
                                <span className="text-sm font-medium text-gray-700 hidden sm:block">{user.name}</span>
                                <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-xl py-1.5 animate-scaleIn" style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}>
                                    <button
                                        onClick={handleProfile}
                                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                                    >
                                        Your Report
                                    </button>
                                    <div className="border-t border-gray-50 my-1" />
                                    <button
                                        onClick={handleSignOut}
                                        className="w-full text-left px-4 py-2.5 text-sm text-gray-400 hover:text-red-500 hover:bg-red-50/50 transition-colors cursor-pointer"
                                    >
                                        Sign out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link
                            href="#start"
                            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-semibold transition-all hover:opacity-90"
                            style={{ backgroundColor: "var(--cobalt)", color: "white" }}
                        >
                            Get started
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
