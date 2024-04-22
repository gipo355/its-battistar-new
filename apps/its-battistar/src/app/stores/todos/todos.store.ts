// Testing signals store with state in ngrx/signals

import { computed, inject, InjectionToken } from '@angular/core';
import { ITodo } from '@its-battistar/shared-types';
import {
  // patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
// import { rxMethod } from '@ngrx/signals/rxjs-interop';

interface TodosState {
  todos: ITodo[];
  isLoading: boolean;
  selectedTodo: ITodo | null;
}

const initialState: TodosState = {
  todos: [
    {
      id: '1',
      title: 'Learn Angular',
      completed: false,
      dueDate: new Date('2025-12-31'),
      expired: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      title: 'Learn React',
      completed: true,
      dueDate: new Date('2021-12-31'),
      expired: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      title: 'Learn Angular',
      completed: false,
      dueDate: new Date('2021-12-31'),
      expired: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],

  isLoading: false,

  selectedTodo: null,
};

const TODOS_STATE = new InjectionToken<TodosState>('TodosState', {
  factory: () => initialState,
});

export const BooksStore = signalStore(
  { providedIn: 'root' }, // 👈 Defining the store as a singleton. No need to provide it in the module.
  withState(() => inject(TODOS_STATE)),
  withComputed(({ todos }) => ({
    todosCount: computed(() => todos().length),
  })),
  withMethods(() =>
    // store
    ({
      // updateQuery(query: string): void {
      //   // 👇 Updating state using the `patchState` function.
      //   // patchState(store, (state) => ({ filter: { ...state.filter, query } }));
      // },
      // updateOrder(order: 'asc' | 'desc'): void {
      //   // patchState(store, (state) => ({ filter: { ...state.filter, order } }));
      // },
      // side effects async
      // async loadAll(): Promise<void> {
      //   patchState(store, { isLoading: true });
      //
      //   const books = await booksService.getAll();
      //   patchState(store, { books, isLoading: false });
      // },
      // reactive with rxjs
      // 👇 Defining a method to load books by query.
      // loadByQuery: rxMethod<string>(
      //   pipe(
      //     debounceTime(300),
      //     distinctUntilChanged(),
      //     tap(() => patchState(store, { isLoading: true })),
      //     switchMap((query) =>
      //       booksService.getByQuery(query).pipe(
      //         tapResponse({
      //           next: (books) => patchState(store, { books }),
      //           error: console.error,
      //           finalize: () => patchState(store, { isLoading: false }),
      //         })
      //       )
      //     )
      //   )
      // ),
    })
  )
);