# ExitDebt — Product Requirements Document (PRD)

> **Version:** 2.0 | **Date:** 2026-02-18 | **Author:** Kumar R Anand + ARIA
> **Status:** Draft — Pending Dev Team Review
> **Companion Doc:** [STRATEGY.md](file:///c:/Users/ASUS/Desktop/ventures/Aaditri-Technologies/ExitDebt/STRATEGY.md)

---

## 1. Product Overview

**ExitDebt** is a web-based **debt intelligence platform** that helps salaried Indians understand, track, and optimize their debt. Users input their PAN and phone number, get an instant CIBIL-powered debt health assessment with unique intelligence tools (Freedom GPS, Interest Leak Report, Payment Prioritizer), and get 3 months of free access. After trial, users subscribe at **₹999/year** for ongoing monitoring via Account Aggregator. Separately, the sales team proactively calls high-scare-score users to facilitate consolidation loans.

### Business Objective
Generate revenue through **₹999/year subscriptions** (recurring) and **lender commissions** (1–3% on consolidation loans facilitated by sales team).

### Key Constraint
- **3-person dev team**, 13-week build to soft launch
- Zerodha-like design: clean, minimal, trust-through-transparency
- Organic-only GTM: Reddit, X, chatbot/LLM recommendations

---

## 2. User Journey Map

### 2.1 End-to-End Flow

```
┌─────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ LANDING  │───▶│ ONBOARD  │───▶│ FULL     │───▶│ 3-MONTH  │───▶│ ₹999/yr  │
│  PAGE    │    │  FLOW    │    │ DASHBOARD│    │  TRIAL   │    │  SUBSCRIBE│
└─────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘
  Awareness      PAN + Phone     All tools      Free access     Ongoing
  + Trust        + Consent       instantly       + AA setup      monitoring

  ┌──────────────────────────── PARALLEL ────────────────────────────┐
  │  Sales team calls high-scare-score users → consolidation loan   │
  └─────────────────────────────────────────────────────────────────┘
```

---

### 2.2 Screen-by-Screen Specification

#### Screen 1: Landing Page

**Purpose:** Build trust, explain value, drive users to the health check.

**Layout:**

```
┌────────────────────────────────────────────────────────────┐
│  [ExitDebt Logo]                              [About] [FAQ]│
│                                                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                                                      │  │
│  │    Are you overpaying on your loans?                 │  │
│  │    Check your debt health in 30 seconds. Free.      │  │
│  │                                                      │  │
│  │    [ Check My Debt Health → ]                        │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                            │
│  HOW IT WORKS                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                │
│  │ 1. Enter  │  │ 2. See   │  │ 3. Get   │                │
│  │ PAN +     │  │ your     │  │ a plan   │                │
│  │ Phone     │  │ score    │  │ to save  │                │
│  └──────────┘  └──────────┘  └──────────┘                │
│                                                            │
│  TRUST SIGNALS                                             │
│  • "Free for 3 months. Then ₹999/year."                     │
│  • "Your data is encrypted & never shared without consent"│
│  • "10,000+ health checks completed" (after traction)     │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  FAQ Section (expandable)                            │  │
│  │  • Is this really free?                              │  │
│  │  • How do you make money?                            │  │
│  │  • Is my PAN data safe?                              │  │
│  │  • Will this affect my CIBIL score?                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                            │
│  [Footer: Aaditri Technologies | Privacy | Terms]          │
└────────────────────────────────────────────────────────────┘
```

**Design Notes:**
- Hero: Deep navy background, white text, single CTA button (teal/green)
- No clutter. No stock images. Clean typography (Inter).
- FAQ must address the trust gap ("Is this a scam?")
- Mobile-first responsive design
- "Free for 3 months. Then ₹999/year." — prominent, clean pricing
- Lender commissions and lead partnerships disclosed in Privacy Policy and Terms of Service, not on the landing page

**Functional Requirements:**

| ID | Requirement | Priority |
|----|------------|----------|
| LP-01 | CTA button scrolls to / navigates to onboarding form | P0 |
| LP-02 | FAQ section with expand/collapse | P1 |
| LP-03 | SEO meta tags (title, description, OG tags) | P0 |
| LP-04 | Schema.org structured data for chatbot/LLM discoverability | P1 |
| LP-05 | Cookie consent banner (DPDP Act compliance) | P0 |
| LP-06 | Chatbot widget (bottom-right) for visitor qualification | P1 |

---

#### Screen 2: Onboarding — PAN + Phone Input

**Purpose:** Collect PAN and phone number, get consent, initiate CIBIL pull.

**Layout:**

```
┌────────────────────────────────────────────────────────────┐
│  [← Back to Home]               [ExitDebt Logo]           │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                                                      │  │
│  │   Check your debt health                             │  │
│  │                                                      │  │
│  │   PAN Card Number                                    │  │
│  │   ┌──────────────────────────────────────┐          │  │
│  │   │  ABCDE1234F                          │          │  │
│  │   └──────────────────────────────────────┘          │  │
│  │                                                      │  │
│  │   Mobile Number                                      │  │
│  │   ┌──────────────────────────────────────┐          │  │
│  │   │  +91  9876543210                     │          │  │
│  │   └──────────────────────────────────────┘          │  │
│  │                                                      │  │
│  │   ☐ I consent to ExitDebt checking my credit report  │  │
│  │                                                      │  │
│  │   ☐ I consent to sharing my insights with            │  │
│  │     financial partners (optional)                    │  │
│  │                                                      │  │
│  │   [Privacy Policy]                                   │  │
│  │                                                      │  │
│  │   [ Check My Debt Health → ]                         │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Functional Requirements:**

| ID | Requirement | Priority |
|----|------------|----------|
| OB-01 | PAN validation (format: AAAAA9999A, regex check) | P0 |
| OB-02 | Phone validation (10 digits, Indian mobile format) | P0 |
| OB-03 | OTP verification on phone number (SMS OTP) | P0 |
| OB-04 | Consent checkbox 1 (CIBIL check) must be checked before submit — mandatory | P0 |
| OB-04b | Consent checkbox 2 (sharing with financial partners) is optional — stores opt-in status | P0 |
| OB-05 | On submit: send PAN + phone to backend → trigger CIBIL API call | P0 |
| OB-06 | Loading state: "Pulling your credit report..." (3-8 sec) with progress animation | P0 |
| OB-07 | Error handling: invalid PAN, CIBIL API timeout, no data found | P0 |
| OB-08 | Auto-create lead profile in CRM (Zoho) on submission | P0 |
| OB-09 | Store consent timestamp and IP for DPDP compliance | P0 |
| OB-10 | Rate limiting: max 3 pulls per phone number per 24 hours | P1 |

**OTP Flow:**

```
User enters phone → [ Send OTP ] → 6-digit OTP sent via SMS
                                    → User enters OTP
                                    → Verified? → Proceed
                                    → Failed?   → Retry (max 3 attempts)
                                    → Resend option after 30 seconds
```

---

#### Screen 3: Results — Debt Intelligence Dashboard (FREE for 3 months)

**Purpose:** Deliver full debt intelligence tools. Create ongoing value. Drive subscription retention.

**Layout:**

```
┌────────────────────────────────────────────────────────────────┐
│  [ExitDebt Logo]                              Hi, Saurabh 👋  │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  YOUR DEBT HEALTH SCORE                                │  │
│  │          ┌─────────────┐                                │  │
│  │          │    38/100   │   ⚠️ NEEDS ATTENTION            │  │
│  │          └─────────────┘                                │  │
│  │          (animated gauge)                               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  YOUR DEBT SUMMARY                                      │  │
│  │  Total Outstanding: ₹6,24,000  │  Monthly EMI: ₹28,400  │  │
│  │  Active Accounts: 4            │  Avg Rate: 22.3%       │  │
│  │  ──────────────────────────────────────────              │  │
│  │  HDFC Credit Card     │ ₹1,82,000  │ 42% APR  │ ⚠️     │  │
│  │  Bajaj Personal Loan  │ ₹3,00,000  │ 14% APR  │ ✓      │  │
│  │  Amazon Pay EMI       │ ₹42,000    │ 18% APR  │ ⚠️     │  │
│  │  ICICI Credit Card    │ ₹1,00,000  │ 36% APR  │ ⚠️     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  🧭 DEBT FREEDOM GPS                                    │  │
│  │  Current path: Debt-free in 4y 3mo                      │  │
│  │  With restructuring: 3y 4mo  ⚡ (11 months sooner)      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  💸 INTEREST LEAK REPORT (This Month)                   │  │
│  │  EMIs paid: ₹28,400                                     │  │
│  │  → To principal: ₹14,200  │  → To interest: ₹14,200    │  │
│  │  ⚠️ ₹9,100 of that interest was AVOIDABLE               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  💰 SMART PAYMENT PRIORITIZER                           │  │
│  │  Have extra cash? Enter amount: [₹_____]                │  │
│  │  → ₹7,000 to HDFC Card (saves ₹2,940/yr)               │  │
│  │  → ₹3,000 to ICICI Card (saves ₹1,080/yr)              │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  📅 SALARY DAY CASH FLOW                                │  │
│  │  Salary (5th): ₹60,000                                  │  │
│  │  7th: HDFC Card -₹5,400 │ 10th: Bajaj PL -₹12,000     │  │
│  │  15th: Amazon -₹3,500   │ 20th: ICICI -₹7,500         │  │
│  │  After all EMIs: ₹31,600  │  EMI-to-salary: 47% ⚠️     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  📊 SHARE YOUR RESULTS  (optional)                      │  │
│  │  [ Download PDF ] [ Share on WhatsApp ]                  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  ✅ Full access free for 3 months. Last updated: 18 Feb 2026  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**Functional Requirements:**

| ID | Requirement | Priority |
|----|------------|----------|
| RS-01 | Calculate Debt Health Score from CIBIL data (algorithm below) | P0 |
| RS-02 | Display all active loan/card accounts from CIBIL response | P0 |
| RS-03 | Calculate annual overpayment vs. optimal restructured rate | P0 |
| RS-04 | Flag high-interest accounts (>18% APR) with warning icon | P0 |
| RS-05 | **Debt Freedom GPS**: Calculate debt-free date at current pace + optimized pace | P0 |
| RS-06 | **Interest Leak Report**: Split EMI into principal vs. interest, flag avoidable portion | P0 |
| RS-07 | **Smart Payment Prioritizer**: Input extra amount → show optimal allocation across debts | P0 |
| RS-08 | **Salary Day Cash Flow**: User inputs salary date + amount → map all EMIs to cash flow calendar | P1 |
| RS-09 | **Credit Score Impact Predictor**: Estimate CIBIL score change for each payoff action | P1 |
| RS-10 | **Milestone Celebrations**: Detect closed accounts/score improvements, show celebration UI | P1 |
| RS-11 | Download PDF of debt summary | P1 |
| RS-12 | WhatsApp share button (share score + link to ExitDebt) | P1 |
| RS-13 | Show user's first name (from CIBIL data) for personalization | P1 |
| RS-14 | Score gauge animated on page load (builds from 0 to actual score) | P1 |
| RS-15 | "Last updated" timestamp with "Refresh Data" button (on-demand CIBIL re-pull, limited per year) | P0 |

---

#### Screen 4: Post-Signup Engagement

**Purpose:** Keep the user engaged after health check. Highlight dashboard features. Drive content engagement.

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│   ✅ Welcome to ExitDebt, Saurabh!                         │
│                                                            │
│   Your full debt intelligence dashboard is ready.          │
│   You have 3 months of free access.                        │
│                                                            │
│   What's included:                                         │
│   • Debt Freedom GPS — your debt-free countdown            │
│   • Interest Leak Report — see where money is wasted       │
│   • Smart Payment Prioritizer — optimize extra payments    │
│   • Salary Day Cash Flow — see what's left after EMIs      │
│                                                            │
│   [Go to My Dashboard →]                                   │
│                                                            │
│   Meanwhile, learn more:                                   │
│   • How debt restructuring works →                        │
│   • 5 mistakes people make with credit cards →            │
│   • Success story: How Priya saved ₹62K/year →           │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

| ID | Requirement | Priority |
|----|------------|----------|
| PS-01 | Welcome message with user's first name | P0 |
| PS-02 | Feature highlights with dashboard CTA | P0 |
| PS-03 | Content links for engagement | P1 |

---

## 3. Debt Health Score Algorithm

### Scoring Model (0–100, higher = healthier)

| Factor | Weight | Scoring Logic |
|--------|--------|--------------|
| **Debt-to-Income Ratio (DTI)** | 30% | <30% DTI = 30pts, 30-50% = 20pts, 50-70% = 10pts, >70% = 0pts |
| **Average Interest Rate** | 25% | <12% = 25pts, 12-18% = 18pts, 18-30% = 10pts, >30% = 0pts |
| **Number of Active Accounts** | 15% | 1-2 = 15pts, 3-4 = 10pts, 5-6 = 5pts, >6 = 0pts |
| **Credit Utilization** | 15% | <30% = 15pts, 30-50% = 10pts, 50-75% = 5pts, >75% = 0pts |
| **Payment History (from CIBIL)** | 15% | No missed = 15pts, 1-2 missed = 10pts, 3+ missed = 0pts |

### Score Interpretation

| Score Range | Label | Color | Message |
|------------|-------|-------|---------|
| 80–100 | Healthy ✅ | Green | "Your debt structure is well-managed." |
| 60–79 | Fair ⚡ | Yellow | "There's room to optimize and save." |
| 40–59 | Needs Attention ⚠️ | Orange | "Your debt is costing you more than necessary." |
| 0–39 | Critical 🚨 | Red | "Your debt structure needs immediate restructuring." |

### Savings Calculation

```
For each loan/card:
  optimal_rate = best available consolidation rate for user's profile (10-14% est.)
  current_cost = outstanding_balance × current_rate
  optimal_cost = outstanding_balance × optimal_rate
  savings_per_account = current_cost - optimal_cost

total_annual_savings = sum(savings_per_account for all accounts where current_rate > optimal_rate)
```

> This is a simplified model. The actual optimal rate depends on the user's CIBIL score and lending partner rates, but for the scare score we use a reasonable estimate.

---

## 4. Data Model (High-Level)

### Core Entities

```
┌──────────────┐     ┌──────────────┐     ┌──────────────────┐
│    User       │────▶│  CIBILReport │────▶│  DebtAccount     │
│              │     │              │     │                  │
│  id          │     │  id          │     │  id              │
│  pan_hash    │     │  user_id     │     │  report_id       │
│  phone       │     │  raw_data    │     │  lender_name     │
│  name        │     │  credit_score│     │  account_type    │
│  created_at  │     │  pulled_at   │     │  outstanding     │
│  consent_ts  │     │  expires_at  │     │  interest_rate   │
│  consent_ip  │     │              │     │  emi_amount      │
└──────────────┘     └──────────────┘     │  due_date        │
       │                                   │  status          │
       │                                   └──────────────────┘
       │
       ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────────┐
│ HealthScore  │     │  Callback    │     │  Subscription    │
│              │     │              │     │                  │
│  id          │     │  id          │     │  id              │
│  user_id     │     │  user_id     │     │  user_id         │
│  score       │     │  preferred_  │     │  status          │
│  dti_ratio   │     │   time_slot  │     │  (trial/active/  │
│  avg_rate    │     │  status      │     │   expired)       │
│  savings_est │     │  assigned_to │     │  trial_start     │
│  calculated_ │     │  called_at   │     │  trial_end       │
│   at         │     │  outcome     │     │  subscribed_at   │
└──────────────┘     └──────────────┘     │  expires_at      │
                                          │  payment_ref     │
                                          └──────────────────┘
```

### Key Data Rules

| Rule | Detail |
|------|--------|
| **PAN Storage** | Store only **hashed PAN** (SHA-256). Never store raw PAN after CIBIL pull. |
| **CIBIL Raw Data** | Store encrypted. Auto-expire after 30 days. User can request deletion. |
| **Phone** | Store with OTP verification status. Primary contact for callbacks. |
| **Consent** | Store timestamp, IP, consent text version. Required for DPDP compliance. |
| **Lead Dedup** | Same phone number within 30 days = update existing record, don't create duplicate. |

---

## 5. API Architecture (High-Level)

### External Integrations

| Integration | Purpose | Phase |
|------------|---------|-------|
| **TransUnion CIBIL API** | Pull credit report using PAN (initial + quarterly refresh) | Phase 1 |
| **Account Aggregator** (Finvu/OneMoney) | Monthly data refresh for subscribers (FIU registration required) | Phase 1 (Sprint 4–5) |
| **SMS OTP Provider** (MSG91/Twilio) | Phone verification | Phase 1 |
| **Zoho CRM API** | Create/update lead profiles, assign callbacks | Phase 1 |
| **WATI (WhatsApp API)** | Confirmation messages, nurture drips | Phase 1 |
| **UPI Payment Aggregator** (Razorpay/Cashfree) | UPI collect/intent for ₹999/year subscription payments | Phase 1 |

### Core API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/otp/send` | Send OTP to phone number |
| POST | `/api/otp/verify` | Verify OTP |
| POST | `/api/health-check` | Submit PAN + phone → trigger CIBIL pull → return parsed results |
| GET | `/api/health-check/:id` | Get results for a completed health check |
| POST | `/api/callback` | Book a callback with time preference |
| POST | `/api/subscription/purchase` | Initiate UPI payment for ₹999/year subscription |
| GET | `/api/subscription/status` | Check subscription status (trial/active/expired) |
| POST | `/api/aa/consent` | Initiate AA consent flow for data linking |
| GET | `/api/aa/fetch` | Fetch latest data from Account Aggregator |
| GET | `/api/dashboard/:userId` | Get full dashboard data (Freedom GPS, Interest Leak, Payment Prioritizer, Cash Flow) |
| GET | `/api/dashboard/sales/:userId` | Sales-only: full dashboard + 12-month trends + lender offers |
| POST | `/api/prioritizer/calculate` | Calculate optimal payment allocation for given extra amount |

---

## 6. Design System Guidelines

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#0F1729` (deep navy) | Page backgrounds |
| `--bg-secondary` | `#1A2332` | Card backgrounds |
| `--bg-surface` | `#FFFFFF` | Input fields, light cards |
| `--text-primary` | `#FFFFFF` | Headings on dark bg |
| `--text-secondary` | `#94A3B8` | Body text on dark bg |
| `--text-dark` | `#0F172A` | Text on light bg |
| `--accent` | `#14B8A6` (teal) | CTAs, positive indicators |
| `--warning` | `#F59E0B` (amber) | Caution states |
| `--danger` | `#EF4444` (red) | Critical scores, alerts |
| `--success` | `#22C55E` (green) | Healthy indicators |

### Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| H1 (hero) | Inter | 48px / 3rem | 700 |
| H2 (section) | Inter | 32px / 2rem | 600 |
| H3 (card title) | Inter | 24px / 1.5rem | 600 |
| Body | Inter | 16px / 1rem | 400 |
| Small / Caption | Inter | 14px / 0.875rem | 400 |
| Button | Inter | 16px / 1rem | 600 |

### Component Patterns

| Component | Style |
|-----------|-------|
| **Primary Button** | Teal bg, white text, rounded-lg, subtle hover glow |
| **Card** | Dark bg (#1A2332), 1px border (#2A3447), rounded-xl, subtle shadow |
| **Input** | White bg, dark border, rounded-lg, clear labels above |
| **Score Gauge** | Circular SVG, animated fill, color matches score range |
| **Alert Banner** | Full-width, left color bar (danger/warning/success), icon + text |
| **Loan Row** | Horizontal card, lender name + amount + rate, flag icon for high-rate |

---

## 7. Dev Team Handoff Checklist

### Before Sprint 1 (Week 1–2)

| # | Item | Owner | Status |
|---|------|-------|--------|
| 1 | Review this PRD — ask questions, flag concerns | Dev Team | ☐ |
| 2 | Confirm tech stack (Next.js + Python/FastAPI + PostgreSQL) | Dev Team | ☐ |
| 3 | Set up project repo structure under `ExitDebt/` | Dev 1 | ☐ |
| 4 | Set up CI/CD (GitHub Actions or similar) | Dev 3 | ☐ |
| 5 | Create Figma/design mockups from wireframes above | Dev 1 / Designer | ☐ |
| 6 | Register for CIBIL API sandbox/test account | Kumar | ☐ |
| 7 | Set up Zoho CRM free account | Kumar | ☐ |
| 8 | Register SMS OTP provider (MSG91 dev account) | Dev 2 | ☐ |
| 9 | Purchase `exitdebt.com` domain | Kumar | ☐ |
| 10 | Set up AWS project (hosting — specific services TBD) | Dev 1 | ☐ |

### Sprint Breakdown (Suggested)

| Sprint | Weeks | Focus | Deliverables |
|--------|-------|-------|-------------|
| **Sprint 1** | 1–2 | Foundation | Project setup, design system, DB schema, FastAPI scaffold |
| **Sprint 2** | 3–4 | Core Backend | CIBIL API integration, OTP flow, health score algorithm, savings calculator |
| **Sprint 3** | 5–6 | Core Frontend + Intelligence | Landing page, onboarding, dashboard with Freedom GPS, Interest Leak Report, Payment Prioritizer, Cash Flow |
| **Sprint 4** | 7–8 | Integration + AA | CRM integration, lead scoring, AA FIU registration + consent flow, Credit Score Impact Predictor |
| **Sprint 5** | 9–10 | Subscription + Polish | UPI payment for ₹999/year, subscription gate, WhatsApp nudges, Milestone Celebrations, Sales Dashboard |
| **Sprint 6** | 11–12 | Testing + Launch Prep | Bug fixes, performance, chatbot, internal testing |
| **Sprint 7** | 13 | Soft Launch | Beta users, monitoring, hotfixes |

---

## 8. Non-Functional Requirements

| Requirement | Target |
|------------|--------|
| Page load time (landing) | < 2 seconds |
| CIBIL pull response time | < 8 seconds (show loading animation) |
| Mobile responsiveness | Works on 360px+ width (₹10K phone on 4G) |
| PWA support | Installable, works offline for cached results |
| Data encryption | AES-256 for stored CIBIL data, TLS 1.3 for transit |
| DPDP compliance | Consent flows, data deletion request support |
| Uptime | 99.5% (AWS managed services) |
| Analytics | PostHog or Mixpanel for funnel tracking |

---

## Appendix: Key Decisions Log

| Decision | Rationale | Decided By |
|----------|-----------|-----------|
| PAN-based CIBIL pull (not manual entry) | Zero friction, instant value, verified lead data | Kumar |
| Organic-only GTM | Debt = shame topic, organic trust > paid ads | Kumar |
| Subscription model (₹999/year, 3mo free) | Tool-as-product, recurring revenue, clean value exchange | Kumar |
| Zerodha-like design | Clean, transparent, trust-first | Kumar |
| Python (FastAPI) backend | Dev team preference, strong for data processing/algorithms | Kumar |
| UPI payments via aggregator | India-native, lower fees than cards | Kumar |
| CIBIL + AA hybrid data strategy | CIBIL for discovery, AA for cheap ongoing monitoring | Kumar + ARIA |
| 7 unique intelligence tools | Differentiation from free CIBIL apps (Freedom GPS, Interest Leak, etc.) | Kumar + ARIA |
| User dashboard vs Sales dashboard separation | Clean UX for users, information advantage for sales team | Kumar |
| Next.js frontend | SEO critical for organic/chatbot discoverability | ARIA |
| PostgreSQL | Structured financial data, ACID compliance needed | ARIA |
| Zoho CRM (free tier) | Cost-effective for beta, can upgrade later | ARIA |
| No success fees | Keep pricing clean — user pays ₹999/year only. Revenue from lender commissions + lead gen. | Kumar |
| Disclosure in Privacy Policy | Lender commissions + lead sales disclosed in Privacy Policy & Terms, not on landing page. Consent checkbox covers data sharing. | Kumar |
