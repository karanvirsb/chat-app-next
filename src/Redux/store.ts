import { configureStore } from "@reduxjs/toolkit";

import sideBarReducer from "@/Redux/slices/sideBarSlice";

import { groupMiddleware } from "./group/groupMiddleware";
import { groupReducer } from "./group/groupSlice";
import modalReducer from "./slices/modalSlice";
import { socketMiddleware } from "./socket/socketMiddleware";
import socketReducer from "./socket/socketSlice";

export const store = configureStore({
  reducer: {
    socketReducer,
    groupReducer,
    modalReducer,
    sideBarReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({}).concat([socketMiddleware, groupMiddleware]),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
