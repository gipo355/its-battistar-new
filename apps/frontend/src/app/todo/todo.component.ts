import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import type { Todo } from '../../model/todo';

@Component({
    selector: 'app-todo',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './todo.component.html',
    styleUrl: './todo.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoComponent {
    todo = input<Todo>();
}
