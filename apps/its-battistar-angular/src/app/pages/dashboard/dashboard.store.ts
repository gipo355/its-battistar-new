// Testing signals store with state in ngrx/signals

import { inject, InjectionToken } from '@angular/core';
import {
  // patchState,
  signalStore,
  withState,
} from '@ngrx/signals';
// import { rxMethod } from '@ngrx/signals/rxjs-interop';

interface MenuItem {
  icon: string;
  link: string;
  title: string;
}

interface DashboardState {
  isLoading: boolean;
  menuItems: MenuItem[];
  selectedMenuItem: MenuItem | null;
}

const initialState: DashboardState = {
  isLoading: false,
  menuItems: [
    {
      title: 'Overview',
      icon: '🛖',
      link: 'overview',
    },
    {
      title: 'Todos',
      icon: '✅',
      link: 'todos',
    },
    {
      title: 'Settings',
      icon: '⚙️',
      link: 'settings',
    },
  ],
  selectedMenuItem: null,
};

const TODOS_STATE = new InjectionToken<DashboardState>('TodosState', {
  factory: () => initialState,
});

export const DashboardStore = signalStore(
  { providedIn: 'root' }, // 👈 Defining the store as a singleton. No need to provide it in the module.
  withState(() => inject(TODOS_STATE))
  // withComputed(({ menuItems }) => ({
  //   todosCount: computed(() => todos().length),
  // })),
  // withMethods(() =>
  //   // store
  //   ({
  //     // updateQuery(query: string): void {
  //     //   // 👇 Updating state using the `patchState` function.
  //     //   // patchState(store, (state) => ({ filter: { ...state.filter, query } }));
  //     // },
  //     // updateOrder(order: 'asc' | 'desc'): void {
  //     //   // patchState(store, (state) => ({ filter: { ...state.filter, order } }));
  //     // },
  //     // side effects async
  //     // async loadAll(): Promise<void> {
  //     //   patchState(store, { isLoading: true });
  //     //
  //     //   const books = await booksService.getAll();
  //     //   patchState(store, { books, isLoading: false });
  //     // },
  //     // reactive with rxjs
  //     // 👇 Defining a method to load books by query.
  //     // loadByQuery: rxMethod<string>(
  //     //   pipe(
  //     //     debounceTime(300),
  //     //     distinctUntilChanged(),
  //     //     tap(() => patchState(store, { isLoading: true })),
  //     //     switchMap((query) =>
  //     //       booksService.getByQuery(query).pipe(
  //     //         tapResponse({
  //     //           next: (books) => patchState(store, { books }),
  //     //           error: console.error,
  //     //           finalize: () => patchState(store, { isLoading: false }),
  //     //         })
  //     //       )
  //     //     )
  //     //   )
  //     // ),
  //   })
  // )
);
