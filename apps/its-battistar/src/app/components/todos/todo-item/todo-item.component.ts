import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { ITodo, TodoColor } from '@its-battistar/shared-types';

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

  // noteColors = computed(() => ({
  //   'bg-green-300 before:bg-green-300 dark:before:bg-green-500':
  //     this.todo()?.color === undefined,
  //   'bg-pink-500 before:bg-pink-500 dark:before:bg-pink-500':
  //     this.todo()?.color === 'pink',
  // }));

  colorSchema: Record<keyof typeof TodoColor, string> = {
    default: 'bg-lime-300 before:bg-lime-300 dark:before:bg-lime-500',
    pink: 'bg-pink-500 before:bg-pink-500 dark:before:bg-pink-500',
    green: 'bg-green-300 before:bg-green-300 dark:before:bg-green-500',
    blue: 'bg-blue-300 before:bg-blue-300 dark:before:bg-blue-500',
    yellow: 'bg-yellow-300 before:bg-yellow-300 dark:before:bg-yellow-500',
    red: 'bg-red-300 before:bg-red-300 dark:before:bg-red-500',
  };

  noteColorStyles = computed(() => {
    const color = this.todo()?.color;

    if (!color) {
      return this.colorSchema.default;
    }

    return this.colorSchema[color];
  });
}
