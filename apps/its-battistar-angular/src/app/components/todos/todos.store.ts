/* eslint-disable no-magic-numbers */
// Testing signals store with state in ngrx/signals

import { computed, inject, InjectionToken } from '@angular/core';
import {
  ITodo,
  ITodoColorOptions,
  ITodoSortByOptions,
} from '@its-battistar/shared-types';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';

import { todosTestDataMap } from './todos.testData';
// import { rxMethod } from '@ngrx/signals/rxjs-interop';

interface TodosState {
  // TODO: possibly use a map instead of an array for faster state updates
  todos: Map<string, ITodo>;

  isLoading: boolean;
  currentSelectedTodo: ITodo | null;

  /**
   * used to filter todos by query
   */
  filter: {
    showCompleted: boolean;
    showExpired: boolean;
    currentSortBy: keyof ITodoSortByOptions;
    query: string;
  };
  filteredTodos?: ITodo[];

  /**
   * Options used to display menus in the UI
   * and provide intellisens
   */
  // FIXME: make them arrays?
  todoSortByOptions: ITodoSortByOptions;
  todoColorOptions: ITodoColorOptions;
}

// TODO: move to express backend init
const initialState: TodosState = {
  // FAKER lib is huge, will fail the build
  todos: todosTestDataMap,

  isLoading: false,

  currentSelectedTodo: null,

  filter: {
    currentSortBy: 'Newest',
    showExpired: true,
    showCompleted: false,
    query: '',
  },

  filteredTodos: [],

  todoSortByOptions: {
    Newest: 'Newest',
    Oldest: 'Oldest',
    Title: 'Title',
    DueDate: 'DueDate',
  },
  todoColorOptions: {
    red: 'red',
    blue: 'blue',
    green: 'green',
    yellow: 'yellow',
    pink: 'pink',
    default: 'default',
  },
};

const TODOS_STATE = new InjectionToken<TodosState>('TodosState', {
  factory: () => initialState,
});

