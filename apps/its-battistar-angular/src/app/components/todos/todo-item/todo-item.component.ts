import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { ETodoColorOptions, ITodo } from '@its-battistar/shared-types';

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

  colorSchema: Record<keyof typeof ETodoColorOptions, string> = {
    default:
      'bg-slate-300 before:bg-slate-300 dark:before:bg-slate-500 bg-opacity-50',
    pink: 'bg-pink-500 before:bg-pink-500 dark:before:bg-pink-500 bg-opacity-50',
    green:
      'bg-green-300 before:bg-green-300 dark:before:bg-green-500 bg-opacity-50',
    blue: 'bg-blue-300 before:bg-blue-300 dark:before:bg-blue-500 bg-opacity-50',
    yellow:
      'bg-yellow-300 before:bg-yellow-300 dark:before:bg-yellow-500 bg-opacity-50',
    red: 'bg-red-300 before:bg-red-300 dark:before:bg-red-500 bg-opacity-50',
  };

  noteColorStyles = computed(() => {
    const color = this.todo()?.color;

    if (!color) {
      return this.colorSchema.default;
    }

    return this.colorSchema[color];
  });
}
