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
            import('./app.component').then((m) => m.AppComponent),
    },

    {
        path: '*',
        redirectTo: '',
    },
];
