import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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

  router = inject(Router);

  route = inject(ActivatedRoute);

  ngOnInit(): void {
    initFlowbite();
  }

  async onClickTodoItem(todo: ITodo): Promise<void> {
    console.log('Clicked todo item:', todo);

    // resolver takes care of updating the selected todo using the id
    await this.router.navigate(['.', todo.id], {
      relativeTo: this.route,
    });
  }
}
