import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { ITodo } from '@its-battistar/shared-types';
import { initFlowbite } from 'flowbite';

import { TodoFilterComponent } from './todo-filter/todo-filter.component';
import { TodoItemComponent } from './todo-item/todo-item.component';
import { TodosStore } from './todos.store';

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [CommonModule, TodoFilterComponent, TodoItemComponent, RouterModule],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodosComponent implements OnInit {
  title = 'Todos';

  todoStore = inject(TodosStore);

  ngOnInit(): void {
    initFlowbite();
  }

  onClickTodoItem(todo: ITodo): void {
    this.todoStore.updateSelectedTodo(todo);
    console.log('Clicked todo item:', todo);
  }
}
