import { configureStore } from "@reduxjs/toolkit";

import sideBarReducer from "@/Redux/slices/sideBarSlice";

import { groupReducer } from "./slices/groupSlice";
import modalReducer from "./slices/modalSlice";

export const store = configureStore({
  reducer: {
    modalReducer,
    sideBarReducer,
    groupReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
