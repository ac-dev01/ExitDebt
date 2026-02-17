# ExitDebt — Product Requirements Document (PRD)

> **Version:** 1.0 | **Date:** 2026-02-17 | **Author:** Kumar R Anand + ARIA
> **Status:** Draft — Pending Dev Team Review
> **Companion Doc:** [STRATEGY.md](file:///c:/Users/ASUS/Desktop/ventures/Aaditri-Technologies/ExitDebt/STRATEGY.md)

---

## 1. Product Overview

**ExitDebt** is a web-based platform that helps salaried Indians understand and restructure their debt. Users input their PAN and phone number, get an instant CIBIL-powered debt health assessment, and are connected with the ExitDebt sales team for advisory plans and consolidation loan facilitation.

### Business Objective
Generate revenue through **tiered advisory plans** (sold by sales team) and **lender commissions** (consolidation loans facilitated via lending partners).

### Key Constraint
- **3-person dev team**, 13-week build to soft launch
- Zerodha-like design: clean, minimal, trust-through-transparency
- Organic-only GTM: Reddit, X, chatbot/LLM recommendations

---

## 2. User Journey Map

### 2.1 End-to-End Flow

```
┌─────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ LANDING  │───▶│ ONBOARD  │───▶│ RESULTS  │───▶│ CALLBACK │───▶│  UPSELL  │
│  PAGE    │    │  FLOW    │    │  SCREEN  │    │  BOOKED  │    │  (CALL)  │
└─────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘
  Awareness      PAN + Phone     Scare Score     "We'll call"   Advisory Plan
  + Trust        + Consent       + Savings $      Schedule       + Loan Offer
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
│  • "We earn from lenders, not from you"                   │
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
- "We earn from lenders, not from you" — prominent, Zerodha-style transparency

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
│  │   ☐ I consent to ExitDebt checking my credit report │  │
│  │     [Privacy Policy]                                │  │
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
| OB-04 | Consent checkbox must be checked before submit | P0 |
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

#### Screen 3: Results — Debt Health Dashboard (FREE)

**Purpose:** Show scare score + savings potential. Create urgency. Capture callback request.

**Layout:**

```
┌────────────────────────────────────────────────────────────────┐
│  [ExitDebt Logo]                              Hi, Saurabh 👋  │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                                                          │  │
│  │   YOUR DEBT HEALTH SCORE                                │  │
│  │                                                          │  │
│  │          ┌─────────────┐                                │  │
│  │          │             │                                │  │
│  │          │    38       │   ⚠️ NEEDS ATTENTION            │  │
│  │          │   /100      │                                │  │
│  │          │             │   "Your debt structure is      │  │
│  │          └─────────────┘    costing you significantly   │  │
│  │          (circular gauge)    more than necessary."      │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  YOUR DEBT SUMMARY                                      │  │
│  │                                                          │  │
│  │  Total Outstanding    │  ₹6,24,000                      │  │
│  │  Monthly EMI Outgo    │  ₹28,400                        │  │
│  │  Active Accounts      │  4                               │  │
│  │  Avg Interest Rate    │  22.3%                           │  │
│  │  ──────────────────────────────────────────              │  │
│  │                                                          │  │
│  │  HDFC Credit Card     │ ₹1,82,000  │ 42% APR  │ ⚠️     │  │
│  │  Bajaj Personal Loan  │ ₹3,00,000  │ 14% APR  │ ✓      │  │
│  │  Amazon Pay EMI       │ ₹42,000    │ 18% APR  │ ⚠️     │  │
│  │  ICICI Credit Card    │ ₹1,00,000  │ 36% APR  │ ⚠️     │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                                                          │  │
│  │   💰 YOU'RE OVERPAYING ₹47,200/YEAR                     │  │
│  │                                                          │  │
│  │   By restructuring your debt, you could save            │  │
│  │   ₹47,200 every year in interest charges.               │  │
│  │                                                          │  │
│  │   Want to know exactly how?                             │  │
│  │                                                          │  │
│  │   ┌──────────────────────────────────────────────────┐  │  │
│  │   │  Best time to call you?                          │  │  │
│  │   │                                                  │  │  │
│  │   │  ○ Morning (10am–12pm)                          │  │  │
│  │   │  ○ Afternoon (2pm–5pm)                          │  │  │
│  │   │  ○ Evening (6pm–8pm)                            │  │  │
│  │   │                                                  │  │  │
│  │   │  [ Get My Free Callback → ]                      │  │  │
│  │   └──────────────────────────────────────────────────┘  │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  📊 SHARE YOUR RESULTS  (optional)                      │  │
│  │  [ Download PDF ] [ Share on WhatsApp ]                  │  │
│  └──────────────────────────────────────────────────────────┘  │
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
| RS-05 | Callback time preference selector + submit button | P0 |
| RS-06 | On callback submit: update lead in CRM with preferred time, trigger notification to Kumar/callers | P0 |
| RS-07 | Download PDF of debt summary (basic) | P1 |
| RS-08 | WhatsApp share button (share score + link to ExitDebt) | P1 |
| RS-09 | Show user's first name (from CIBIL data) for personalization | P1 |
| RS-10 | Score gauge animated on page load (builds from 0 to actual score) | P1 |

---

#### Screen 4: Callback Confirmed

**Purpose:** Confirm callback, set expectations, keep user engaged.

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│   ✅ You're all set, Saurabh!                             │
│                                                            │
│   Our debt specialist will call you                        │
│   today between 2pm – 5pm.                                │
│                                                            │
│   What to expect on the call:                             │
│   1. We'll walk through your debt situation               │
│   2. Explain your best restructuring options              │
│   3. Help you save ₹47,200/year if you choose to act     │
│                                                            │
│   [Download Your Debt Summary PDF]                         │
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
| CB-01 | Confirmation message with selected time slot | P0 |
| CB-02 | WhatsApp confirmation message to user's phone | P1 |
| CB-03 | Content links for engagement while waiting | P1 |

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
│ HealthScore  │     │  Callback    │     │  AdvisoryPlan    │
│              │     │              │     │                  │
│  id          │     │  id          │     │  id              │
│  user_id     │     │  user_id     │     │  user_id         │
│  score       │     │  preferred_  │     │  tier (S/P/Pr)   │
│  dti_ratio   │     │   time_slot  │     │  price           │
│  avg_rate    │     │  status      │     │  status          │
│  savings_est │     │  assigned_to │     │  purchased_at    │
│  calculated_ │     │  called_at   │     │  plan_data (JSON)│
│   at         │     │  outcome     │     │                  │
└──────────────┘     └──────────────┘     └──────────────────┘
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
| **TransUnion CIBIL API** | Pull credit report using PAN | Phase 1 |
| **SMS OTP Provider** (MSG91/Twilio) | Phone verification | Phase 1 |
| **Zoho CRM API** | Create/update lead profiles, assign callbacks | Phase 1 |
| **WATI (WhatsApp API)** | Confirmation messages, nurture drips | Phase 1 |
| **UPI Payment Aggregator** (Razorpay/Cashfree) | UPI collect/intent for advisory plan payments, UPI AutoPay mandates for Phase 2 | Phase 1 |

### Core API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/otp/send` | Send OTP to phone number |
| POST | `/api/otp/verify` | Verify OTP |
| POST | `/api/health-check` | Submit PAN + phone → trigger CIBIL pull → return parsed results |
| GET | `/api/health-check/:id` | Get results for a completed health check |
| POST | `/api/callback` | Book a callback with time preference |
| POST | `/api/advisory/purchase` | Initiate UPI payment for advisory plan (generates UPI intent/collect request) |
| GET | `/api/advisory/:id` | Get advisory plan details (for paid users) |

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
| 10 | Set up Vercel project (frontend hosting) | Dev 1 | ☐ |

### Sprint Breakdown (Suggested)

| Sprint | Weeks | Focus | Deliverables |
|--------|-------|-------|-------------|
| **Sprint 1** | 1–2 | Foundation | Project setup, design system, DB schema, FastAPI scaffold |
| **Sprint 2** | 3–4 | Core Backend | CIBIL API integration, OTP flow, health score algorithm |
| **Sprint 3** | 5–6 | Core Frontend | Landing page, onboarding form, results dashboard |
| **Sprint 4** | 7–8 | Integration | CRM integration, callback flow, lead scoring, savings calculator |
| **Sprint 5** | 9–10 | Payments + Polish | UPI payment integration, advisory plan purchase flow, WhatsApp nudges |
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
| Uptime | 99.5% (Vercel + Railway/Render handles this) |
| Analytics | PostHog or Mixpanel for funnel tracking |

---

## Appendix: Key Decisions Log

| Decision | Rationale | Decided By |
|----------|-----------|-----------|
| PAN-based CIBIL pull (not manual entry) | Zero friction, instant value, verified lead data | Kumar |
| Organic-only GTM | Debt = shame topic, organic trust > paid ads | Kumar |
| Freemium + sales-driven monetization | Free tool drives volume, sales team monetizes via advisory + loans | Kumar |
| Zerodha-like design | Clean, transparent, trust-first | Kumar |
| Python (FastAPI) backend | Dev team preference, strong for data processing/algorithms | Kumar |
| UPI payments via aggregator | India-native, lower fees than cards, AutoPay for Phase 2 subs | Kumar |
| Next.js frontend | SEO critical for organic/chatbot discoverability | ARIA |
| PostgreSQL | Structured financial data, ACID compliance needed | ARIA |
| Zoho CRM (free tier) | Cost-effective for beta, can upgrade later | ARIA |
