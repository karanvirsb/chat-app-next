import { Middleware } from "@reduxjs/toolkit";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";

import socket from "@/Sockets";
import { UpdateEvent } from "@/Sockets/types/groupTypes";

import { groupActions, IGroupState } from "./groupSlice";

export const groupMiddleware: Middleware = (store) => (next) => {
  let session: Session | null;
  getSession().then((s) => (session = s));
  console.log("group middleware socket id: ", socket.id);

  return (action) => {
    if (groupActions.updateGroup.match(action) && socket.connected) {
      console.log(action);
      socket.emit("update_group", action.payload);
      socket.on("updates_for_group", (data) => {
        const groups: IGroupState["groups"] =
          store.getState().groupReducer.groups;
        const group = groups.findIndex(
          (group) => group.groupId === data.groupId
        );
        const newGroups: IGroupState["groups"] = [...groups];
        if (group !== -1) {
          newGroups[group] = { ...newGroups[group], ...data.group_updates };
        }
        store.dispatch(groupActions.setGroups(newGroups));
        socket.off("updates_for_group");
      });
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

    next(action);
  };
};
