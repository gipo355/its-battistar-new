import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    input,
} from '@angular/core';

import type { Todo } from '../../model/todo';
import { ApiService } from '../api/api.service';

@Component({
    selector: 'app-todo',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './todo.component.html',
    styleUrl: './todo.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoComponent {
    apiService = inject(ApiService);

    todo = input<Todo>();

    onDelete(id: string | undefined): void {
        if (!id) {
            return;
        }
        this.apiService.deleteTodo(id);
    }

    onComplete(id: string | undefined): void {
        if (!id) {
            return;
        }
        this.apiService.completeTodo(id);
    }

    onUncomplete(id: string | undefined): void {
        if (!id) {
            return;
        }
        this.apiService.uncompleteTodo(id);
    }
}
