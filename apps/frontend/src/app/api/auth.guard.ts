// import { inject } from '@angular/core';
// import type { CanActivateFn } from '@angular/router';
// import { Router } from '@angular/router';
//
// import { AuthService } from './auth.service';
//
// export const authGuard: CanActivateFn = (route, state) => {
//     const authService = inject(AuthService);
//     const router = inject(Router);
//
//     const isAuthenticated = authService.isAuthenticated();
//     if (!isAuthenticated) {
//         router.navigate(['/authenticate']);
//         return false;
//     }
//     return isAuthenticated;
// };
import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const isAuthenticated = authService.isAuthenticated();

    if (!isAuthenticated && state.url !== '/authenticate') {
        router.navigate(['/authenticate']);
        return false;
    }

    if (isAuthenticated && state.url === '/authenticate') {
        router.navigate(['/']);
        return false;
    }

    return true;
};
