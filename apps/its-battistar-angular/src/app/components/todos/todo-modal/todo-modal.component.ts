/* eslint-disable no-magic-numbers */
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ETodoColorOptions, ITodo, Todo } from '@its-battistar/shared-types';
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
 * if we'd need multiple modals to edit different todos open
 * at the same time, we'd need to refactor this
 *
 *   the todo can be populated if the user navigates to /todos/edit by clicking
 *   on a todo in the list or null if it clicks the create button
 *
 *   NOTE: we could refactor this component to receive the todo as input
 *   from the resolver on navigation instead of using the store
 *
 *  would be a good exercise to transform this into a dumb component
 *
 *   we could use the resolver to populate the todo, passing a Todo or directly a signal
 *   todo = input<ITodo | null>(null);
 *   todo = this.route.snapshot.data['todo'] as Signal<ITodo> | null | undefined;
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

  router = inject(Router);

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

    this.modalForm.valueChanges
      .pipe(takeUntil(this.destroy$), debounceTime(this.s.inputDebounceTime))
      .subscribe((value) => {
        // create a new todo with only the values that are not empty
        // as we don't want to overwrite the existing values with empty ones
        const newTodo: Partial<Todo> = {
          ...(value.title && { title: value.title }),
          ...(value.description && { description: value.description }),
          ...(value.color && { color: value.color }),
          ...(value.date && { dueDate: new Date(value.date) }),
        };

        /**
         * For both new and existing todos, we keep as a source of truth
         * the corresponding item in the store.
         * We perform updates on the item and later sync it with the store and db
         * when the user exits the modal and is done editing.
         *
         * Relevant:
         * The two functions below udpate the ref item in the store
         * The onExit() and onSubmit() functions sync the item with the store and db
         */

        // handle updating existing todo with id
        if (this.store.currentSelectedTodo()?.id) {
          this.store.updateCurrentSelectedTodoValues(newTodo);
          return;
        }

        //  handle creating new todo without id
        if (newTodo.title) {
          this.store.updateCurrentNewTodoValues(newTodo);
          return;
        }
      });
  }

  // The resolver uses the id param to populate the selectedTodo in the store
  // NOTE: could move this to dumb component and use resolver to populate the todo
  // with input
  todo = this.store.currentSelectedTodo;

  // utility with typecasting for safety used to initialize the form
  getTodo(): ITodo | null {
    return this.todo();
  }

  // define the colors since we need to use them in a loop to display them
  colors = Object.keys(this.store.todoColorOptions());

  modalForm = new FormGroup({
    title: new FormControl<string>(this.getTodo()?.title ?? '', [
      Validators.required.bind(this),
      Validators.minLength.bind(this, 3),
      Validators.maxLength.bind(this, 50),
      Validators.pattern.bind(this, /^[a-zA-Z0-9\s]*$/),
    ]),

    description: new FormControl<string>(this.getTodo()?.description ?? '', [
      Validators.required.bind(this),
      Validators.maxLength.bind(this, 500),
      Validators.pattern.bind(this, /^[a-zA-Z0-9\s]*$/),
    ]),

    date: new FormControl<string>(
      this.getTodo()?.dueDate?.toISOString().split('T')[0] ??
        new Date().toISOString().split('T')[0],
      [
        Validators.required.bind(this),
        Validators.pattern.bind(this, /^\d{4}-\d{2}-\d{2}$/),
      ]
    ),

    color: new FormControl<keyof typeof ETodoColorOptions>(
      this.getTodo()?.color ?? 'green',
      [Validators.required.bind(this)]
    ),
  });

  /**
   * @description
   * this method is called when the form is submitted
   * it should update the todo in the store and the database
   */
  async onSubmit(): Promise<void> {
    // creates the todo in db, sets currentNewTodo to todo with ID
    // the sync on exit will update the store with the new todo
    // FIXME: allow those methods to take an id as argument to be reusable?
    await this.store.createTodo();

    // flow:
    // the todo service has the http calls methods
    // will inject in the store to perform
    // patch, post, delete, get
    // with async methods
    // on submit -> create todo -> db -> store current new -> on exit sync

    await this.onExit();
  }

  /**
   * @description
   * this method is called when the user exits
   * used for cleanup and syncing the todos list with the respective
   * selected or new todo, which at this point is the server response generated todo
   */
  async onExit(): Promise<void> {
    // if we are editing, update the todo in the db and sync it to the currentSelectedTodo
    // FIXME: allow those methods to take an id as argument to be reusable?
    if (this.store.currentSelectedTodo()?.id) await this.store.updateTodo();

    // sync will check if we have currentNewTodo or currentSelectedTodo
    // will update the store to sync it with respective todo which is the return of
    // the server call at this point
    this.store.syncCurrentWithTodos();

    // reset the state to avoid conflicts
    this.store.removeCurrentSelectedTodo();
    this.store.removeCurrentNewTodo();

    await this.router.navigate(['..'], {
      relativeTo: this.route,
    });
  }

  async onDelete(): Promise<void> {
    // deletes todo from db and store, removes current selected todo
    // uses currentSelectedTodo to delete the todo
    // FIXME: allow those methods to take an id as argument to be reusable?
    await this.store.deleteTodo();

    await this.onExit();
  }

  async onToggleCompleted(): Promise<void> {
    const selectedTodo = this.store.currentSelectedTodo();

    if (!selectedTodo?.id) {
      return;
    }

    this.store.updateCurrentSelectedTodoValues({
      completed: !selectedTodo.completed,
    });

    await this.onExit();
  }
}
