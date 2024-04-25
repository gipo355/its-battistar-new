import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ITodo } from '@its-battistar/shared-types';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoItemComponent {
  todo = input<ITodo | null>(null);
}
