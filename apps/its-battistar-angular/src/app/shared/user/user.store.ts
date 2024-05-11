import { inject, InjectionToken } from '@angular/core';
import type { IUserSafe } from '@its-battistar/shared-types';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

// interface UserWithAccounts extends IUserSafe {
//   accounts: IAccountSafe[];
// }

interface UserState {
  /**
   * If the user is authenticated or not.
   * This is useful to show different UIs based on the user's authentication status.
   * Can be used for an authguard to protect routes.
   * Can be used to send a fetch to refresh before redirecting to login.
   */
  isAuthenticated: boolean;
  user: IUserSafe | null;
}

// TODO: implement logic to get the user from the server on login, refresh, signup
const initialState: UserState = {
  user: {
    id: 'aslkdfalsdkfasldf',
    username: 'John Doe',
    avatar: 'https://avatar.iran.liara.run/public/3',
    role: 'USER',
    createdAt: new Date(),
    updatedAt: new Date(),
    accounts: [
      {
        id: 'asldkfjasldkfj',
        strategy: 'GITHUB',
        email: 'test@gipo.dev',
        primary: true,
        verified: true,
        updatedAt: new Date(),
        createdAt: new Date(),
      },
    ],
  },

  isAuthenticated: false,
};

const USER_STATE = new InjectionToken<UserState>('TodosState', {
  factory: () => initialState,
});

export const UserStore = signalStore(
  { providedIn: 'root' }, // 👈 Defining the store as a singleton. No need to provide it in the module.
  withState(() => inject(USER_STATE)),

  withMethods((store) => ({
    login() {
      patchState(store, () => {
        return {
          isAuthenticated: true,
        };
      });
    },
    logout() {
      patchState(store, () => {
        return {
          isAuthenticated: false,
        };
      });
    },
  }))
);
