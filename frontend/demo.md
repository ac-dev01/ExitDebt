# ExitDebt MVP — Demo Guide

> This guide walks you through the demo flow using mock data. No real CIBIL data is fetched — everything is simulated.

---

## Quick Start

```bash
cd ExitDebt/frontend
npm install
npm run dev
# Open http://localhost:3000
```

---

## Mock User Profiles

The app selects a mock profile based on the **first letter of the PAN** you enter:

| PAN starts with | Profile     | Name     | CIBIL | Debt Load   | Example PAN    |
|-----------------|-------------|----------|-------|-------------|----------------|
| **A – F**       | High Stress | Saurabh  | 642   | ₹6.24L      | `ABCDE1234F`   |
| **G – N**       | Moderate    | Priya    | 720   | ₹3.50L      | `GHJKL5678M`   |
| **O – Z**       | Healthy     | Arjun    | 785   | ₹15.30L     | `PQRST9012X`   |

### Profile A — High Stress (Saurabh)
- HDFC Credit Card: ₹1.82L at 42% (overdue, 2 missed)
- Bajaj Personal Loan: ₹3.00L at 14%
- Amazon Pay EMI: ₹42K at 18% (1 missed)
- ICICI Credit Card: ₹1.00L at 36% (overdue, 3 missed)

### Profile B — Moderate (Priya)
- SBI Personal Loan: ₹2.00L at 12%
- Axis Credit Card: ₹85K at 24% (1 missed)
- HDFC Auto Loan: ₹65K at 9.5%

### Profile C — Healthy (Arjun)
- HDFC Home Loan: ₹15.00L at 8.5%
- Kotak Credit Card: ₹30K at 18%

---

## Step-by-Step Demo Flow

### 1. Landing Page (`/`)
- You see the homepage with hero section, onboarding form, How It Works, testimonials, and FAQ
- "How It Works" and "FAQ" in the navbar anchor to sections on this page

### 2. Enter Details (on the landing page form)
| Field       | What to enter         | Notes                           |
|-------------|----------------------|----------------------------------|
| Full Name   | Any name             | e.g. `Demo User`                |
| PAN         | `ABCDE1234F`         | Use A-F prefix for high-stress  |
| Phone       | `9876543210`         | Any 10-digit starting with 6-9  |
| Consent     | ✅ Check the box      | Required to proceed              |

### 3. OTP Verification
- Enter **any 6 digits** (e.g. `123456`)
- Click "Verify & Continue"
- A processing spinner appears for ~2 seconds

### 4. Income Overlay (glassmorphism modal)
After OTP verification, a blurred overlay appears asking for income details:

| Field               | What to enter    | Notes                       |
|---------------------|------------------|-----------------------------|
| Monthly Salary      | `60000`          | Min ₹5,000. Try `60,000`   |
| Salary Credit Date  | `1` (or any 1-31)| Day your salary arrives     |

Click **"See My Dashboard →"**

### 5. Dashboard (`/` after login)
The homepage transforms into your **Debt Intelligence Dashboard** showing:
- 🎯 **Debt Health Score** — 0-100 gauge with category (Danger/Warning/Good/Excellent)
- 📊 **Debt Summary** — Total outstanding, total EMI, avg interest rate, potential savings
- 🗺️ **Freedom GPS** — Months to debt-free, potential savings timeline
- 🔍 **Interest Leak** — Breakdown of which debts leak the most interest
- 📋 **Payment Prioritizer** — Sorted by impact (which debt to tackle first)
- 💰 **Salary Cash Flow** — EMI schedule mapped against your salary date
- 📄 **Download Report** / 💬 **Share on WhatsApp**

### 6. Navigation (logged in)
Once logged in, the navbar changes:
- **Dashboard** → links to `/` (your dashboard)
- **How It Works** → links to `/how-it-works` (dedicated page)
- **Articles** → links to `/articles` (6 articles on debt management)
- **FAQ** → links to `/faq` (10 Q&As in 2 categories)
- **Schedule a Call** → links to `/schedule` (callback booking form)
- **Profile avatar** → links to `/profile` (your details + logout)

### 7. Profile Page (`/profile`)
Shows:
- Masked PAN (e.g. `ABCD•••••F`)
- Phone (e.g. `98******10`)
- Monthly salary and salary date
- CIBIL score
- **Logout** button (clears session cookie)

### 8. Schedule a Call (`/schedule`)
- Select a time slot from the list
- Click "Confirm Booking"
- Shows a confirmation message

---

## Persistence

Sessions are stored in a **cookie** (`exitdebt_session`) with:
- `SameSite=Strict`
- 30-day expiry
- Survives page refresh and browser close/reopen

To **reset**: Click "Logout" on the profile page, or clear cookies manually.

---

## Try Different Profiles

| Goal                  | PAN to use      | What you'll see              |
|----------------------|-----------------|-------------------------------|
| Worst-case scenario  | `ABCDE1234F`    | 4 accounts, 42% CC interest   |
| Typical user         | `GHJKL5678M`    | 3 accounts, moderate rates    |
| Best-case scenario   | `PQRST9012X`    | 2 accounts, low rates         |

Each profile gives a completely different dashboard experience — different scores, savings, Freedom GPS timelines, and payment priorities.
