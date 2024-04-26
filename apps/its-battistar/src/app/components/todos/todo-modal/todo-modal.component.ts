import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ITodo } from '@its-battistar/shared-types';

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

  // we use the store only to update isEditMode() since it may be used in other components
  // the component checks if it's in edit mode only by verifying if it has a todo.id available as input when created
  // this way we have a clear separation of concerns and it can be used in multiple places
  store = inject(TodosStore);

  // the todo can be populated if the user navigates to /todos/edit by clicking on a todo in the list
  // or null if it clicks the create button
  todo = input<ITodo | null>(null);
}
