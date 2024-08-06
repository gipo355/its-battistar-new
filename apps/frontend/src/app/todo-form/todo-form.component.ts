import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-todo-form',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './todo-form.component.html',
    styleUrl: './todo-form.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoFormComponent {}
