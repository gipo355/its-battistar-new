/* eslint-disable no-magic-numbers */
import {
  HttpClient,
  // HttpHeaders
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CustomResponse } from '@its-battistar/shared-types';
import { lastValueFrom, Observable, retry, take, tap, timeout } from 'rxjs';

import { UserStore } from '../user/user.store';

const AUTH_API = 'http://localhost:3000/auth/';

const httpOptions = {
  // headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  withCredentials: true,
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private userStore = inject(UserStore);

  logout(): Observable<CustomResponse<void>> {
    const request$ = this.http
      .post<CustomResponse<void>>(AUTH_API + 'logout', {}, httpOptions)
      .pipe(
        timeout(3000),
        retry(1),
        take(1),
        tap(() => {
          this.userStore.logout();
        })
      );

    return request$;
  }

  // hitting this endpoint sets new cookies
  async getRefreshToken(): Promise<CustomResponse<void>> {
    const request$ = this.http
      .post<CustomResponse<void>>(AUTH_API + 'refresh', {}, httpOptions)
      .pipe(timeout(2000));

    return lastValueFrom<CustomResponse<void>>(request$);
  }

  // LOCAL STRATS
  login(username: string, password: string): Observable<CustomResponse<void>> {
    // post username and password to server
    // if ok, redirect to /dashboard
    const request$ = this.http
      .post<CustomResponse<void>>(
        AUTH_API + 'login',
        {
          username,
          password,
        },
        httpOptions
      )
      .pipe(
        timeout(3000),
        retry(1),
        take(1),
        tap(() => {
          this.userStore.login();
        })
      );

    return request$;
  }

  signup({
    username,
    password,
    passwordConfirm,
  }: {
    password: string;
    passwordConfirm: string;
    username: string;
  }): unknown {
    if (password !== passwordConfirm) {
      return { error: 'Passwords do not match' };
    }
    // post username and password to server
    // if ok, redirect to /dashboard
    const request$ = this.http
      .post<CustomResponse<void>>(
        AUTH_API + 'signup',
        {
          username,
          password,
        },
        httpOptions
      )
      .pipe(
        timeout(3000),
        retry(1),
        take(1),
        tap(() => {
          this.userStore.login();
        })
      );

    return request$;
  }
}
