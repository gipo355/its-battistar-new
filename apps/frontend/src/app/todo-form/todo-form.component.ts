/* eslint-disable no-magic-numbers */
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
// import { inputIsMongoDbID } from '../shared/inputIsMongodb';

interface TodoForm {
    assignedTo: FormControl<string>;
    dueDate: FormControl<string>;
    title: FormControl<string>;
}

@Component({
    selector: 'app-todo-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './todo-form.component.html',
    styleUrl: './todo-form.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoFormComponent {
    fb = inject(FormBuilder);

    apiService = inject(ApiService);

    todosService = inject(TodosService);

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
            Validators.required.bind(this),
            Validators.pattern(
                '^([0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])$'
            ).bind(this),
        ]),
    }) as FormGroup<TodoForm>;

    // ngOnInit(): void {
    //     this.todoForm = this.fb.group({});
    // }

    onSubmit(): void {
        const todo = {
            title: this.todoForm.value.title,
            dueDate: this.todoForm.value.dueDate,
            assignedTo: this.todoForm.value.assignedTo,
        };

        if (!todo.title || !todo.assignedTo || !todo.dueDate) {
            this.todoForm.markAllAsTouched();
            return;
        }

        this.apiService.createTodo(
            todo.title,
            new Date(todo.dueDate),
            todo.assignedTo
        );

        this.infoPopupService.showNotification(
            'Successfully created todo!',
            'success'
        );
    }
}
