// Client-side Sentry initialization (Next.js 15+ instrumentation hook).
// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://5087daa36e856f07886398193ab98f2d@o4505459717570560.ingest.us.sentry.io/4507851359780864',

  tracesSampleRate: 1,

  debug: false,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
