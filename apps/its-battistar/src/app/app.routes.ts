import { Route } from '@angular/router';

// this is the schema for the routes:
// / => welcome page
//
// should probably put the childs in separate route file with forChild
// /app => dashboard
// /app/feature => feature, lazy loaded, inside the dashboard

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
    pathMatch: 'full',
  },

  // works with external component, but how would i inject stores and services?
  // {
  //   path: 'todos',
  //   loadComponent: () =>
  //     import('@its-battistar/todos').then((m) => m.TodosComponent),
  // },

  {
    path: '/app',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },

  // IN app component
  {
    path: '/app/todos',
    loadComponent: () =>
      import('./pages/todos/todos.component').then((m) => m.TodosComponent),
  },
];
