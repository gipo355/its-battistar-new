/* eslint-disable @typescript-eslint/no-explicit-any */
// https://www.bezkoder.com/angular-12-refresh-token/
// https://medium.com/@bhargavr445/angular-httpinterceptors-standalone-applications-part-5-dd855f052d45
//
import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpStatusCode,
} from '@angular/common/http';
import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CustomResponse } from '@its-battistar/shared-types';
import { lastValueFrom, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);

  private isRefreshing = false;

  intercept(req: HttpRequest<CustomResponse<void>>, next: HttpHandler): any {
    const authReq = req;

    console.log('intercepted request', authReq.url);

    return next.handle(authReq).pipe(
      catchError(async (error) => {
        console.log('caught http error', error);
        if (
          error instanceof HttpErrorResponse &&
          // BUG: potential bugs here, will check all requests and redirect to refresh
          !authReq.url.includes('auth') &&
          !authReq.url.includes('login') &&
          !authReq.url.includes('signup') &&
          error.status === HttpStatusCode.Unauthorized.valueOf()
        ) {
          console.log('refreshing token');
          await this.handle401Error(authReq, next);
          // MUST NOT RETURN HERE, OTHERWISE THE REQUEST WILL BE SENT TWICE before
          // the refresh token is received
          // MUST REPEAT THE REQUEST AFTER REFRESHING THE TOKEN
          return next.handle(authReq);
        }

        // return throwError(() => error);
        return of('error', error);
      })
    );
  }

  private async handle401Error(
    request: HttpRequest<CustomResponse<void>>,
    next: HttpHandler
  ) {
    // if (!this.isRefreshing) {
    //   this.isRefreshing = true;
    console.log('in handle401Error');

    // this.authService.getRefreshToken().subscribe({
    //   next: () => {
    //     return next.handle(request);
    //   },
    //   error: () => {
    //     void this.router.navigate(['/login']);
    //   },
    // });

    await this.authService.getRefreshToken();

    this.isRefreshing = false;

    return lastValueFrom(next.handle(request));
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
];
