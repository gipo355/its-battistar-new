/* eslint-disable no-magic-numbers */
// Testing signals store with state in ngrx/signals

import { computed, inject, InjectionToken } from '@angular/core';
import type { ITodo } from '@its-battistar/shared-types';
import {
  ETodoColorOptions,
  ETodoSortByOptions,
  Todo,
} from '@its-battistar/shared-types';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';

import { TodosService } from './todos.service';
// import { rxMethod } from '@ngrx/signals/rxjs-interop';

interface TodosState {
  /**
   * used to keep track of the todo being created in the modal
   * doesn't have all the properties of a todo
   * it's the partial todo object that is being created to send to the db
   * only the updatable ones
   */
  currentNewTodo: Todo | null;

  /**
   * used to keep track of the todo being edited in the modal
   * We receive those objects from the db, so they are full todos
   * only the updatable ones
   */
  currentSelectedTodo: ITodo | null;

  errors: string[] | null;

  /**
   * used to filter todos by query
   */
  filter: {
    currentSortBy: keyof typeof ETodoSortByOptions;
    query: string;
    showCompleted: boolean;
    showExpired: boolean;
  };

  filteredTodos?: ITodo[];

  isLoading: boolean;
  todoColorOptions: typeof ETodoColorOptions;

  /**
   * Options used to display menus in the UI
   * and provide intellisens
   */
  // FIXME: make them arrays?
  todoSortByOptions: typeof ETodoSortByOptions;
  // TODO: possibly use a map instead of an array for faster state updates
  todos: Map<ITodo['id'], ITodo>;
}

