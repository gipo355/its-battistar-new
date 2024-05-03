/* eslint-disable no-magic-numbers */
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { CustomResponse, ITodo, Todo } from '@its-battistar/shared-types';
import { lastValueFrom, retry, take, timeout } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  http = inject(HttpClient);

  // TODO: Add error handling for all requests

  async getTodos$({
    showCompleted = true,
  }: {
    showCompleted?: boolean;
  }): Promise<CustomResponse<ITodo[]>> {
    const request$ = this.http
      .get<CustomResponse<ITodo[]>>(`${environment.apiUrl}/api/todos`, {
        withCredentials: true,
        params: {
          showCompleted: showCompleted.toString(),
        },
      })
      .pipe(timeout(3000), retry(1), take(1));

    return lastValueFrom<CustomResponse<ITodo[]>>(request$);
  }

  async updateTodo$(todo: ITodo): Promise<CustomResponse<ITodo>> {
    if (!todo.id) {
      throw new Error('Todo id is required');
    }
    const request$ = this.http
      .patch<CustomResponse<ITodo>>(
        `${environment.apiUrl}/api/todos/${todo.id}`,
        todo,
        {
          withCredentials: true,
        }
      )
      .pipe(timeout(3000), retry(1), take(1));

    return lastValueFrom<CustomResponse<ITodo>>(request$);
  }

  // TODO: move retries to the interceptor
  async createTodo$(todo: Todo): Promise<CustomResponse<ITodo>> {
    const request$ = this.http
      .post<CustomResponse<ITodo>>(`${environment.apiUrl}/api/todos`, todo, {
        withCredentials: true,
      })
      .pipe(timeout(3000), retry(1), take(1));

    return lastValueFrom<CustomResponse<ITodo>>(request$);
  }

  async deleteTodo$(id: string): Promise<CustomResponse<null>> {
    if (!id) {
      throw new Error('Todo id is required');
    }
    const request$ = this.http
      .delete<CustomResponse<null>>(`${environment.apiUrl}/api/todos/${id}`, {
        withCredentials: true,
      })
      .pipe(timeout(3000), retry(1), take(1));

    return lastValueFrom<CustomResponse<null>>(request$);
  }
}
