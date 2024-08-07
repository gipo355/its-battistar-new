import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { TodosService } from '../pages/todos/todos.service';

@Component({
    selector: 'app-todos-filter',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './todos-filter.component.html',
    styleUrl: './todos-filter.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodosFilterComponent {
    todosService = inject(TodosService);
    // this comp is the top bar allowing to filter the todos with showCompleted and dueDate
    // it also has  a button to create a new todo
}
