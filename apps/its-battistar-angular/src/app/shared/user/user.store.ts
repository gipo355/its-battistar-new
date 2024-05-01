import { inject, InjectionToken } from '@angular/core';
import { IUserSafe } from '@its-battistar/shared-types';
import { signalStore, withState } from '@ngrx/signals';

// interface UserWithAccounts extends IUserSafe {
//   accounts: IAccountSafe[];
// }

interface UserState {
  user: IUserSafe | null;
}

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
};

const USER_STATE = new InjectionToken<UserState>('TodosState', {
  factory: () => initialState,
});

export const UserStore = signalStore(
  { providedIn: 'root' }, // 👈 Defining the store as a singleton. No need to provide it in the module.
  withState(() => inject(USER_STATE))
);
