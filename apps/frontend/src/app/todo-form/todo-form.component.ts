/* eslint-disable no-magic-numbers */
import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    effect,
    inject,
} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';

import { ApiService } from '../api/api.service';
import { AuthService } from '../api/auth.service';
import { InfoPopupService } from '../info-popup/info-popup.service';
import { TodosService } from '../pages/todos/todos.service';
import { UserListComponent } from '../user-list/user-list.component';
import { UserListService } from '../user-list/user-list.service';
// import { inputIsMongoDbID } from '../shared/inputIsMongodb';

interface TodoForm {
    assignedTo: FormControl<string>;
    dueDate: FormControl<string>;
    title: FormControl<string>;
}

@Component({
    selector: 'app-todo-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, UserListComponent],
    providers: [UserListService],
    templateUrl: './todo-form.component.html',
    styleUrl: './todo-form.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoFormComponent {
    fb = inject(FormBuilder);

    apiService = inject(ApiService);

    todosService = inject(TodosService);

    userListService = inject(UserListService);

    authService = inject(AuthService);

    infoPopupService = inject(InfoPopupService);

    todoForm = this.fb.group({
        title: new FormControl('', [
            Validators.required.bind(Validators).bind(this),
            Validators.minLength(3).bind(this),
        ]),
        assignedTo: new FormControl('', [
            // Validators.required.bind(this),
            // inputIsMongoDbID().bind(this),
        ]),

        dueDate: new FormControl('', [
            // Validators.required.bind(this),
            // Validators.pattern(
            //     '^([0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])$'
            // ).bind(this),
        ]),
    }) as FormGroup<TodoForm>;

    // ngOnInit(): void {
    //     this.todoForm = this.fb.group({});
    // }

    selectedUser = effect(() => {
        if (this.userListService.selectedUser()) {
            this.todoForm.controls.assignedTo.setValue(
                this.userListService.selectedUser()?.id ?? ''
            );
        }
    });

    onAssignedToClick(): void {
        this.apiService.getUsers();
        this.userListService.openModal();
    }

    onSubmit(): void {
        const todo = {
            title: this.todoForm.value.title,
            dueDate: this.todoForm.value.dueDate,
            assignedTo: this.todoForm.value.assignedTo,
        };

        if (!todo.title) {
            this.todoForm.markAllAsTouched();
            return;
        }

        this.apiService.createTodo(todo.title, todo.dueDate, todo.assignedTo);

        this.infoPopupService.showNotification(
            'Successfully created todo!',
            'success'
        );

        this.userListService.selectedUser.set(null);
    }
}
