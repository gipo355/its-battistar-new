import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { StatusCodes } from 'http-status-codes';
import { retry, take } from 'rxjs';

import type { Todo } from '../../model/todo';
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
                error: (err) => {
                    console.log(err);

                    const newError = new AppError({
                        message: 'Error getting todos',
                        code: StatusCodes.INTERNAL_SERVER_ERROR,
                        details: {
                            error: err.message,
                        },
                        unknownError: true,
                        cause: err,
                    });

                    this.error.set(newError);

                    this.isLoading.set(false);
                },
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
                error: (err) => {
                    console.log(err);
                    const newError = new AppError({
                        message: 'Error creating todo',
                        code: StatusCodes.INTERNAL_SERVER_ERROR,
                        details: {
                            error: err.message,
                        },
                        unknownError: true,
                        cause: err,
                    });
                    this.error.set(newError);
                    this.isLoading.set(false);
                },
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
                error: (err) => {
                    console.log(err);
                    const newError = new AppError({
                        message: 'Error completing todo',
                        code: StatusCodes.INTERNAL_SERVER_ERROR,
                        details: {
                            error: err.message,
                        },
                        unknownError: true,
                        cause: err,
                    });
                    this.error.set(newError);
                    this.isLoading.set(false);
                },
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
                error: (err) => {
                    console.log(err);
                    const newError = new AppError({
                        message: 'Error uncompleting todo',
                        code: StatusCodes.INTERNAL_SERVER_ERROR,
                        details: {
                            error: err.message,
                        },
                        unknownError: true,
                        cause: err,
                    });
                    this.error.set(newError);
                    this.isLoading.set(false);
                },
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
                error: (err) => {
                    console.log(err);
                    const newError = new AppError({
                        message: 'Error assigning todo',
                        code: StatusCodes.INTERNAL_SERVER_ERROR,
                        details: {
                            error: err.message,
                        },
                        unknownError: true,
                        cause: err,
                    });
                    this.error.set(newError);
                    this.isLoading.set(false);
                },
            });
    }
}
