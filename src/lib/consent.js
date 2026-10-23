// Analytics cookie consent, shared by the banner, the footer link and our own
// analytics. The choice itself is stored as 'granted' or 'denied'.
// Not a client module: tracking-scripts.js (server) imports CONSENT_KEY; the
// functions only touch the browser when called.

export const CONSENT_KEY = 'cookie_consent';
const OPEN_EVENT = 'consent:open';

export function getConsent() {
  try {
    const value = localStorage.getItem(CONSENT_KEY);
    return value === 'granted' || value === 'denied' ? value : null;
  } catch {
    return null; // Storage blocked: treat as "not decided yet".
  }
}

export function setConsent(value) {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // The choice still applies to this page view.
  }
  applyConsent(value);
}

// Tell the third-party tags about a choice made on this page. On later page
// loads the snippets in tracking-scripts.js read the stored value themselves.
function applyConsent(value) {
  const state = value === 'granted' ? 'granted' : 'denied';
  window.gtag?.('consent', 'update', { analytics_storage: state });
  window.clarity?.('consentv2', { ad_Storage: 'denied', analytics_Storage: state });
}

export function openConsentSettings() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function onConsentSettingsOpen(handler) {
  window.addEventListener(OPEN_EVENT, handler);
  return () => window.removeEventListener(OPEN_EVENT, handler);
}
