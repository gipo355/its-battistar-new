/* eslint-disable no-magic-numbers */
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CustomResponse, ITodo } from '@its-battistar/shared-types';
import { lastValueFrom, retry, take, timeout } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  http = inject(HttpClient);

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
      .pipe(timeout(3000), retry(2), take(1));

    return await lastValueFrom<CustomResponse<ITodo[]>>(request$);
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
      .pipe(timeout(3000), retry(2), take(1));

    return await lastValueFrom<CustomResponse<ITodo>>(request$);
  }

  async deleteTodo$(id: string): Promise<CustomResponse<null>> {
    if (!id) {
      throw new Error('Todo id is required');
    }
    const request$ = this.http
      .delete<CustomResponse<null>>(`${environment.apiUrl}/api/todos/${id}`, {
        withCredentials: true,
      })
      .pipe(timeout(3000), retry(2), take(1));

    return await lastValueFrom<CustomResponse<null>>(request$);
  }
}
