import { Injectable, signal, WritableSignal } from '@angular/core';

import { User } from '../../model/user';

/**
 * Service for managing the user list modal.
 * This is not a singleton, because it is used in multiple places.
 * Every time it should have a new state
 */
@Injectable()
export class UserListService {
    isModalOpen = signal(false);
    selectedUser: WritableSignal<User | null> = signal(null);

    closeModal(): void {
        this.isModalOpen.set(false);
    }

    openModal(): void {
        this.isModalOpen.set(true);
    }

    selectUser(user: User): void {
        this.selectedUser.set(user);
        this.closeModal();
    }
}
