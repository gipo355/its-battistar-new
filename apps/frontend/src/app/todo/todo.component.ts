import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    inject,
    input,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import type { Todo } from '../../model/todo';
import { ApiService } from '../api/api.service';
import { AuthService } from '../api/auth.service';
import { UserListComponent } from '../user-list/user-list.component';
import { UserListService } from '../user-list/user-list.service';
import { TodoService } from './todo.service';

@Component({
    selector: 'app-todo',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, UserListComponent],
    providers: [TodoService, UserListService],
    templateUrl: './todo.component.html',
    styleUrl: './todo.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoComponent {
    todoService = inject(TodoService);
    fb = inject(FormBuilder);
    userListService = inject(UserListService);
    apiService = inject(ApiService);
    authService = inject(AuthService);

    assigneeForm = this.fb.control('');

    todo = input<Todo>();

    createdBy = computed(() => {
        const myid = this.authService.user()?.id;
        const createdById = this.todo()?.createdBy?._id;

        if (myid === createdById) {
            return 'You';
        }

        return this.todo()?.createdBy?.fullName;
    });

    assignedTo = computed(() => {
        const myid = this.authService.user()?.id;
        const assignedToId = this.todo()?.assignedTo?._id;

        if (myid === assignedToId) {
            return 'You';
        }

        return this.todo()?.assignedTo?.fullName;
    });

    selectUser = effect(() => {
        if (this.userListService.selectedUser()) {
            this.assigneeForm.setValue(
                this.userListService.selectedUser()?.id ?? ''
            );
        }
    });

    onSendReassign(id: string | undefined, newAssignee: string | null): void {
        if (!id || !newAssignee) {
            return;
        }
        this.apiService.assignTodo(id, newAssignee);
        this.todoService.isReassigning.set(false);
        this.userListService.selectedUser.set(null);
    }
}
