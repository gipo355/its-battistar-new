/* eslint-disable no-magic-numbers */
import { HttpClient, type HttpErrorResponse } from '@angular/common/http';
import {
    // effect,
    inject,
    Injectable,
    signal,
    type WritableSignal,
} from '@angular/core';
import { retry, take } from 'rxjs';

import { environment } from '../../environments/environment';
import type { ApiError } from '../../model/api-error';
import type { Todo } from '../../model/todo';
import type { User } from '../../model/user';
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
    baseUrl = environment.baseUrl;
    todos: WritableSignal<Todo[]> = signal([]);
    isLoading = signal(false);
    infoPopupService = inject(InfoPopupService);
    users: WritableSignal<User[]> = signal([]);

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

    getTodos(): void {
        this.isLoading.set(true);
        this.httpClient
            .get<Todo[]>(`${this.baseUrl}/todos?showCompleted=true`)

            .pipe(take(1), retry(1))
            .subscribe({
                next: (todos) => {
                    this.todos.set(todos);
                    this.isLoading.set(false);
                },
                error: this.errorHandler,
            });
    }

    createTodo(title: string, dueDate?: string, assignedTo?: string): void {
        console.log(title, dueDate, assignedTo);
        this.isLoading.set(true);
        this.httpClient
            .post<Todo>(`${this.baseUrl}/todos`, {
                title,
                dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
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
                    this.infoPopupService.showNotification(
                        'Todo completed!',
                        'success'
                    );
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
                    this.infoPopupService.showNotification(
                        'Todo uncompleted!',
                        'success'
                    );
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
                    this.infoPopupService.showNotification(
                        'Todo assigned!',
                        'success'
                    );
                    this.isLoading.set(false);
                },
                error: this.errorHandler,
            });
    }

    deleteTodo(id: string): void {
        this.isLoading.set(true);
        this.httpClient
            .delete<null>(`${this.baseUrl}/todos/${id}`)
            .pipe(take(1), retry(1))
            .subscribe({
                next: () => {
                    // realign local state with remote state
                    this.getTodos();
                    this.isLoading.set(false);
                    this.infoPopupService.showNotification(
                        'Todo deleted!',
                        'success'
                    );
                },
                error: this.errorHandler,
            });
    }

    getUsers(): void {
        this.httpClient
            .get<User[]>(`${this.baseUrl}/users`)
            .pipe(take(1), retry(1))
            .subscribe({
                next: (users) => {
                    this.users.set(users);
                    this.isLoading.set(false);
                },
                error: this.errorHandler,
            });
    }
}
