import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Documentation — ExitDebt",
    description: "Technical documentation for the ExitDebt platform — architecture, design system, data models, and user flow.",
};

/* ───── Sections Data ───── */

const USER_FLOW = [
    { step: "01", title: "Landing Page", route: "/", desc: "User enters PAN card number and phone. The app validates inputs and selects a mock CIBIL profile." },
    { step: "02", title: "Income Details", route: "/income", desc: "User provides monthly salary, salary date, and optional other income. Data is stored in AuthContext." },
    { step: "03", title: "Dashboard", route: "/dashboard", desc: "Full Debt Intelligence Dashboard with 9 interactive sections powered by the calculations engine." },
];

const DESIGN_TOKENS = [
    { token: "--color-purple", value: "#7300BE", usage: "Primary accent — buttons, logos, CTAs" },
    { token: "--color-purple-light", value: "#9333EA", usage: "Secondary purple highlights" },
    { token: "--color-blue", value: "#00B1FF", usage: "Step numbers, decorative elements" },
    { token: "--color-cyan", value: "#00FCFE", usage: "Accent highlights" },
    { token: "--color-danger", value: "#DC2626", usage: "High-rate warnings, errors, overpaying" },
    { token: "--color-warning", value: "#D97706", usage: "Interest leak, caution badges" },
    { token: "--color-success", value: "#059669", usage: "OK badges, savings indicators" },
    { token: "--color-bg", value: "#FCFCFC", usage: "Page background" },
    { token: "--color-bg-soft", value: "#F5F5F7", usage: "Section & input backgrounds" },
    { token: "--color-bg-card", value: "#FFFFFF", usage: "Card surfaces" },
    { token: "--color-text-primary", value: "#1A1A2E", usage: "Headings, primary content" },
    { token: "--color-text-secondary", value: "#6B7280", usage: "Body text" },
    { token: "--color-text-muted", value: "#9CA3AF", usage: "Captions, labels, placeholders" },
    { token: "--color-border", value: "#E5E7EB", usage: "All borders & dividers" },
    { token: "--color-border-focus", value: "#7300BE", usage: "Focus ring on interactive elements" },
];

const COMPONENTS = [
    { name: "DashboardBanner", file: "dashboard/DashboardBanner.tsx", desc: "Shows free trial status and last-updated timestamp." },
    { name: "DashboardScoreGauge", file: "dashboard/DashboardScoreGauge.tsx", desc: "Animated SVG circular gauge (0–100) with color-coded severity levels." },
    { name: "DebtSummaryCards", file: "dashboard/DebtSummaryCards.tsx", desc: "4 metric cards: total outstanding, monthly EMI, active accounts, avg interest rate." },
    { name: "DashboardAccountList", file: "dashboard/DashboardAccountList.tsx", desc: "Responsive account table sorted by APR with high-rate (>18%) warning badges." },
    { name: "DebtFreedomGPS", file: "dashboard/DebtFreedomGPS.tsx", desc: "Side-by-side comparison of current vs. optimized debt-free timeline." },
    { name: "InterestLeakReport", file: "dashboard/InterestLeakReport.tsx", desc: "Splits EMI into principal vs. interest with avoidable interest warning." },
    { name: "SmartPaymentPrioritizer", file: "dashboard/SmartPaymentPrioritizer.tsx", desc: "Interactive tool: enter extra cash, see optimal allocation via avalanche method." },
    { name: "SalaryCashFlow", file: "dashboard/SalaryCashFlow.tsx", desc: "Visualizes salary credit vs. ordered EMI outflows with ratio warning." },
    { name: "RefreshShare", file: "dashboard/RefreshShare.tsx", desc: "Refresh data, download PDF (placeholder), share on WhatsApp." },
];

const CALCULATIONS = [
    { name: "calculateInterestLeak()", params: "accounts, totalEmi, totalOutstanding, optimalRate", returns: "InterestLeak { totalEmi, principal, interest, avoidable }", desc: "Splits monthly EMI into principal vs interest components. Calculates avoidable interest by comparing current rates against an optimal rate." },
    { name: "calculatePaymentPrioritizer()", params: "extraAmount, accounts, optimalRate", returns: "PaymentAllocation[]", desc: "Allocates extra payments using the avalanche method (highest APR first). Returns per-account amounts and estimated annual savings." },
    { name: "calculateCashFlow()", params: "salary, salaryDate, accounts", returns: "CashFlowResult", desc: "Orders EMIs by due date against salary credit. Computes remaining balance and EMI-to-salary ratio." },
];

