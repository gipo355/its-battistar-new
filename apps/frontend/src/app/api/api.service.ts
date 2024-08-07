import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Signal, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';

import { fakeTodos } from '../../data/todos';
import type { Todo } from '../../model/todo';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    http = inject(HttpClient);
    baseUrl = 'http://localhost:3000/api';
    todos: Signal<Todo[]> = signal(fakeTodos);
    isLoading = signal(false);

    async getTodos(): Promise<Todo[]> {
        return lastValueFrom(
            this.http.get<Todo[]>(`${this.baseUrl}/todos`, {
                headers: {
                    Authorization: 'Bearer sometoken',
                },
                withCredentials: true,
            })
        );
    }

    async createTodo(
        title: string,
        dueDate: Date,
        assignedTo: string
    ): Promise<Todo> {
        return lastValueFrom(
            this.http.post<Todo>(`${this.baseUrl}/todos`, {
                title,
                dueDate: dueDate.toISOString(),
                assignedTo,
            })
        );
    }

    async completeTodo(id: string): Promise<Todo> {
        return lastValueFrom(
            this.http.patch<Todo>(`${this.baseUrl}/todos/${id}/check`, {})
        );
    }

    async uncompleteTodo(id: string): Promise<Todo> {
        return lastValueFrom(
            this.http.patch<Todo>(`${this.baseUrl}/todos/${id}/uncheck`, {})
        );
    }

    async assignTodo(id: string, userId: string): Promise<Todo> {
        return lastValueFrom(
            this.http.post<Todo>(`${this.baseUrl}/todos/${id}/assign`, {
                userId,
            })
        );
    }
}
