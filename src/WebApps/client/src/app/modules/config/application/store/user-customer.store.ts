import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

export interface UserCustomerState {
  userRoleId: number;
}

const initialUserCustomerState: UserCustomerState = {
  userRoleId: 0,
};

export const UserCustomerStore = signalStore(
  { providedIn: 'root' },
  withState(initialUserCustomerState),
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
