import { User } from "@/core/models";
import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./slices";

export interface AppStore {
  user: User;
}

export const store = configureStore<AppStore>({
  reducer: {
    user: userReducer,
  },
});
