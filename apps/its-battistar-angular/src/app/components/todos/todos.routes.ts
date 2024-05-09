// https://stackoverflow.com/questions/76256432/angular-router-named-router-outlet
// https://stackoverflow.com/questions/41857876/angular-2-submodule-routing-and-nested-router-outlet
// https://medium.com/@oranaki9910/how-to-create-a-dynamic-layout-using-a-named-router-outlet-in-angular-8f211afe4ea2

import type { Route } from '@angular/router';

import { todoModalResolverServiceFN } from './todo-modal/todo-modal-resolver.service';

// this is the schema for the routes:
// / => welcome page
//
// should probably put the childs in separate route file with forChild
// /app => dashboard
// /app/feature => feature, lazy loaded, inside the dashboard

export const todosRoutes: Route[] = [
  // works with external component, but how would i inject stores and services?
  {
    path: '',
    // canActivate: [canActivate],
    loadComponent: async () =>
      import('./todos.component').then((m) => m.TodosComponent),
    // FIXME: why named outlet is not working?
    // outlet: 'content',

    children: [
      {
        path: 'new',
        loadComponent: async () =>
          import('./todo-modal/todo-modal.component').then(
            (m) => m.TodoModalComponent
          ),
      },
      {
        path: ':id',
        loadComponent: async () =>
          import('./todo-modal/todo-modal.component').then(
            (m) => m.TodoModalComponent
          ),
        // use the param to update the selected todo
        resolve: {
          todo: todoModalResolverServiceFN,
        },
      },
    ],
  },
];