const DATA_MODELS = [
    {
        name: "MockProfile",
        fields: [
            "name: string", "panHash: string", "score: number (0–100)", "scoreLabel: string",
            "color: 'red' | 'orange' | 'yellow' | 'green'", "totalOutstanding: number",
            "monthlyEmi: number", "activeAccounts: number", "avgInterestRate: number",
            "accounts: Account[]", "overpayment: number", "optimalRate: number",
            "salary: number", "salaryDate: number (1–31)", "otherIncome: number",
            "currentTimeline: string", "optimizedTimeline: string", "timelineSaved: string",
        ],
    },
    {
        name: "Account",
        fields: [
            "lender: string", "outstanding: number", "apr: number",
            "type: 'credit_card' | 'loan' | 'emi'", "emi: number", "dueDate: number (1–31)",
        ],
    },
];

/* ───── Page Component ───── */

export default function DocsPage() {
    return (
        <div className="min-h-screen" style={{ backgroundColor: "var(--color-bg)" }}>
            {/* Header */}
            <nav style={{ borderBottom: "1px solid var(--color-border)" }}>
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: "var(--color-purple)" }}>E</div>
                        <span className="text-lg font-bold tracking-tight" style={{ color: "var(--color-text-primary)" }}>ExitDebt</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ backgroundColor: "rgba(115,0,190,0.08)", color: "var(--color-purple)" }}>Docs</span>
                        <Link href="/" className="text-sm font-medium transition-colors" style={{ color: "var(--color-text-secondary)" }}>← Back to app</Link>
                    </div>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto px-6 py-12 sm:py-16">
                {/* Title */}
                <div className="mb-14">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: "var(--color-text-primary)" }}>Documentation</h1>
                    <p className="text-base" style={{ color: "var(--color-text-secondary)" }}>Technical reference for the ExitDebt platform — architecture, design system, data models, and calculations engine.</p>
                </div>

                {/* Table of Contents */}
                <div className="rounded-2xl p-6 mb-12" style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}>
                    <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "var(--color-text-muted)" }}>On this page</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {["User Flow", "Design System", "Components", "Calculations", "Data Models", "Tech Stack"].map((s) => (
                            <a key={s} href={`#${s.toLowerCase().replace(/ /g, "-")}`} className="text-sm font-medium px-3 py-2 rounded-lg transition-colors" style={{ color: "var(--color-purple)" }}>
                                {s}
                            </a>
                        ))}
                    </div>
                </div>

                {/* ── User Flow ── */}
                <section id="user-flow" className="mb-16">
                    <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--color-text-primary)" }}>User Flow</h2>
                    <div className="space-y-4">
                        {USER_FLOW.map((item) => (
                            <div key={item.step} className="rounded-xl p-5 flex items-start gap-4" style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}>
                                <span className="text-3xl font-black shrink-0" style={{ color: "var(--color-blue)" }}>{item.step}</span>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-sm font-bold" style={{ color: "var(--color-text-primary)" }}>{item.title}</h3>
                                        <code className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: "var(--color-bg-soft)", color: "var(--color-purple)" }}>{item.route}</code>
                                    </div>
                                    <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Design System ── */}
                <section id="design-system" className="mb-16">
                    <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--color-text-primary)" }}>Design System</h2>
                    <p className="text-sm mb-6" style={{ color: "var(--color-text-secondary)" }}>Built on Tailwind CSS v4 <code className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: "var(--color-bg-soft)", color: "var(--color-purple)" }}>@theme</code> directive. All tokens are CSS custom properties.</p>

                    <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--color-border)" }}>
                        <div className="grid grid-cols-12 gap-4 px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ backgroundColor: "var(--color-bg-soft)", color: "var(--color-text-muted)" }}>
                            <div className="col-span-1"></div>
                            <div className="col-span-3">Token</div>
                            <div className="col-span-2">Value</div>
                            <div className="col-span-6">Usage</div>
                        </div>
                        {DESIGN_TOKENS.map((t) => (
                            <div key={t.token} className="grid grid-cols-12 gap-4 px-5 py-3 items-center" style={{ borderTop: "1px solid var(--color-border)" }}>
                                <div className="col-span-1">
                                    <div className="w-6 h-6 rounded-md border" style={{ backgroundColor: t.value, borderColor: "var(--color-border)" }} />
                                </div>
                                <div className="col-span-3">
                                    <code className="text-xs font-medium" style={{ color: "var(--color-text-primary)" }}>{t.token}</code>
                                </div>
                                <div className="col-span-2">
                                    <code className="text-xs" style={{ color: "var(--color-text-muted)" }}>{t.value}</code>
                                </div>
                                <div className="col-span-6">
                                    <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>{t.usage}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Components ── */}
                <section id="components" className="mb-16">
                    <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--color-text-primary)" }}>Dashboard Components</h2>
                    <p className="text-sm mb-6" style={{ color: "var(--color-text-secondary)" }}>9 modular components compose the Debt Intelligence Dashboard.</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {COMPONENTS.map((c) => (
                            <div key={c.name} className="rounded-xl p-5" style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}>
                                <h3 className="text-sm font-bold mb-1" style={{ color: "var(--color-text-primary)" }}>{c.name}</h3>
                                <code className="text-[10px] px-1.5 py-0.5 rounded block mb-2 w-fit" style={{ backgroundColor: "var(--color-bg-soft)", color: "var(--color-text-muted)" }}>{c.file}</code>
                                <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>{c.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Calculations ── */}
                <section id="calculations" className="mb-16">
                    <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--color-text-primary)" }}>Calculations Engine</h2>
                    <p className="text-sm mb-6" style={{ color: "var(--color-text-secondary)" }}>
                        Located in <code className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: "var(--color-bg-soft)", color: "var(--color-purple)" }}>lib/calculations.ts</code>. Pure functions with no side effects.
                    </p>

                    <div className="space-y-4">
                        {CALCULATIONS.map((fn) => (
                            <div key={fn.name} className="rounded-xl p-5" style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}>
                                <code className="text-sm font-bold" style={{ color: "var(--color-purple)" }}>{fn.name}</code>
                                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--color-text-muted)" }}>Parameters</p>
                                        <code className="text-xs block" style={{ color: "var(--color-text-secondary)" }}>{fn.params}</code>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--color-text-muted)" }}>Returns</p>
                                        <code className="text-xs block" style={{ color: "var(--color-text-secondary)" }}>{fn.returns}</code>
                                    </div>
                                </div>
                                <p className="text-xs mt-3 leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>{fn.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Data Models ── */}
                <section id="data-models" className="mb-16">
                    <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--color-text-primary)" }}>Data Models</h2>
                    <p className="text-sm mb-6" style={{ color: "var(--color-text-secondary)" }}>TypeScript interfaces from <code className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: "var(--color-bg-soft)", color: "var(--color-purple)" }}>lib/mockProfiles.ts</code></p>

                    <div className="space-y-4">
                        {DATA_MODELS.map((model) => (
                            <div key={model.name} className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--color-border)" }}>
                                <div className="px-5 py-3" style={{ backgroundColor: "var(--color-bg-soft)" }}>
                                    <code className="text-sm font-bold" style={{ color: "var(--color-purple)" }}>interface {model.name}</code>
                                </div>
                                <div className="px-5 py-3 space-y-1" style={{ backgroundColor: "var(--color-bg-card)" }}>
                                    {model.fields.map((f) => (
                                        <div key={f} className="flex items-start gap-2">
                                            <span className="text-xs mt-0.5" style={{ color: "var(--color-purple)" }}>•</span>
                                            <code className="text-xs" style={{ color: "var(--color-text-secondary)" }}>{f}</code>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Tech Stack ── */}
                <section id="tech-stack" className="mb-16">
                    <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--color-text-primary)" }}>Tech Stack</h2>

                    <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--color-border)" }}>
                        {[
                            { layer: "Framework", tech: "Next.js 16 (App Router, Turbopack)" },
                            { layer: "Language", tech: "TypeScript" },
                            { layer: "Styling", tech: "Tailwind CSS v4 (@theme tokens)" },
                            { layer: "Typography", tech: "Inter (via next/font)" },
                            { layer: "State", tech: "React Context (AuthContext)" },
                            { layer: "Data", tech: "Mock profiles (no API calls)" },
                        ].map((row, i) => (
                            <div key={row.layer} className="grid grid-cols-12 gap-4 px-5 py-3" style={{ borderTop: i > 0 ? "1px solid var(--color-border)" : undefined, backgroundColor: i === 0 ? "var(--color-bg-soft)" : "var(--color-bg-card)" }}>
                                <div className="col-span-3">
                                    <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: i === 0 ? "var(--color-text-muted)" : "var(--color-text-primary)" }}>{row.layer}</span>
                                </div>
                                <div className="col-span-9">
                                    <span className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{row.tech}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Mock Data Note */}
                <section className="rounded-xl p-6 mb-12" style={{ backgroundColor: "rgba(115,0,190,0.04)", border: "1px solid rgba(115,0,190,0.15)" }}>
                    <h3 className="text-sm font-bold mb-2" style={{ color: "var(--color-purple)" }}>Testing with Mock Data</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                        The app includes 4 predefined profiles. Use PAN <code className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: "var(--color-bg-soft)", color: "var(--color-purple)" }}>ABCDE1234F</code> with
                        phone <code className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: "var(--color-bg-soft)", color: "var(--color-purple)" }}>9876543210</code> to
                        load Saurabh&apos;s critical debt profile (score: 38). Any other valid PAN gets a deterministic profile.
                    </p>
                </section>
            </main>

            {/* Footer */}
            <footer style={{ borderTop: "1px solid var(--color-border)" }}>
                <div className="max-w-5xl mx-auto px-6 py-8">
                    <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>© {new Date().getFullYear()} ExitDebt Technologies Pvt. Ltd.</p>
                </div>
            </footer>
        </div>
    );
}
