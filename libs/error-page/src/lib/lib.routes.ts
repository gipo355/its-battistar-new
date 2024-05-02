import type { Route } from '@angular/router';

import { ErrorPageComponent } from './error-page/error-page.component';

export const errorPageRoutes: Route[] = [
  {
    path: '',
    component: ErrorPageComponent,
    // resolve: { }
  },
];
