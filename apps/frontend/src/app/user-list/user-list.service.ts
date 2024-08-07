import { Injectable, signal,WritableSignal } from "@angular/core";

import { User } from "../../model/user";


@Injectable(
    {
        providedIn: 'root'
    }
)
export class UserListService {
    isModalOpen = signal(false)
    selectedUser: WritableSignal<User | null> = signal(null)

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
