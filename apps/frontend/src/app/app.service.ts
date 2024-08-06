import { Injectable, type Signal, signal } from '@angular/core';

import { fakeTodos } from '../data/todos';
import type { Todo } from '../model/todo';

@Injectable({
    providedIn: 'root',
})
export class AppService {
    todos: Signal<Todo[]> = signal(fakeTodos);
    // todos: Signal<Todo[]> = signal([]);
    isEditing = signal(false);

    onChangeEditing(edit: boolean): void {
        this.isEditing.set(edit);
    }
}
