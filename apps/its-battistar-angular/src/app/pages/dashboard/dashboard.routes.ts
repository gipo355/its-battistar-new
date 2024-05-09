// https://stackoverflow.com/questions/76256432/angular-router-named-router-outlet
// https://stackoverflow.com/questions/41857876/angular-2-submodule-routing-and-nested-router-outlet
// https://medium.com/@oranaki9910/how-to-create-a-dynamic-layout-using-a-named-router-outlet-in-angular-8f211afe4ea2

import type { Route } from '@angular/router';

import { canMatchAuth } from '../../shared/auth/auth-guard.service';

// this is the schema for the routes:
// / => welcome page
//
// should probably put the childs in separate route file with forChild
// /app => dashboard
// /app/feature => feature, lazy loaded, inside the dashboard

export const dashboardRoutes: Route[] = [
  // works with external component, but how would i inject stores and services?
  {
    path: '',
    // canActivateChild: [canActivate],
    // canActivate: [canActivate],
    canMatch: [canMatchAuth],
    loadComponent: async () =>
      import('./dashboard.component').then((m) => m.DashboardComponent),
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        loadComponent: async () =>
          import('../../components/overview/overview.component').then(
            (m) => m.OverviewComponent
          ),
        // FIXME: why named outlet is not working?
        // outlet: 'content',
      },
      {
        path: 'todos',
        loadChildren: async () =>
          import('../../components/todos/todos.routes').then(
            (routes) => routes.todosRoutes
          ),
      },
    ],
  },
];
