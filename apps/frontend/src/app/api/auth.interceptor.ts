import type { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);

    const url = req.url;
    if (url.includes('/todos') || url.includes('/users')) {
        console.log('intercepted', authService.token());
        const authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${authService.token() ?? ''}`,
            },
        });
        return next(authReq);
    }
    return next(req);
};
