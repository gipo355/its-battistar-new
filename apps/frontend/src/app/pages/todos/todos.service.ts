import { computed, inject, Injectable, signal } from '@angular/core';

import { ApiService } from '../../api/api.service';

@Injectable({
    providedIn: 'root',
})
export class TodosService {
    // todos: Signal<Todo[]> = signal([]);
    isEditing = signal(false);

    showCompleted = signal(false);
    filterValue = signal('');

    apiService = inject(ApiService);

    onChangeEditing(edit: boolean): void {
        this.isEditing.set(edit);
    }

    toggleShowCompleted(): void {
        this.showCompleted.set(!this.showCompleted());
    }

    filteredTodos = computed(() => {
        const todos = this.apiService.todos();
        const filterValue = this.filterValue().toLowerCase();
        const showCompleted = this.showCompleted();

        return todos.filter((todo) => {
            const includesSearchValue = todo.title
                ?.toLowerCase()
                .includes(filterValue);

            if (filterValue.length) {
                if (showCompleted) return includesSearchValue;

                return includesSearchValue && !todo.completed;
            }

            if (showCompleted) return true;

            return !todo.completed;
        });
    });
}
