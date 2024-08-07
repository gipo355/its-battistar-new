/* eslint-disable no-magic-numbers */
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
    computed,
    effect,
    inject,
    Injectable,
    signal,
    WritableSignal,
} from '@angular/core';
import { StatusCodes } from 'http-status-codes';
import { retry, take } from 'rxjs';

import { ApiError } from '../../model/api-error';
import type { Todo } from '../../model/todo';
import { InfoPopupService } from '../info-popup/info-popup.service';
import { AppError } from '../shared/app-error';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    /**
     * Interceptor is used to add the authorization header to the request
     */

    httpClient = inject(HttpClient);
    baseUrl = 'http://localhost:3000/api';
    todos: WritableSignal<Todo[]> = signal([]);
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

    getTodos(): void {
        this.isLoading.set(true);
        this.httpClient
            .get<Todo[]>(`${this.baseUrl}/todos`)

            .pipe(take(1), retry(1))
            .subscribe({
                next: (todos) => {
                    this.todos.set(todos);
                    this.isLoading.set(false);
                },
                error: this.errorHandler,
            });
    }

    createTodo(title: string, dueDate: Date, assignedTo: string): void {
        this.isLoading.set(true);
        this.httpClient
            .post<Todo>(`${this.baseUrl}/todos`, {
                title,
                dueDate: dueDate.toISOString(),
                assignedTo,
            })
            .pipe(take(1), retry(1))
            .subscribe({
                next: () => {
                    // realign local state with remote state
                    this.getTodos();
                    this.isLoading.set(false);
                },
                error: this.errorHandler,
            });
    }

    completeTodo(id: string): void {
        this.isLoading.set(true);
        this.httpClient
            .patch<Todo>(`${this.baseUrl}/todos/${id}/check`, {})
            .pipe(take(1), retry(1))
            .subscribe({
                next: () => {
                    // realign local state with remote state
                    this.getTodos();
                    this.isLoading.set(false);
                },
                error: this.errorHandler,
            });
    }

    uncompleteTodo(id: string): void {
        this.isLoading.set(true);
        this.httpClient
            .patch<Todo>(`${this.baseUrl}/todos/${id}/uncheck`, {})
            .pipe(take(1), retry(1))
            .subscribe({
                next: () => {
                    // realign local state with remote state
                    this.getTodos();
                    this.isLoading.set(false);
                },
                error: this.errorHandler,
            });
    }

    assignTodo(id: string, userId: string): void {
        this.isLoading.set(true);
        this.httpClient
            .post<Todo>(`${this.baseUrl}/todos/${id}/assign`, {
                userId,
            })
            .pipe(take(1), retry(1))
            .subscribe({
                next: () => {
                    // realign local state with remote state
                    this.getTodos();
                    this.isLoading.set(false);
                },
                error: this.errorHandler,
            });
    }
}
