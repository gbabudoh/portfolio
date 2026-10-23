'use client';

import { useEffect, useState } from 'react';
import { Cookie } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getConsent, onConsentSettingsOpen, openConsentSettings, setConsent } from '@/lib/consent';

// Shown until the visitor chooses, and again from the footer's "Cookie settings".
// Accept and Reject carry equal weight, as UK/EU guidance expects.
export function CookieBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Decided after mount so the statically cached HTML never includes the banner.
    if (!getConsent()) setOpen(true);
    return onConsentSettingsOpen(() => setOpen(true));
  }, []);

  if (!open) return null;

  function choose(value) {
    setConsent(value);
    setOpen(false);
  }

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="animate-fade-in fixed inset-x-4 bottom-4 z-50 rounded-lg border border-border bg-background p-4 shadow-lg sm:inset-x-auto sm:bottom-6 sm:right-6 sm:max-w-sm"
    >
      <div className="flex gap-3">
        <Cookie className="mt-0.5 size-5 shrink-0 text-muted" aria-hidden="true" />
        <div>
          <p className="text-sm font-semibold text-foreground">Cookies</p>
          <p className="mt-1 text-sm text-muted">
            I use analytics cookies (Google Analytics and Microsoft Clarity) to understand how visitors use this site.
            No ads, and your data is protected.
          </p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button variant="secondary" size="sm" onClick={() => choose('denied')}>
          Reject
        </Button>
        <Button size="sm" onClick={() => choose('granted')} className="bg-foreground text-background hover:bg-foreground/85">
          Accept
        </Button>
      </div>
    </div>
  );
}

export function CookieSettingsButton({ className }) {
  return (
    <button
      type="button"
      onClick={openConsentSettings}
      className={className}
    >
      Cookie settings
    </button>
  );
}
