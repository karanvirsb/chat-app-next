import { Middleware } from "@reduxjs/toolkit";

import socket from "@/Sockets";

import { socketActions } from "./socketSlice";

export const socketMiddleware: Middleware = (store) => (next) => {
  if (!store.getState().socketReducer.connected) {
    fetch(`http://localhost:3000/api/socket`);
    socket.on("connect", () => {
      store.dispatch(socketActions.setConnected());
      console.log("connected socket middleware id: ", socket.id);
    });
  }
  return (action) => {
    next(action);
  };
};
