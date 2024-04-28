/* eslint-disable no-magic-numbers */
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CustomResponse, ITodo } from '@its-battistar/shared-types';
import { lastValueFrom, retry, take, timeout } from 'rxjs';

import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  http = inject(HttpClient);

  async getTodos$(): Promise<CustomResponse<ITodo[]>> {
    console.log('Getting todos');
    const request$ = this.http
      .get<CustomResponse<ITodo[]>>(`${environment.apiUrl}/todos`, {
        withCredentials: true,
      })
      .pipe(timeout(3000), retry(2), take(1));

    return await lastValueFrom<CustomResponse<ITodo[]>>(request$);
  }
}
