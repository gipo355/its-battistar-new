import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  // {
  //   path: '',
  //   redirectTo: '/todos',
  //   pathMatch: 'full'
  // },
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

  // IN app component
  {
    path: 'todos',
    loadComponent: () =>
      import('./pages/todos/todos.component').then((m) => m.TodosComponent),
  },
];
