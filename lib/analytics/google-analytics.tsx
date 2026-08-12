import Script from "next/script";

/*
  Loads GA4 only when NEXT_PUBLIC_GA4_ID is configured - no-op otherwise, never
  a silent fake integration. Analytics is gated behind Google Consent Mode v2:
  storage is DENIED by default (globally, and explicitly for GB/EU regions), so
  no analytics cookies are set until the visitor accepts via the consent banner
  (see components/consent/consent-banner.tsx). This is what keeps GA compliant
  with GDPR/PECR for the UK/EU markets the studio targets (docs/DEEP-AUDIT C-2).
*/
export function GoogleAnalytics({ nonce }: { nonce?: string }) {
  const gaId = process.env.NEXT_PUBLIC_GA4_ID;
  if (!gaId) return null;

  return (
    <>
      <Script id="ga4-consent-default" strategy="afterInteractive" nonce={nonce}>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'denied',
            wait_for_update: 500,
          });
          gtag('consent', 'default', {
            region: ['GB', 'AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE','IS','LI','NO'],
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'denied',
            wait_for_update: 500,
          });
        `}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
        nonce={nonce}
      />
      <Script id="ga4-init" strategy="afterInteractive" nonce={nonce}>
        {`
          gtag('js', new Date());
          gtag('config', '${gaId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
