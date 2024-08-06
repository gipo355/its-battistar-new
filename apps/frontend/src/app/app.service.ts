import { Injectable, type Signal, signal } from '@angular/core';

import { fakeTodos } from '../data/todos';
import type { Todo } from '../model/todo';

@Injectable({
    providedIn: 'root',
})
export class AppService {
    todos: Signal<Todo[]> = signal(fakeTodos);
    isEditing = signal(true);
}
