import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { produce } from "immer";
import React, { useEffect } from "react";

import { areGroupUsers } from "../../test/validation/schemaValidation";
import { IGroupChannel } from "../Hooks/groupChannelHooks";
import { IMessage } from "../Hooks/groupChatHooks";
import { IGroup, IGroupUsers, IUser } from "../Hooks/groupHooks";
import { PaginatedGroupMessages } from "../utilities/types/pagination";
import socket from ".";
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
  DeleteEvent,
  InvalidateEvent,
  JoinRoomEvent,
  LeaveGroupEvent,
  LeaveRoomEvent,
  UpdateEvent,
  UpdateGroupUsersEvent,
} from "./types/groupTypes";
import {
  IChangeUserStatus,
  ILoginEvent,
  ILogoutEvent,
} from "./types/loginAndLogoutTypes";

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
    socket.on("update_channel_list", (data: UpdateChannelsListEvent) => {
      queryClient.setQueriesData(
        [`group-channels-${data.groupId}`],
        (oldData: unknown) => {
          // get the old data and push new result
          // need to assign it a new reference so it refreshes
          const pushNewChannel = (arr: IGroupChannel[]) => {
            return [...arr, data.payload.channelInfo];
          };
          // if the oldData is an array then add the push new channel
          return Array.isArray(oldData) ? pushNewChannel(oldData) : oldData;
        }
      );
    });

    //Group chat events
    groupChatEvents({ socket, queryClient });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, [queryClient]);
  return <>{children}</>;
}