// TODO: move to express backend init
const initialState: TodosState = {
  // FAKER lib is huge, will fail the build
  todos: new Map<string, ITodo>(),

  isLoading: false,

  currentSelectedTodo: null,

  currentNewTodo: null,

  errors: null,

  filter: {
    currentSortBy: 'Newest',
    showExpired: true,
    showCompleted: false,
    query: '',
  },

  filteredTodos: [],

  todoSortByOptions: ETodoSortByOptions,

  todoColorOptions: ETodoColorOptions,
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

  /**
   * can inject services
   */
  withMethods((store, todoService = inject(TodosService)) => ({
    // TODO: expired must be set based on due date, won't refresh automatically

    /**
     * async side effects
     *
     * Load todos from the backend and set them in the store.
     */
    async loadTodos(): Promise<void> {
      try {
        patchState(store, { isLoading: true });

        // FIXME: change here to dynamically set the query params
        // may be load on every showCompleted switch?
        // can add more query params when changing filters and more
        const request = await todoService.getTodos$({
          showCompleted: true,
        });

        if (!request.ok) {
          patchState(store, { isLoading: false, todos: new Map() });
          throw new Error(`Error loading todos: ${request.message ?? ''}`);
        }
        const todos = request.data;

        if (!todos) {
          throw new Error('No todos found');
        }

        const todosMap = new Map<string, ITodo>(
          todos
            .filter((todo) => todo.id)
            .map((todo) => {
              if (todo.dueDate) {
                todo.dueDate = new Date(todo.dueDate);
              }
              todo.createdAt = new Date(todo.createdAt);
              todo.updatedAt = new Date(todo.updatedAt);

              return [todo.id, todo];
            }) as [string, ITodo][]
        );

        patchState(store, () => {
          return {
            todos: todosMap,
            isLoading: false,
          };
        });
      } catch (error) {
        // TODO: handle errors
        patchState(store, { isLoading: false });
        throw new Error('Error loading todos');
      }
    },

    // TODO: will have to add validators and http calls to CRUD
    async createTodo(): Promise<void> {
      try {
        const currentNewTodo = store.currentNewTodo();

        // handle edge error cases
        if (!currentNewTodo) {
          throw new Error('No new todo to create');
        }

        // todo is a partial todo, with that info we call db to create the todo
        // then create a new todo here and set it in the store as currentNewTodo

        const response = await todoService.createTodo$(currentNewTodo);
        if (!response.ok) {
          throw new Error(`Error creating todo: ${response.message ?? ''}`);
        }

        const newTodo = response.data;

        // handle possible errors
        if (!newTodo?.id) {
          throw new Error('Error creating todo');
        }

        newTodo.dueDate && (newTodo.dueDate = new Date(newTodo.dueDate));
        newTodo.createdAt = new Date(newTodo.createdAt);
        newTodo.updatedAt = new Date(newTodo.updatedAt);

        patchState(store, () => {
          // we modify only the current new todo
          // the method syncCurrentWithTodos will handle syncing todos with the current new todo
          return {
            currentNewTodo: newTodo,
          };
        });
      } catch (error) {
        throw new Error('Error creating todo');
      }
    },

    async deleteTodo(): Promise<void> {
      try {
        const todoToDelete = store.currentSelectedTodo();
        if (!todoToDelete?.id) {
          throw new Error('No todo selected to delete');
        }

        const response = await todoService.deleteTodo$(todoToDelete.id);
        if (!response.ok) {
          throw new Error(`Error deleting todo: ${response.message ?? ''}`);
        }

        const todos = new Map(store.todos());

        todos.delete(todoToDelete.id);

        patchState(store, () => {
          return {
            todos,
            // reset to prevent conflicts
            currentSelectedTodo: null,
            currentNewTodo: null,
          };
        });
      } catch (error) {
        throw new Error('Error deleting todo');
      }
    },

    async updateTodo(): Promise<void> {
      try {
        const currentSelectedTodo = store.currentSelectedTodo();

        if (!currentSelectedTodo?.id) {
          throw new Error('No todo selected to update');
        }

        const newTodo: ITodo = {
          ...currentSelectedTodo,
        };

        const response = await todoService.updateTodo$(newTodo);
        if (!response.ok) {
          throw new Error(`Error updating todo: ${response.message ?? ''}`);
        }

        patchState(store, () => {
          return {
            currentSelectedTodo: newTodo,
          };
        });
      } catch (error) {
        throw new Error('Error updating todo');
      }
    },

    setErrors(errors: string[]): void {
      patchState(store, () => {
        return {
          errors,
        };
      });
    },

    removeErrors(): void {
      patchState(store, () => {
        return {
          errors: null,
        };
      });
    },

    removeCurrentSelectedTodo(): void {
      patchState(store, () => {
        return { currentSelectedTodo: null };
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
    // commented in favor of syncCurrentWithTodos
    // updateTodoById(id: string, todo: ITodo): void {
    //   patchState(store, (state) => {
    //     const todos = new Map(state.todos);
    //     todos.set(id, todo);
    //     return { todos };
    //   });
    // },

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
      patchState(store, (state) => {
        // at this point, we have the currentSelectedTodo and currentNewTodo
        // from the database and we can sync them
        const todos = new Map(store.todos());

        const currentSelectedTodo = state.currentSelectedTodo;

        const currentNewTodo = state.currentNewTodo as ITodo | null;

        // handle updating an existing todo
        if (currentSelectedTodo?.id) {
          todos.set(currentSelectedTodo.id, currentSelectedTodo);
          // handle creating a new todo
        } else if (currentNewTodo?.id) {
          todos.set(currentNewTodo.id, currentNewTodo);
        }

        return {
          todos,
        };
      });
    },

    updateCurrentSelectedTodoValues(todo: Partial<ITodo>): void {
      patchState(store, () => {
        const currentSelectedTodo = store.currentSelectedTodo();

        // handle possible edge cases
        if (!currentSelectedTodo?.id) {
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

    updateCurrentNewTodoValues(todo: Partial<ITodo>): void {
      patchState(store, (state) => {
        const currentTodo = state.currentNewTodo;

        // if there are values to update, we update the current new todo
        // keep in mind incoming values and state values may be partial
        // we must make sure the item stored has all the properties set
        // to avoid type errors
        const updatedTodoValues = new Todo({
          title: todo.title ?? currentTodo?.title ?? '',
          description: todo.description ?? currentTodo?.description ?? '',
          image: todo.image ?? currentTodo?.image,
          color: todo.color ?? currentTodo?.color ?? 'default',
          dueDate: todo.dueDate ?? currentTodo?.dueDate,
        });

        return {
          currentNewTodo: {
            ...currentTodo,
            ...updatedTodoValues,
          },
        };
      });
    },

    removeCurrentNewTodo(): void {
      patchState(store, () => {
        return { currentNewTodo: null };
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
