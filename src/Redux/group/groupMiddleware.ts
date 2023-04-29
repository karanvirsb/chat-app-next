import { Middleware } from "@reduxjs/toolkit";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";

import socket from "@/Sockets";

import { groupActions } from "./groupSlice";

export const groupMiddleware: Middleware = (store) => (next) => {
  let session: Session | null;
  getSession().then((s) => (session = s));
  console.log("group middleware socket id: ", socket.id);

  return (action) => {
    if (groupActions.updateGroup.match(action) && socket.connected) {
      console.log(action);
      socket.emit("update_group", action.payload);
    }

    if (groupActions.setGroups.match(action) && socket.connected) {
      const groupIds = [];
      for (const group of action.payload) {
        groupIds.push(group.groupId);
      }
      socket.emit("join_rooms", {
        rooms: groupIds,
        userId: session?.user.id,
      });

      socket.off("join_rooms");
    }

    if (groupActions.addChannel.match(action) && socket.connected) {
      socket.emit("add_channel", action.payload);
      socket.off("add_channel");
    }

    next(action);
  };
};
