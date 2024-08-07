import type { Routes } from '@angular/router';

import { authGuard } from './api/auth.guard';

export const routes: Routes = [
    {
        path: 'authenticate',
        canActivate: [authGuard],
        loadComponent: async () =>
            import('./pages/authenticate/authenticate.component').then(
                (m) => m.AuthenticateComponent
            ),
    },

    {
        path: '',
        canActivate: [authGuard],
        loadComponent: async () =>
            import('./pages/todos/todos.component').then(
                (m) => m.TodosComponent
            ),
    },

    {
        path: '*',
        redirectTo: '',
    },
];
