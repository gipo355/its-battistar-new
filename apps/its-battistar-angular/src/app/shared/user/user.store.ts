import { inject, InjectionToken } from '@angular/core';
import { TUserSafe } from '@its-battistar/shared-types';
import { signalStore, withState } from '@ngrx/signals';

// FIXME: fix type mess from shared lybrary
interface UserState {
  user: TUserSafe | null;
}

const initialState: UserState = {
  user: {
    id: 'aslkdfalsdkfasldf',
    username: 'John Doe',
    avatar: 'https://avatar.iran.liara.run/public/3',
    accounts: [
      {
        id: 'asldkfjasldkfj',
        provider: 'google',
        email: 'test@gipo.dev',
      },
    ],
  },
};

const USER_STATE = new InjectionToken<UserState>('TodosState', {
  factory: () => initialState,
});

export const UserStore = signalStore(
  { providedIn: 'root' }, // 👈 Defining the store as a singleton. No need to provide it in the module.
  withState(() => inject(USER_STATE))
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
