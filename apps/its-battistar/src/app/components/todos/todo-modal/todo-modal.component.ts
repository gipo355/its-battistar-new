import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { TodosStore } from '../todos.store';

/**
 * @description
 * this is not a dumb component, its a store editing component
 *
 * since this is rendered as a route inside <router-outlet> we can't pass the selected todo as an input normally.
 * we need to either use a resolver or a service to pass the data to the component.
 *
 * If it was a simple component, we could just use input.
 *
 * Resolver vs Service:
 *
 * Resolver:
 * The resolver is a better choice. We could pass the store in.
 * But it would add complexity and would require to use observables for data we already have available
 * And would still require some kind of service to update the data and store probably?.
 *
 * Service:
 * in this case, we would need to inject a service to provide the data, might as well inject the store directly.
 *
 * i first tried creating a resolver to pass the signal store to the component and using observables
 * to receive the data.
 * the problem is that it adds unneeded complexity and we only have 1 selected todo at a time
 *
 * if we'd need multiple modals to edit different todos open at the same time, we'd need to refactor this
 */
@Component({
  selector: 'app-todo-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todo-modal.component.html',
  styleUrl: './todo-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoModalComponent {
  route = inject(ActivatedRoute);

  store = inject(TodosStore);

  todo = this.store.selectedTodo;
}
