// https://stackoverflow.com/questions/76256432/angular-router-named-router-outlet
// https://stackoverflow.com/questions/41857876/angular-2-submodule-routing-and-nested-router-outlet
// https://medium.com/@oranaki9910/how-to-create-a-dynamic-layout-using-a-named-router-outlet-in-angular-8f211afe4ea2

import { Route } from '@angular/router';

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
    loadComponent: () =>
      import('./dashboard.component').then((m) => m.DashboardComponent),
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('../../components/overview/overview.component').then(
            (m) => m.OverviewComponent
          ),
        outlet: 'content',
      },
      {
        path: 'todos',
        loadComponent: () =>
          import('../../components/todos/todos.component').then(
            (m) => m.TodosComponent
          ),
        outlet: 'content',
      },
    ],
  },
];
