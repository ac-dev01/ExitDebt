import type { Metadata } from 'next';
import './globals.css';
import CookieConsent from '@/components/CookieConsent';

export const metadata: Metadata = {
  title: 'ExitDebt — Stop Overpaying on Your Loans',
  description:
    'Find out how much you\'re overpaying on your loans. Get a clear plan to reduce your EMIs. Free check, 30 seconds.',
  keywords: ['debt restructuring', 'debt health score', 'loan consolidation', 'CIBIL', 'debt advisory', 'financial health'],
  openGraph: {
    title: 'ExitDebt — Stop Overpaying on Your Loans',
    description: 'See how much you\'re losing on your loans every year. Free check in 30 seconds.',
    url: 'https://exitdebt.in',
    siteName: 'ExitDebt',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ExitDebt — Stop Overpaying on Your Loans',
    description: 'See how much you\'re losing on your loans. Free check, 30 seconds.',
  },
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <meta name="theme-color" content="#FCFCFC" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FinancialService',
              name: 'ExitDebt',
              description: 'Find out how much you\'re overpaying on your loans. Free check, 30 seconds.',
              url: 'https://exitdebt.in',
              areaServed: 'IN',
              serviceType: 'Debt Advisory',
            }),
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys onSessionId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
              // posthog.init('YOUR_POSTHOG_KEY', {api_host: 'https://app.posthog.com'})
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-bg">
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
