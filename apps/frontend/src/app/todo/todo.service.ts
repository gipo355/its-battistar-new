import { inject, Injectable, signal } from '@angular/core';

import { ApiService } from '../api/api.service';

/**
 * NOTE: we don't want to provide this globally.
 * This is not a signleton but a single todo service.
 * Provided it in the todo component only.
 */
@Injectable()
export class TodoService {
    isReassigning = signal(false);
    apiService = inject(ApiService);

    onDelete(id: string | undefined): void {
        if (!id) {
            return;
        }
        this.apiService.deleteTodo(id);
    }

    onComplete(id: string | undefined): void {
        if (!id) {
            return;
        }
        this.apiService.completeTodo(id);
    }

    onUncomplete(id: string | undefined): void {
        if (!id) {
            return;
        }
        this.apiService.uncompleteTodo(id);
    }

    onReassign(): void {
        this.isReassigning.set(true);
    }

    onSendReassign(id: string | undefined, newAssignee: string | null): void {
        if (!id || !newAssignee) {
            return;
        }
        this.apiService.assignTodo(id, newAssignee);
        this.isReassigning.set(false);
    }

    onCancelReassign(): void {
        this.isReassigning.set(false);
    }
}
