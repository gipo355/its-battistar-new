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

    onDelete(id: string | undefined): void {
        if (!id) {
            return;
        }
        console.log('Delete todo with id:', id);
    }

    onAssignTo(id: string | undefined): void {
        if (!id) {
            return;
        }
        console.log('Assign todo with id:', id);
    }

    onComplete(id: string | undefined): void {
        if (!id) {
            return;
        }
        console.log('Complete todo with id:', id);
    }

    onUncomplete(id: string | undefined): void {
        if (!id) {
            return;
        }
        console.log('Uncomplete todo with id:', id);
    }
}
