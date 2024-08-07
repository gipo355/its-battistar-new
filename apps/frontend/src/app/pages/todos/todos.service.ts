import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class TodosService {
    // todos: Signal<Todo[]> = signal([]);
    isEditing = signal(false);

    onChangeEditing(edit: boolean): void {
        this.isEditing.set(edit);
    }
}
