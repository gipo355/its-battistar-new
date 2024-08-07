import type { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'authenticate',
        loadComponent: async () =>
            import('./pages/authenticate/authenticate.component').then(
                (m) => m.AuthenticateComponent
            ),
    },

    {
        path: '',
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
