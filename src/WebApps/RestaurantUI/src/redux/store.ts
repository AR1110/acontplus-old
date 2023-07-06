import { UserData } from "@/core/models";
import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./slices";

export interface AppStore {
  user: UserData;
}

export const store = configureStore<AppStore>({
  reducer: {
    user: userReducer,
  },
});
