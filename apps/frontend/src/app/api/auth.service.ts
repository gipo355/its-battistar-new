/* eslint-disable no-magic-numbers */
import { HttpClient, type HttpErrorResponse } from '@angular/common/http';
import {
    effect,
    inject,
    Injectable,
    signal,
    type WritableSignal,
} from '@angular/core';
import { StatusCodes } from 'http-status-codes';
import { retry, take } from 'rxjs';

import type { ApiError } from '../../model/api-error';
import type { LoginResponse } from '../../model/login';
import type { User } from '../../model/user';
import { InfoPopupService } from '../info-popup/info-popup.service';
import { AppError } from '../shared/app-error';

const dataIsUser = (data: unknown): data is User => {
    return (
        data !== null &&
        typeof data === 'object' &&
        'firstName' in data &&
        'lastName' in data &&
        'fullName' in data &&
        'picture' in data
    );
};

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
    infoPopupService = inject(InfoPopupService);

    errorHandler = (err: HttpErrorResponse): void => {
        const originalError: ApiError = err.error as ApiError;
        const newError = new AppError({
            message: originalError.message,
            code: originalError.status,
            details: originalError.details,
        });
        const details = newError.details;
        const detailsExists = details && Object.keys(details).length;
        let detailsMessage = '';
        if (detailsExists) {
            for (const key of Object.keys(details)) {
                const innerDetails = details[key] as Record<string, unknown>;

                for (const innerKey of Object.keys(innerDetails)) {
                    detailsMessage += `\n${key}: ${innerKey}: ${innerDetails[innerKey]}`;
                }
            }
        }

        const message = `${newError.code.toString()}: ${newError.message} ${detailsMessage}`;

        this.infoPopupService.showNotification(message, 'error', 5000);
        this.isLoading.set(false);
    };

    loadFromLocalStorage(): void {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');

        if (!token || !user) {
            localStorage.clear();
            return;
        }

        this.token.set(token);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const parsedUser = user ? JSON.parse(user) : null;

        if (dataIsUser(parsedUser)) {
            this.user.set(parsedUser);
        } else {
            localStorage.clear();
            return;
        }

        this.isAuthenticated.set(true);
    }

    syncWithLocalStorage = effect(() => {
        const token = this.token();
        const user = this.user();
        if (token) {
            localStorage.setItem('token', token);
        }

        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        }
    });

    clearLocalStorage(): void {
        localStorage.clear();
    }

    logout(): void {
        this.token.set(null);
        this.user.set(null);
        this.isAuthenticated.set(false);
        this.clearLocalStorage();
        this.infoPopupService.showNotification(
            'Successfully logged out!',
            'success'
        );
    }

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
                    this.infoPopupService.showNotification(
                        'Successfully logged in!',

                        'success'
                    );
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
                next: () => {
                    this.isLoading.set(false);
                    this.infoPopupService.showNotification(
                        'Successfully registered!',
                        'success'
                    );

                    this.login(username, password);
                },
                error: this.errorHandler,
            });
    }
}
