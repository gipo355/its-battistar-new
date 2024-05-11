/* eslint-disable @typescript-eslint/no-explicit-any */
// https://www.bezkoder.com/angular-12-refresh-token/
// https://medium.com/@bhargavr445/angular-httpinterceptors-standalone-applications-part-5-dd855f052d45
//
import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpStatusCode,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
// import { Router } from '@angular/router';
import { CustomResponse } from '@its-battistar/shared-types';
import { from, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { UserStore } from '../user/user.store';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);

  private userStore = inject(UserStore);

  private isRefreshing = false;

  // NOTE: does the retry on the auth service trigger before the interceptor catchError?
  intercept(req: HttpRequest<CustomResponse<void>>, next: HttpHandler): any {
    const authReq = req;

    return next.handle(authReq).pipe(
      catchError((error) => {
        if (
          error instanceof HttpErrorResponse &&
          // BUG: potential bugs here, will check all requests and redirect to refresh
          !authReq.url.includes('auth') &&
          !authReq.url.includes('login') &&
          !authReq.url.includes('signup') &&
          error.status === HttpStatusCode.Unauthorized.valueOf()
        ) {
          this.isRefreshing = true;

          // await this.handle401Error(authReq, next);
          // redirect to refresh token endpoint
          // const cloned = authReq.clone({
          //   // TODO: change to environment variable
          //   url: 'http://localhost:3000/auth/refresh',
          //   method: 'POST',
          //   params: new HttpParams().set(
          //     'redirectTo',
          //     authReq.url.split('/').pop() ?? ''
          //   ),
          // });
          // MUST NOT RETURN HERE, OTHERWISE THE REQUEST WILL BE SENT TWICE before
          // the refresh token is received
          // MUST REPEAT THE REQUEST AFTER REFRESHING THE TOKEN
          // return next.handle(cloned);

          // must clone req
          const cloned = authReq.clone();

          return this.handle401Error().pipe(
            switchMap(() => {
              this.isRefreshing = false;
              return next.handle(cloned);
            })
          );
        }

        console.log('error in interceptor', error);
        this.userStore.logout();
        this.isRefreshing = false;
        return throwError(() =>
          error instanceof HttpErrorResponse
            ? error
            : new Error('Unknown error')
        );
      })
    );
  }

  private handle401Error() {
    // next: HttpHandler // request: HttpRequest<CustomResponse<void>>,
    // if (!this.isRefreshing) {
    //   this.isRefreshing = true;

    // this.authService.getRefreshToken().subscribe({
    //   next: () => {
    //     return next.handle(request);
    //   },
    //   error: () => {
    //     void this.router.navigate(['/login']);
    //   },
    // });

    // await this.authService.getRefreshToken();

    // this.isRefreshing = false;

    // return of(next.handle(request));
    return from(this.authService.getRefreshToken());
  }
}

// flow
// catch the 401 error, switchMap to refresh token http
// interceptor for requests to refesh, if success, return to the original request

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
];
