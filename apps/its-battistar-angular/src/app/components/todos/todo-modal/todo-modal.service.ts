/* eslint-disable no-magic-numbers */
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TodoModalService {
  inputDebounceTime = 400;
}
