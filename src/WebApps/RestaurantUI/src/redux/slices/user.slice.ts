import { UserEmptyState } from "@/core/models";
import { AuthService as AuthSvc } from "@/core/services";
import { createSlice } from "@reduxjs/toolkit";

export const userslice = createSlice({
  name: "user",
  initialState: AuthSvc.getUser() ? AuthSvc.getUser() : UserEmptyState,
  reducers: {
    setCredentials: (state, action) => {
      console.log(state);
      return action.payload;
    },
    logOut: () => {
      AuthSvc.clearStorageToken();
      return UserEmptyState;
    },
  },
});

export const { setCredentials, logOut } = userslice.actions;
export default userslice.reducer;
