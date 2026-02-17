# ExitDebt

**See your debt clearly. Solve it smartly.**

ExitDebt is a free debt health assessment platform for salaried Indians. Users enter their PAN and phone number, get an instant CIBIL-powered debt health score, and see exactly how much they're overpaying in interest — all in 30 seconds.

---

## 💡 How It Works

```
PAN + Phone  →  CIBIL Pull  →  Debt Health Score  →  Savings Estimate  →  Expert Callback
```

1. **Enter PAN + Phone** — Verified via OTP
2. **Instant CIBIL Pull** — All loans and credit cards auto-populated
3. **Debt Health Score** — Proprietary 0–100 score (based on DTI, rates, utilization, history)
4. **Savings Estimate** — "You're overpaying ₹47K/year in interest"
5. **Expert Callback** — Sales team explains restructuring path, facilitates consolidation

## 💰 Business Model

Free tool for users. Revenue from:
- **Tiered Advisory Plans** (₹999 / ₹2,999 / ₹4,999) — sold by sales team during callback
- **Lender Commissions** (1–3% on consolidation loans facilitated via lending partners)
- **Lead Gen Fees** (₹500–₹2,000 per PAN-verified, CIBIL-enriched lead)

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js (SSR + SEO) |
| Backend | Python (FastAPI) |
| Database | PostgreSQL |
| CRM | Zoho CRM |
| Payments | UPI via aggregator |
| WhatsApp | WATI |
| Hosting | Vercel (frontend) + Railway/Render (backend) |

## 📂 Project Docs

| Document | Description |
|----------|-------------|
| [STRATEGY.md](./STRATEGY.md) | Full strategic deep-dive — market, competition, business model, GTM, brand positioning |
| [PRD.md](./PRD.md) | Product requirements — wireframes, feature specs, data model, API design, sprint plan |

## 📊 Status

| Milestone | Status |
|-----------|--------|
| Strategy & business model | ✅ Complete |
| Product requirements (PRD) | ✅ Complete |
| Dev team handoff | ⬜ Pending |
| Sprint 1 kickoff | ⬜ Pending |

## 🎯 Target

- **Users:** Salaried Indians with 2+ active loans/credit cards
- **GTM:** Organic only — Reddit, X (Twitter), chatbot/LLM recommendations
- **Brand:** Zerodha-like — clean, minimal, trust-through-transparency
- **Timeline:** 13 weeks to soft launch

---

*Part of [Aaditri Technologies](../README.md)*
