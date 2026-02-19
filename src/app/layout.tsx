import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "./providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ExitDebt – Check Your Debt Health in 30 Seconds",
  description:
    "See exactly how much interest you're overpaying and get a personalized plan to become debt-free faster. Trusted by 10,000+ Indians.",
  keywords: ["debt", "credit card", "personal loan", "debt restructuring", "CIBIL", "India", "financial health"],
  openGraph: {
    title: "ExitDebt – Check Your Debt Health in 30 Seconds",
    description:
      "See how much you're overpaying in interest. Get a personalized debt-free plan.",
    type: "website",
    locale: "en_IN",
    siteName: "ExitDebt",
  },
  twitter: {
    card: "summary_large_image",
    title: "ExitDebt – Check Your Debt Health",
    description: "See how much you're overpaying in interest.",
  },
};

// FAQ structured data for SEO
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is this really free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The debt health check is completely free. We earn a referral fee from lenders when you choose to restructure your debt through our partners.",
      },
    },
    {
      "@type": "Question",
      name: "How do you make money?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We earn from lenders, not from you. When we help you consolidate or restructure your debt at a lower rate, the lending partner pays us a referral fee.",
      },
    },
    {
      "@type": "Question",
      name: "Is my PAN data safe?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. We use bank-grade 256-bit encryption. Your PAN is used solely to fetch your credit report and is never stored on our servers.",
      },
    },
    {
      "@type": "Question",
      name: "Will this affect my CIBIL score?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. We perform a soft pull of your credit report, which does not impact your CIBIL score in any way.",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </head>
      <body className="font-sans antialiased text-gray-900 bg-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
