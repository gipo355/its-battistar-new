// Testing signals store with state in ngrx/signals

import { computed, inject, InjectionToken } from '@angular/core';
import { ITodo, TodoSortBy } from '@its-battistar/shared-types';
import {
  patchState,
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
  showCompleted: boolean;
  currentSortBy: keyof typeof TodoSortBy;

  // used to check completed or not
  displayedTodos: ITodo[];

  // used to filter todos by query
  filtered: {
    query: string;
    filteredTodos: ITodo[];
  };
}

const initialState: TodosState = {
  todos: [
    {
      id: '1',
      title: 'Learn Angular',
      description: 'Must learn angular for battistar',
      completed: true,
      dueDate: new Date('2025-12-4'),
      expired: false,
      createdAt: new Date('2021-01-01'),
      updatedAt: new Date('2021-01-02'),
      color: 'yellow',
    },
    {
      id: '2',
      title: 'Learn React',
      description: 'Must learn angular for battistar',
      completed: true,
      dueDate: new Date('2021-12-5'),
      expired: true,
      createdAt: new Date('2021-01-03'),
      updatedAt: new Date('2021-01-04'),
      color: 'pink',
    },
    {
      id: '3',
      title: 'Learn Tailwind',
      description: 'Must learn angular for battistar',
      completed: false,
      dueDate: new Date('2021-12-8'),
      expired: true,
      createdAt: new Date('2021-01-05'),
      updatedAt: new Date('2021-01-06'),
      color: 'blue',
    },
    {
      id: '4',
      title: 'Learn Svelte',
      description: 'Must learn angular for battistar',
      completed: false,
      dueDate: new Date('2021-12-7'),
      expired: true,
      createdAt: new Date('2021-01-07'),
      updatedAt: new Date('2021-01-08'),
    },
    {
      id: '5',
      title: 'Learn Go',
      description: 'Must learn angular for battistar',
      completed: false,
      dueDate: new Date('2021-12-31'),
      expired: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '6',
      title: 'Learn Vue',
      description: 'Must learn angular for battistar',
      completed: false,
      dueDate: new Date('2021-12-31'),
      expired: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '7',
      title: 'Learn Spring',
      description: 'Must learn angular for battistar',
      completed: false,
      dueDate: new Date('2021-12-31'),
      expired: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],

  currentSortBy: 'Newest',

  isLoading: false,

  selectedTodo: null,

  showCompleted: false,

  displayedTodos: [],

  filtered: {
    query: '',
    filteredTodos: [],
  },
};

const TODOS_STATE = new InjectionToken<TodosState>('TodosState', {
  factory: () => initialState,
});

export const TodosStore = signalStore(
  { providedIn: 'root' }, // 👈 Defining the store as a singleton. No need to provide it in the module.

  withState(() => inject(TODOS_STATE)),

  withComputed(({ todos }) => ({
    todosCount: computed(() => todos().length),
  })),

  withMethods((store) => ({
    updateSelectedTodo(todo: ITodo): void {
      // 👇 Updating state using the `patchState` function.
      patchState(store, () => ({ selectedTodo: todo }));
    },

    setShowCompleted(shouldShow: boolean): void {
      patchState(store, () => ({
        // ...state,
        showCompleted: shouldShow,
      }));
    },

    updateSort(sortBy: keyof typeof TodoSortBy): void {
      patchState(store, (state) => {
        let todos = [...state.todos];

        if (sortBy === 'Due Date') {
          todos = todos.sort(
            (a, b) => a.dueDate.getTime() - b.dueDate.getTime()
          );
        }

        if (sortBy === 'Newest') {
          // todos = todos.sort((a, b) => a.title.localeCompare(b.title));
          todos = todos.sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
          );
        }

        if (sortBy === 'Oldest') {
          // todos = todos.sort(
          //   (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
          // );
          todos = todos.sort(
            (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
          );
        }

        if (sortBy === 'Title') {
          todos = todos.sort((a, b) => a.title.localeCompare(b.title));
        }

        return {
          todos,
        };
      });
      patchState(store, () => ({ currentSortBy: sortBy }));
    },

    /**
     * Updates the filtered todos based on the query.
     */
    updateFilteredTodos(query: string): void {
      patchState(store, (state) => {
        const filteredTodos = state.todos.filter((todo) =>
          todo.title.toLowerCase().includes(query.toLowerCase())
        );

        return {
          filtered: {
            query,
            filteredTodos,
          },
        };
      });
    },

    // updateQuery(query: string): void {
    //   // 👇 Updating state using the `patchState` function.
    //   // patchState(store, (state) => ({ filter: { ...state.filter, query } }));
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
  }))
);
