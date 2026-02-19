"use client";

export default function Footer() {
    return (
        <footer className="bg-white" style={{ boxShadow: "0 -2px 12px rgba(0,0,0,0.08)" }}>
            <div className="max-w-6xl mx-auto px-8 py-14">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                                style={{ backgroundColor: "var(--navy)" }}
                            >
                                E
                            </div>
                            <span className="text-lg font-bold tracking-tight" style={{ color: "var(--navy)" }}>
                                ExitDebt
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Understand, restructure, and exit your debt — on your terms.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--navy)" }}>Company</p>
                        <div className="space-y-2.5">
                            <a href="#" className="block text-sm text-gray-500 hover:text-gray-900 transition-colors">About us</a>
                            <a href="#" className="block text-sm text-gray-500 hover:text-gray-900 transition-colors">Privacy Policy</a>
                            <a href="#" className="block text-sm text-gray-500 hover:text-gray-900 transition-colors">Terms of Service</a>
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--navy)" }}>Get in touch</p>
                        <div className="space-y-2.5">
                            <p className="text-sm text-gray-500">support@exitdebt.in</p>
                            <p className="text-sm text-gray-500">Mumbai, India</p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-100 mt-10 pt-6">
                    <p className="text-xs text-gray-400">
                        © {new Date().getFullYear()} ExitDebt Technologies Pvt. Ltd. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