export const TodosStore = signalStore(
  { providedIn: 'root' }, // 👈 Defining the store as a singleton. No need to provide it in the module.

  withState(() => inject(TODOS_STATE)),

  withComputed(({ todos }) => ({
    todosCount: computed(() => todos().size),
  })),

  /**
   * This function reruns whenever the `todos` or `filter` state changes.
   * It is used to show the actual todos displayed in the UI.
   * This allows setting up a reactive store that updates the UI whenever the state changes.
   * It keeps the logic in one place, making it easier to maintain and test.
   * It also maintains a global sync of the actions performed
   *
   * Check the updateFilters method below which triggers this computed method
   */
  withComputed(({ todos, filter }) => ({
    filteredTodos: computed(() => {
      // starts with setting all todos to the root state,
      // this way we always have a clean slate to work with and prevent out of syng
      // IMPORTANT: prevent mutating the state directly
      let filteredTodos = [...todos()].map(([, todo]) => todo);

      // remove completed todos if the filter is set to hide them
      // if filter showcomp is true, return all
      if (!filter.showCompleted()) {
        filteredTodos = filteredTodos.filter((todo) => !todo.completed);
      }

      // remove expired if filter hides them
      console.log('filter.showExpired()', filter.showExpired());
      if (!filter.showExpired()) {
        filteredTodos = filteredTodos.filter((todo) => !todo.expired);
      }

      // filter todos by query
      if (filter.query()) {
        filteredTodos = filteredTodos.filter((todo) =>
          todo.title.toLowerCase().includes(filter.query().toLowerCase())
        );
      }

      // sort todos after filtering
      if (filter.currentSortBy() === 'DueDate') {
        filteredTodos = filteredTodos.sort((todoPrev, todoNext) => {
          if (!todoPrev.dueDate || !todoNext.dueDate) {
            return 0;
          }

          return todoPrev.dueDate.getTime() - todoNext.dueDate.getTime();
        });
      }

      if (filter.currentSortBy() === 'Newest') {
        filteredTodos = filteredTodos.sort(
          (todoPrev, todoNext) =>
            todoNext.createdAt.getTime() - todoPrev.createdAt.getTime()
        );
      }

      if (filter.currentSortBy() === 'Oldest') {
        filteredTodos = filteredTodos.sort(
          (todoPrev, todoNext) =>
            todoPrev.createdAt.getTime() - todoNext.createdAt.getTime()
        );
      }

      if (filter.currentSortBy() === 'Title') {
        filteredTodos = filteredTodos.sort((todoPrev, todoNext) =>
          todoPrev.title.localeCompare(todoNext.title)
        );
      }

      return filteredTodos;
    }),
  })),

  withMethods((store) => ({
    // TODO: will have to add validators and http calls to CRUD
    // IMP: the id will be generated on the backend, will have to change this
    createTodo(todo: ITodo): void {
      patchState(store, (state) => {
        const todos = new Map(state.todos);

        if (!todo.id) {
          throw new Error('Todo must have an id');
        }

        todos.set(todo.id, todo);
        return { todos };
      });
    },

    deleteTodoById(id: string): void {
      patchState(store, (state) => {
        const todos = new Map(state.todos);
        todos.delete(id);
        return { todos };
      });
    },

    /**
     * this method is the reason i converted the todos to a map.
     * with a map, we can update the todo directly by id with O(1) complexity
     * allowing us to live update the todo in the store on user input change
     *
     * the flow is as follows:
     * 1. user changes the todo in the modal
     * 2. the currentSelectedTodo is updated in the store with the new values
     * 3. on currentSelectedTodo change, we make a PATCH request and if successful, state is updated with the changed todo
     *
     * IMP: handle offline cases and errors
     *
     * this way we avoid creating a new todo for every input change polluting memory
     * and we keep the state in sync with the user input
     *
     */
    updateTodoById(id: string, todo: ITodo): void {
      patchState(store, (state) => {
        const todos = new Map(state.todos);
        todos.set(id, todo);
        return { todos };
      });
    },

    setOrRemoveCurrentSelectedTodo(todo: ITodo | null): void {
      patchState(store, () => {
        return {
          currentSelectedTodo: todo,
        };
      });
    },

    /**
     * syncTodos is used to keep the todos in sync with the currentSelectedTodo
     * will happen when user exits, submits or cancels the modal, to allow live updates without
     * needing to click save
     *
     * Having the ID is important as we need to know if it's a new todo or an existing one to update
     */
    syncCurrentWithTodos(): void {
      patchState(store, () => {
        const todos = new Map(store.todos());
        const currentSelectedTodo = store.currentSelectedTodo();

        console.log('signal store syncCurrentWithTodos');

        // TODO: handle creating a new todo, http
        if (!currentSelectedTodo?.id) {
          console.log('creating new todo');
          return { todos };
        }

        console.log('updating existing todo');
        console.log('currentSelectedTodo', currentSelectedTodo);
        // handle updating an existing todo

        todos.set(currentSelectedTodo.id, currentSelectedTodo);
        return {
          todos,
        };
      });
    },

    updateCurrentSelectedTodoValues(todo: Partial<ITodo>): void {
      patchState(store, () => {
        const currentSelectedTodo = store.currentSelectedTodo();

        if (!currentSelectedTodo) {
          throw new Error('No todo selected to update');
        }

        return {
          currentSelectedTodo: {
            ...currentSelectedTodo,
            ...todo,
          },
        };
      });
    },

    /**
     * Updates the filter state.
     * This will trigger the computed method that filters the todos.
     * Every time the filter state changes, the computed method will rerun and update the filtered todos.
     */
    updateFilters(filters: Partial<TodosState['filter']>): void {
      patchState(store, (state) => {
        // create a copy of the current filter
        // we will return this object after updating it
        // and change only the properties that are passed in the filters
        const filter = { ...state.filter };

        if (filters.query !== undefined) {
          filter.query = filters.query;
        }

        if (filters.showCompleted !== undefined) {
          filter.showCompleted = filters.showCompleted;
        }

        if (filters.showExpired !== undefined) {
          filter.showExpired = filters.showExpired;
        }

        if (filters.currentSortBy) {
          filter.currentSortBy = filters.currentSortBy;
        }

        // return the updated filter
        return {
          filter,
        };
      });
    },

    // OLD TRIES for posterity

    // setShowCompleted(shouldShow: boolean): void {
    //   patchState(store, (state) => ({
    //     filter: {
    //       ...state.filter,
    //       showCompleted: shouldShow,
    //     },
    //   }));
    // },

    // updateSort(sortBy: keyof typeof TodoSortBy): void {
    //   patchState(store, (state) => {
    //     let todos = [...state.todos];
    //
    //     if (sortBy === 'Due Date') {
    //       todos = todos.sort(
    //         (a, b) => a.dueDate.getTime() - b.dueDate.getTime()
    //       );
    //     }
    //
    //     if (sortBy === 'Newest') {
    //       // todos = todos.sort((a, b) => a.title.localeCompare(b.title));
    //       todos = todos.sort(
    //         (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    //       );
    //     }
    //
    //     if (sortBy === 'Oldest') {
    //       // todos = todos.sort(
    //       //   (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
    //       // );
    //       todos = todos.sort(
    //         (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
    //       );
    //     }
    //
    //     if (sortBy === 'Title') {
    //       todos = todos.sort((a, b) => a.title.localeCompare(b.title));
    //     }
    //
    //     return {
    //       todos,
    //     };
    //   });
    //   patchState(store, () => ({ currentSortBy: sortBy }));
    // },

    /**
     * Updates the filtered todos based on the query.
     */
    // updateFilteredTodos(query: string): void {
    //   patchState(store, (state) => {
    //     const filteredTodos = state.todos.filter((todo) =>
    //       todo.title.toLowerCase().includes(query.toLowerCase())
    //     );
    //
    //     return {
    //       filtered: {
    //         query,
    //         filteredTodos,
    //       },
    //     };
    //   });
    // },

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
