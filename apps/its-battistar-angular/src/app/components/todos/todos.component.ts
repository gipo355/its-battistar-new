import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
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
import { TodosService } from './todos.service';
import { TodosStore } from './todos.store';

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [
    CommonModule,
    TodoFilterComponent,
    TodoItemComponent,
    RouterModule,
    HttpClientModule,
  ],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodosComponent implements OnInit {
  todoStore = inject(TodosStore);

  router = inject(Router);

  route = inject(ActivatedRoute);

  todoService = inject(TodosService);

  async ngOnInit(): Promise<void> {
    initFlowbite();

    /**
     * Load todos from the server and store them in the store when the component is initialized.
     */
    await this.todoStore.loadTodos();
  }

  async onClickTodoItem(todo: ITodo): Promise<void> {
    // resolver takes care of updating the selected todo using the id
    await this.router.navigate(['.', todo.id], {
      relativeTo: this.route,
    });
  }
}
