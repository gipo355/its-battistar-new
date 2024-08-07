import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    input,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import type { Todo } from '../../model/todo';
import { inputIsMongoDbID } from '../shared/inputIsMongodb';
import { TodoService } from './todo.service';

@Component({
    selector: 'app-todo',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    providers: [TodoService],
    templateUrl: './todo.component.html',
    styleUrl: './todo.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoComponent {
    todoService = inject(TodoService);
    fb = inject(FormBuilder);

    assigneeForm = this.fb.control('', [inputIsMongoDbID()]);

    todo = input<Todo>();
}
