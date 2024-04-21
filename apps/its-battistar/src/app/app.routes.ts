import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  { path: '', redirectTo: '/todos', pathMatch: 'full' },
  {
    path: 'todos',
    loadComponent: () =>
      import('@its-battistar/todos').then((m) => m.TodosComponent),
  },
];
