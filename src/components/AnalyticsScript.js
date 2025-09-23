'use client';

import { useEffect } from 'react';
import analytics from '@/lib/analytics';

export default function AnalyticsScript() {
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    // Start analytics tracking when component mounts
    analytics.startTracking();
    
    // Track page view on route changes (for SPA navigation)
    const handleRouteChange = () => {
      analytics.trackPageView(window.location.pathname);
    };
    
    // Listen for popstate events (back/forward navigation)
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return null; // This component doesn't render anything
}
