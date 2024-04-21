import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodosComponent {
  title = 'Todos';
}
