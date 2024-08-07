import { inject, Injectable, signal } from '@angular/core';

import { ApiService } from '../api/api.service';
import { UserListService } from '../user-list/user-list.service';

/**
 * NOTE: we don't want to provide this globally.
 * This is not a signleton but a single todo service.
 * Provided it in the todo component only.
 */
@Injectable()
export class TodoService {
    isReassigning = signal(false);
    apiService = inject(ApiService);
    userListService = inject(UserListService);

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
        this.userListService.selectedUser.set(null);

    }

    onCancelReassign(): void {
        this.isReassigning.set(false);
    }
}
