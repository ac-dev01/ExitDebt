# ExitDebt

A minimalist, high-trust web platform that helps salaried Indians understand and restructure their debt. Built with Next.js, TypeScript, and Tailwind CSS v4.

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Install & Run
```bash
cd exitdebt-app
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production
```bash
npm run build
npm start
```

### Deploy to Vercel
```bash
npx vercel
```

## User Flow

```
Landing Page → PAN + Phone → Income Details → Debt Intelligence Dashboard
```

1. **Landing Page** (`/`) — Enter PAN card number and phone to pull mock CIBIL report
2. **Income Details** (`/income`) — Provide monthly salary, salary date, and optional other income
3. **Dashboard** (`/dashboard`) — Full debt intelligence overview with 9 interactive sections

## Features

### Landing Page
- **Instant Debt Health Check** — PAN + phone form with validation
- **Trust Signals** — "No CIBIL impact", "256-bit encrypted", "Free forever" pills
- **How It Works** — 3-step process explainer
- **Security Section** — Bank-grade encryption, no data selling
- **Blog Section** — Financial articles with category badges
- **SEO Optimized** — Meta tags, OG tags, structured data schema

### Income Details Screen
- **Salary Input** — Required monthly after-tax salary with ₹ prefix
- **Salary Date** — Day of month (1–31) for salary credit
- **Other Income** — Optional additional income source
- **Inline Validation** — Real-time error messages, disabled button until valid
- **Trust Copy** — Privacy reassurance and data usage explanation

### Debt Intelligence Dashboard
- **Debt Health Score** — Animated SVG gauge with color-coded severity (0–100)
- **Summary Cards** — Total outstanding, monthly EMI, active accounts, avg interest rate
- **Account List** — Sortable by APR with high-rate (>18%) warning badges
- **Debt Freedom GPS** — Current vs. optimized debt-free timeline comparison
- **Interest Leak Report** — Principal/interest split with avoidable interest warning
- **Smart Payment Prioritizer** — Interactive tool: enter extra cash, see optimal allocation via avalanche method
- **Salary Day Cash Flow** — EMI timeline against salary credit with EMI-to-salary ratio warning
- **Refresh & Share** — Refresh data, download PDF, share on WhatsApp

## Design System

Built on Tailwind CSS v4 `@theme` directive:

| Token | Value | Usage |
|---|---|---|
| `--color-purple` | `#7300BE` | Primary accent — buttons, logos, CTAs |
| `--color-purple-light` | `#9333EA` | Secondary purple |
| `--color-blue` | `#00B1FF` | Step numbers, decorative |
| `--color-cyan` | `#00FCFE` | Highlights |
| `--color-danger` | `#DC2626` | High-rate warnings, errors |
| `--color-warning` | `#D97706` | Interest leak alerts |
| `--color-success` | `#059669` | OK badges, savings |
| `--color-bg` | `#FCFCFC` | Page background |
| `--color-bg-soft` | `#F5F5F7` | Section backgrounds |
| `--color-bg-card` | `#FFFFFF` | Card surfaces |
| `--color-text-primary` | `#1A1A2E` | Headings |
| `--color-text-secondary` | `#6B7280` | Body text |
| `--color-text-muted` | `#9CA3AF` | Captions, labels |
| `--color-border` | `#E5E7EB` | All borders |

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (`@theme` tokens) |
| Font | Inter (via next/font) |
| State | React Context (`AuthContext`) |
| Data | Mock profiles (no API calls) |

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout, fonts, SEO metadata
│   ├── page.tsx                # Landing page
│   ├── globals.css             # @theme tokens, animations
│   ├── income/
│   │   └── page.tsx            # Income collection screen
│   ├── dashboard/
│   │   └── page.tsx            # Debt Intelligence Dashboard
│   └── articles/
│       └── [slug]/page.tsx     # Blog article pages
├── components/
│   ├── Navbar.tsx              # Sticky nav with auth-aware links
│   ├── Footer.tsx              # Matches header scheme
│   ├── Form.tsx                # PAN/phone validation + submit
│   ├── LoadingSpinner.tsx      # "Pulling credit report..." state
│   ├── CallbackBooking.tsx     # Time slot picker
│   └── dashboard/
│       ├── DashboardBanner.tsx         # Free trial + last updated
│       ├── DashboardScoreGauge.tsx     # Animated SVG score circle
│       ├── DebtSummaryCards.tsx        # 4 metric cards
│       ├── DashboardAccountList.tsx    # Account table + mobile cards
│       ├── DebtFreedomGPS.tsx          # Timeline comparison
│       ├── InterestLeakReport.tsx      # EMI breakdown + avoidable interest
│       ├── SmartPaymentPrioritizer.tsx # Interactive payment allocator
│       ├── SalaryCashFlow.tsx          # Salary vs EMI calendar
│       └── RefreshShare.tsx            # Refresh, PDF, WhatsApp buttons
└── lib/
    ├── AuthContext.tsx          # Auth state + updateIncome method
    ├── mockProfiles.ts         # 4 predefined debt profiles
    ├── calculations.ts         # Interest leak, payment prioritizer, cash flow
    └── utils.ts                # Validation, formatting, profile selection
```

## Mock Data

The app includes 4 predefined profiles. Enter PAN `ABCDE1234F` to load Saurabh's critical debt profile (score: 38), or any other valid PAN to get a deterministic profile assignment.

Each profile includes: accounts with lender/APR/EMI/due-date, salary info, and debt-free timeline projections.

## Calculations Engine (`lib/calculations.ts`)

| Function | Description |
|---|---|
| `calculateInterestLeak()` | Splits total EMI into principal vs interest, calculates avoidable interest at optimal rate |
| `calculatePaymentPrioritizer()` | Allocates extra payments using avalanche method (highest APR first), returns per-account savings |
| `calculateCashFlow()` | Orders EMIs by due date against salary credit, computes remaining balance and EMI-to-salary ratio |
