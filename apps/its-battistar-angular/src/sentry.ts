import * as Sentry from '@sentry/angular-ivy';

import { environment } from './environments/environment';

// TODO: should move to open source self hosted sentry for both frontend and backend.
// Data should stay in the EU.
// And to conform to GDPR, we should disable the replay feature.
export function initSentry(): void {
  Sentry.init({
    dsn: environment.sentryDsn,
    integrations: [
      // Registers and configures the Tracing integration,
      // which automatically instruments your application to monitor its
      // performance, including custom Angular routing instrumentation
      Sentry.browserTracingIntegration(),
      // Registers the Replay integration,
      // which automatically captures Session Replays
      Sentry.replayIntegration(),
      // Add browser profiling integration to the list of integrations
      // Sentry.browserProfilingIntegration(),
    ],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,

    // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],

    // Capture Replay for 10% of all sessions,
    // plus for 100% of sessions with an error
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}
