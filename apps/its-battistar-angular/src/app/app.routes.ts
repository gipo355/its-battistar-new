import { Route } from '@angular/router';

/**
 * this is the schema for the routes:
 * SEO
 * / => welcome page
 * /about => about page
 * /docs => documentation page (docusaurus)
 *
 *  SPA + AUTH GUARD
 * /login => login page
 *
 * /dashboard => dashboard, lazy loaded (loadsdheader and grid with default content)
 * /dashboard/feature => feature, lazy loaded, inside the dashboard content
 */

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
    pathMatch: 'full',
  },

  // NOTE: lazy loading the dashboard routes and all its components, nested routes
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./pages/dashboard/dashboard.routes').then(
        (routes) => routes.dashboardRoutes
      ),
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },

  {
    path: 'signup',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },

  {
    path: ':error',
    // pass this component to the error data to show with a resolver?
    // ideally the url name should match the error type (page-not-found, server-error, etc)
    pathMatch: 'full',
    loadChildren: () =>
      import('@its-battistar/error-page').then((m) => m.errorPageRoutes),
  },

  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'error',
  },
];
