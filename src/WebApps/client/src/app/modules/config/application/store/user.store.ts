import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

export interface UserState {
  userRoleId: number;
}

const initialUserState: UserState = {
  userRoleId: 0,
};

export const UserStore = signalStore(
  { providedIn: 'root' },
  withState(initialUserState),
  withComputed((store) => ({})),

  withMethods((store) => ({
    setUserRoleId(userRoleId: number) {
      patchState(store, () => {
        return {
          userRoleId,
        };
      });
    },
  })),
);
