import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-todo-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todo-filter.component.html',
  styleUrl: './todo-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoFilterComponent {
  name = 'TodoFilterComponent';
}
