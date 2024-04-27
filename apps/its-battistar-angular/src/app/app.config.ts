import { provideHttpClient } from '@angular/common/http';
import {
  APP_INITIALIZER,
  ApplicationConfig,
  ErrorHandler,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, Router, withHashLocation } from '@angular/router';
import * as Sentry from '@sentry/angular-ivy';

import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withHashLocation()),
    provideAnimations(),

    // Registers and configures the Sentry integration, error monitoring
    {
      provide: ErrorHandler,
      useValue: Sentry.createErrorHandler({
        showDialog: true,
      }),
    },
    // Registers and configures the Tracing integration, performance monitoring
    { provide: Sentry.TraceService, deps: [Router] },
    {
      provide: APP_INITIALIZER,
      // eslint-disable-next-line unicorn/consistent-function-scoping, @typescript-eslint/no-empty-function
      useFactory: () => () => {},
      deps: [Sentry.TraceService],
      multi: true,
    },

    // NOTE: we need to inejct the providers for services with providedIn: 'root'
    // because they get provided over here
    provideHttpClient(),
  ],
};
