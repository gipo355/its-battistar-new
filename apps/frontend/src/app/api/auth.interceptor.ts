import type { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const url = req.url;
    if (url.includes('/todos') || url.includes('/users')) {
        const authReq = req.clone({
            setHeaders: {
                Authorization: 'Bearer sometoken',
            },
        });
        return next(authReq);
    }
    return next(req);
};
