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

    onClickReassignInput(): void {
        // BUG: why is this closing the modal? i can see the spinner instead of todos but why is it rerendering the todos?
        // because it was setting isLoading to true
        this.apiService.getUsers();
        this.userListService.openModal();
    }

    onCancelReassign(): void {
        this.isReassigning.set(false);
    }
}
