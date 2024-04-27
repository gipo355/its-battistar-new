import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ITodo, ITodoColorOptions } from '@its-battistar/shared-types';
import { initFlowbite } from 'flowbite';
import { debounceTime, Subject, takeUntil } from 'rxjs';

import { TodosStore } from '../todos.store';
import { TodoModalService } from './todo-modal.service';

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
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './todo-modal.component.html',
  styleUrl: './todo-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoModalComponent implements OnDestroy, OnInit {
  s = inject(TodoModalService);

  route = inject(ActivatedRoute);

  // we use the store only to update isEditMode() since it may be used in other components
  // the component checks if it's in edit mode only by verifying if it has a todo.id available as input when created
  // this way we have a clear separation of concerns and it can be used in multiple places
  store = inject(TodosStore);

  private destroy$ = new Subject<void>();
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    // clear the selected todo when the component is destroyed as we are no longer editing it
    this.store.setOrRemoveCurrentSelectedTodo(null);
  }

  ngOnInit(): void {
    initFlowbite();

    // TODO: another possible way is to store the changes in currentSelectedTodo and update the store on submit or cancel
    // this way we POST only once
    this.modalForm.valueChanges
      .pipe(takeUntil(this.destroy$), debounceTime(this.s.inputDebounceTime))
      .subscribe((value) => {
        const currentTodo = this.store.currentSelectedTodo();

        // handle existing todo
        if (currentTodo?.id) {
          this.store.updateCurrentSelectedTodoValues({
            ...(value.title && { title: value.title }),
            ...(value.description && { description: value.description }),
            ...(value.color && { color: value.color }),
            ...(value.date && { dueDate: new Date(value.date) }),
          });

          return;
        }

        // TODO: handle new todo
      });
  }

  // the todo can be populated if the user navigates to /todos/edit by clicking on a todo in the list or null if it clicks the create button
  // NOTE: we could refactor this component to receive the todo as input from the resolver on navigation instead of using the store

  // we could use the resolver to populate the todo, passing a Todo or directly a signal
  // todo = input<ITodo | null>(null);
  // todo = this.route.snapshot.data['todo'] as Signal<ITodo> | null | undefined;

  // The resolver uses the id param to populate the selectedTodo in the store
  todo = this.store.currentSelectedTodo;

  // utility with typecasting for safety used to initialize the form
  getTodo(): ITodo | null {
    return this.todo();
  }

  // define the colors since we need to use them in a loop to display them
  colors = Object.keys(this.store.todoColorOptions());

  // TODO: add validators
  modalForm = new FormGroup({
    title: new FormControl<string>(this.getTodo()?.title ?? ''),
    description: new FormControl<string>(this.getTodo()?.description ?? ''),

    // TODO: color and dueDate inputs
    date: new FormControl<string>(
      // eslint-disable-next-line no-magic-numbers
      this.getTodo()?.dueDate?.toISOString().split('T')[0] ??
        // eslint-disable-next-line no-magic-numbers
        new Date().toISOString().split('T')[0]
    ),
    color: new FormControl<keyof ITodoColorOptions>(
      this.getTodo()?.color ?? 'green'
    ),
  });

  /**
   * @description
   * this method is called when the form is submitted
   * it should update the todo in the store and the database
   */
  onSubmit(): void {
    console.warn('method not implemented');
  }

  /**
   * @description
   * this method is called when the user exits
   * used for cleanup
   */
  onCancel(): void {
    console.warn('cancel method not implemented');

    this.store.syncCurrentWithTodos();
  }

  onDeleteTodo(): void {
    console.warn('delete method not implemented');
  }

  onToggleCompleted(): void {
    console.warn('toggle method not implemented');
  }
}
