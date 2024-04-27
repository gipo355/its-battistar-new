/* eslint-disable no-magic-numbers */
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TodoModalService {
  // this must be low, it only updates 1 single item.
  // the syncing happens on exit
  inputDebounceTime = 100;
}
