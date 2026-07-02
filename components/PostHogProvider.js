"use client";

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// Tracker component wrapped in Suspense to prevent Next.js static generation bailout
function PostHogPageviewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('posthog-js').then(({ default: posthog }) => {
        try {
          if (posthog.__loaded) { // Ensure posthog is initialized
            posthog.capture('$pageview', {
              $current_url: window.location.href,
            });
          }
        } catch (e) {
          // Silent fallback if posthog is blocked by adblockers
        }
      });
    }
  }, [pathname, searchParams]);

  return null;
}

export default function PostHogProvider({ children }) {
  useEffect(() => {
    // Dynamic import to keep PostHog out of the initial critical JS bundle
    import('posthog-js').then(({ default: posthog }) => {
      const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
      const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';

      if (apiKey && typeof window !== 'undefined') {
        posthog.init(apiKey, {
          api_host: apiHost,
          person_profiles: 'identified_only',
          capture_pageview: false, // Captured manually in tracker component
          persistence: 'localStorage',
          loaded: (ph) => {
            if (process.env.NODE_ENV === 'development') ph.opt_out_capturing(); // Opt out in dev
          }
        });
      }
    });
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <PostHogPageviewTracker />
      </Suspense>
      {children}
    </>
  );
}
