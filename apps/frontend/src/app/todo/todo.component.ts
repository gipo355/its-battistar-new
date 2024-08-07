import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    effect,
    inject,
    input,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import type { Todo } from '../../model/todo';
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

    assigneeForm = this.fb.control('');

    todo = input<Todo>();

    selecteUser = effect(() => {
        if (this.userListService.selectedUser()?.id) {
            this.assigneeForm.setValue(
                this.userListService.selectedUser()?.id ?? ''
            );
        }
    });
}
