import { Middleware } from "@reduxjs/toolkit";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";

import { TGroupChannelEvents } from "@/shared/socket-events/groupChannelTypes";
import { GroupEventsNames } from "@/shared/socket-events/groupEventTypes";
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
      const { channel } = action.payload;

      socket.emit(TGroupChannelEvents.ADD_CHANNEL.send, channel);

      socket.off(TGroupChannelEvents.ADD_CHANNEL.send);
    }

    if (groupActions.deleteGroup.match(action) && socket.connected) {
      socket.emit(GroupEventsNames.DELETE_GROUP.send, action.payload);
    }

    // CHANNEL EVENTS
    if (groupActions.deleteChannel.match(action) && socket.connected) {
      socket.emit(TGroupChannelEvents.DELETE_CHANNEL.send, action.payload);
    }
    next(action);
  };
};
