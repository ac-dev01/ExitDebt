# ExitDebt Frontend

A minimalist, high-trust web platform that helps salaried Indians understand and restructure their debt. Built with Next.js, TypeScript, and Tailwind CSS.

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

## Features

- **Instant Debt Health Check** – Enter PAN + phone to get a mock credit report
- **Animated Score Gauge** – SVG circular gauge with color-coded severity
- **Debt Account Analysis** – Table with high-rate flags (⚠️ for APR > 18%)
- **Overpayment Calculator** – Shows yearly savings potential
- **Callback Booking** – Time slot selector with WhatsApp confirmation simulation
- **Blog Section** – Mock financial articles
- **FAQ Accordion** – Trust-building Q&A
- **SEO Optimized** – Meta tags, OG tags, FAQ structured data schema
- **Fully Responsive** – Mobile-first design
- **Accessible** – Semantic HTML, ARIA labels, focus management

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Font | Inter (via next/font) |
| State | React hooks (useState, useRef) |
| Data | Mock profiles (no API calls) |

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout, fonts, SEO metadata
│   ├── page.tsx            # Main single-page app
│   └── globals.css         # Tailwind + custom animations
├── components/
│   ├── Hero.tsx            # Value prop + trust signals
│   ├── Form.tsx            # PAN/phone validation + submit
│   ├── LoadingSpinner.tsx  # "Pulling credit report..." state
│   ├── ScoreGauge.tsx      # Animated SVG score circle
│   ├── Results.tsx         # Dashboard assembly
│   ├── AccountList.tsx     # Debt accounts table
│   ├── CallbackBooking.tsx # Time slot picker + confirmation
│   ├── HowItWorks.tsx      # 3-step process
│   ├── BlogSection.tsx     # Mock article cards
│   ├── FAQ.tsx             # Accordion
│   └── Footer.tsx          # Company info + links
└── lib/
    ├── mockProfiles.ts     # 4 predefined debt profiles
    └── utils.ts            # Validation, formatting, profile selection
```

## Mock Data

The app includes 4 predefined profiles. Enter PAN `ABCDE1234F` to load Saurabh's critical debt profile, or any other PAN to get a deterministic profile assignment.
