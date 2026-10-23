import Script from 'next/script';
import { CONSENT_KEY } from '@/lib/consent';

// Third-party trackers for the public site only — the admin layout never renders
// this, so admin sessions are not tracked. IDs come from Admin → Settings and are
// validated against strict patterns before reaching this component.
//
// Both tags start with cookies off and read the visitor's stored choice from the
// cookie banner; a choice made later is pushed to them by src/lib/consent.js.
const readConsent = `var consent = null;
            try { consent = localStorage.getItem(${JSON.stringify(CONSENT_KEY)}); } catch (e) {}
            var analyticsState = consent === 'granted' ? 'granted' : 'denied';`;

export function TrackingScripts({ gaId, clarityId }) {
  // Skip in development so local testing doesn't pollute the dashboards.
  if (process.env.NODE_ENV !== 'production') return null;

  return (
    <>
      {gaId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="google-analytics" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            (function(){
              ${readConsent}
              // Google Consent Mode v2: no ad storage ever; analytics only with consent.
              gtag('consent', 'default', {
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                analytics_storage: analyticsState
              });
            })();
            gtag('js', new Date());
            gtag('config', ${JSON.stringify(gaId)});`}
          </Script>
        </>
      )}
      {clarityId && (
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", ${JSON.stringify(clarityId)});
          (function(){
            ${readConsent}
            window.clarity('consentv2', { ad_Storage: 'denied', analytics_Storage: analyticsState });
          })();`}
        </Script>
      )}
    </>
  );
}
