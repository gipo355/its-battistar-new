/* eslint-disable no-magic-numbers */
import {
  HttpClient,
  // HttpHeaders
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CustomResponse } from '@its-battistar/shared-types';
import { lastValueFrom, Observable, retry, take, timeout } from 'rxjs';

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

  // hitting this endpoint sets new cookies
  async getRefreshToken(): Promise<CustomResponse<void>> {
    // getRefreshToken(): Observable<CustomResponse<void>> {

    const request$ = this.http
      .post<CustomResponse<void>>(AUTH_API + 'refresh', {}, httpOptions)
      .pipe(timeout(3000), retry(1), take(1));

    console.log('in getRefreshToken');

    return lastValueFrom<CustomResponse<void>>(request$);
    // return request$;
  }

  login(): Observable<CustomResponse<void>> {
    return this.http.get<CustomResponse<void>>('http://localhost:3000/healthz');
  }

  signup(): unknown {
    throw new Error('Method not implemented.');
  }
}
