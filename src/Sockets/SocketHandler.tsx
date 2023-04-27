import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";

import socket from ".";
import { groupChannelEvents } from "./events/group-channel-events";
import { groupChatEvents } from "./events/group-chat-events";
import { groupEvents } from "./events/group-events";
import { userEvents } from "./events/user-events";
import { UpdateChannelsListEvent } from "./types/groupChannelTypes";
import {
  ICreateGroupMessageEvent,
  IDeleteGroupMessageEvent,
  IUpdateGroupMessageEvent,
} from "./types/groupChatTypes";
import {
  InvalidateEvent,
  JoinRoomEvent,
  LeaveGroupEvent,
  LeaveRoomEvent,
  UpdateEvent,
  UpdateGroupUsersEvent,
} from "./types/groupTypes";
import { ILoginEvent, ILogoutEvent } from "./types/loginAndLogoutTypes";

type props = {
  children: React.ReactNode;
};

// USER EVENTS

export type userSocketEvents =
  | { event: "logout_user"; data: ILogoutEvent }
  | { event: "login_user"; data: ILoginEvent };

// GROUP EVENTS
export type groupSocketEvents =
  | InvalidateEvent
  | UpdateEvent
  | JoinRoomEvent
  | UpdateGroupUsersEvent
  | LeaveRoomEvent
  | LeaveGroupEvent;

export type groupChannelSocketEvents = UpdateChannelsListEvent;

export type groupChatSocketEvents =
  | {
      event: "create_group_message";
      data: ICreateGroupMessageEvent;
    }
  | { event: "update_group_message"; data: IUpdateGroupMessageEvent }
  | { event: "delete_group_message"; data: IDeleteGroupMessageEvent };

export default function SocketHandler({ children }: props) {
  const queryClient = useQueryClient();
  useEffect(() => {
    socket.on("echo", () => {
      socket.emit("ping");
    });

    // USER EVENTS
    userEvents({ socket, queryClient });

    // GROUP EVENTS
    groupEvents({ socket, queryClient });

    // Group Channel Events
    groupChannelEvents({ socket, queryClient });
    //Group chat events
    groupChatEvents({ socket, queryClient });

    return () => {
      socket.removeAllListeners();
    };
  }, [queryClient]);
  return <>{children}</>;
}
