import { computed, inject, Injectable, signal } from '@angular/core';

import { ApiService } from '../../api/api.service';

@Injectable({
    providedIn: 'root',
})
export class TodosService {
    // todos: Signal<Todo[]> = signal([]);
    isEditing = signal(false);
    showCompleted = signal(false);

    apiService = inject(ApiService);

    onChangeEditing(edit: boolean): void {
        this.isEditing.set(edit);
    }

    toggleShowCompleted(): void {
        this.showCompleted.set(!this.showCompleted());
    }

    filteredTodos = computed(() => {
        const todos = this.apiService.todos();
        console.log(
            'recalc filteredTodos with showCompleted',
            this.showCompleted()
        );
        if (this.showCompleted()) {
            return todos;
        }
        return todos.filter((todo) => !todo.completed);
    });
}
