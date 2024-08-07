/* eslint-disable no-magic-numbers */
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
    effect,
    inject,
    Injectable,
    signal,
    type WritableSignal,
} from '@angular/core';
import { StatusCodes } from 'http-status-codes';
import { retry, take } from 'rxjs';

import { ApiError } from '../../model/api-error';
import type { LoginResponse } from '../../model/login';
import type { User } from '../../model/user';
import { InfoPopupService } from '../info-popup/info-popup.service';
import { AppError } from '../shared/app-error';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    httpClient = inject(HttpClient);
    baseUrl = 'http://localhost:3000/api';
    user: WritableSignal<User | null> = signal(null);
    token: WritableSignal<string | null> = signal(null);
    isAuthenticated = signal(false);
    isLoading = signal(false);
    error: WritableSignal<AppError | null> = signal(null);
    infoPopupService = inject(InfoPopupService);

    displayError = effect(
        () => {
            const error = this.error();
            if (error) {
                this.infoPopupService.showNotification(
                    error.message,

                    5000,
                    'error'
                );
            }
        },
        {
            allowSignalWrites: true,
        }
    );

    errorHandler = (err: HttpErrorResponse): void => {
        const originalError: ApiError = err.error as ApiError;
        const newError = new AppError({
            message: `${originalError.status.toString()}: ${originalError.message}`,
            code: originalError.status,
        });
        this.error.set(newError);
        this.isLoading.set(false);
    };

    login(username: string, password: string): void {
        this.isLoading.set(true);
        this.httpClient
            .post<LoginResponse>(`${this.baseUrl}/login`, {
                username,
                password,
            })
            .pipe(take(1), retry(1))
            .subscribe({
                next: (login) => {
                    if (!login.user || !login.token) {
                        throw new AppError({
                            message: 'Invalid login response',
                            code: StatusCodes.INTERNAL_SERVER_ERROR,
                        });
                    }

                    this.user.set(login.user);
                    this.token.set(login.token);
                    this.isAuthenticated.set(true);
                    this.isLoading.set(false);
                },
                error: this.errorHandler,
            });
    }

    register({
        firstName,
        lastName,
        picture,
        username,
        password,
    }: {
        firstName: string;
        lastName: string;
        password: string;
        picture: string;
        username: string;
    }): void {
        this.isLoading.set(true);
        this.httpClient
            .post<User>(`${this.baseUrl}/register`, {
                username,
                password,
                firstName,
                lastName,
                picture,
            })
            .pipe(take(1), retry(1))
            .subscribe({
                next: (user) => {
                    this.user.set(user);
                    this.isAuthenticated.set(true);
                    this.isLoading.set(false);
                },
                error: this.errorHandler,
            });
    }
}
