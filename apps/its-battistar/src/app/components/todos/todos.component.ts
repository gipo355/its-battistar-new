import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';

import { TodoFilterComponent } from './todo-filter/todo-filter.component';

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [CommonModule, TodoFilterComponent],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodosComponent implements OnInit {
  title = 'Todos';
  ngOnInit(): void {
    initFlowbite();
  }
}
