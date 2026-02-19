/**
 * PostHog analytics wrapper.
 * Initialize PostHog on the client side and track key events.
 */

type EventProperties = Record<string, string | number | boolean | null>;

// PostHog will be loaded via script tag in layout.tsx
declare global {
    interface Window {
        posthog?: {
            capture: (event: string, properties?: EventProperties) => void;
            identify: (distinctId: string, properties?: EventProperties) => void;
        };
    }
}

export function trackEvent(event: string, properties?: EventProperties): void {
    if (typeof window !== 'undefined' && window.posthog) {
        window.posthog.capture(event, properties);
    }
}

// Pre-defined event trackers
export const analytics = {
    landingCTAClick: () => trackEvent('landing_cta_click'),
    otpSent: (phone: string) => trackEvent('otp_sent', { phone_masked: phone.slice(-4) }),
    otpSuccess: () => trackEvent('otp_success'),
    otpFailed: () => trackEvent('otp_failed'),
    healthCheckStarted: () => trackEvent('health_check_started'),
    healthCheckSuccess: (score: number) => trackEvent('health_check_success', { score }),
    healthCheckFailed: (error: string) => trackEvent('health_check_failed', { error }),
    callbackSubmitted: () => trackEvent('callback_submitted'),
    advisoryPurchase: (tier: string, price: number) => trackEvent('advisory_purchase', { tier, price }),
    pdfDownloaded: () => trackEvent('pdf_downloaded'),
    whatsappShared: () => trackEvent('whatsapp_shared'),
};
