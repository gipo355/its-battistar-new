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
  },
  {
    path: 'todos',
    loadChildren: () =>
      import('../../components/todos/todos.component').then(
        (m) => m.TodosComponent
      ),
  },
];
