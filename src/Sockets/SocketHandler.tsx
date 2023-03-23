import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { produce } from "immer";
import socket from ".";
import { IGroupChannel } from "../Hooks/groupChannelHooks";
import { IGroup, IGroupUsers, IUser } from "../Hooks/groupHooks";
import { UpdateChannelsListEvent } from "./types/groupChannelTypes";
import {
  InvalidateEvent,
  UpdateEvent,
  JoinRoomEvent,
  UpdateGroupUsersEvent,
  LeaveRoomEvent,
  LeaveGroupEvent,
  DeleteEvent,
} from "./types/groupTypes";
import {
  ICreateGroupMessageEvent,
  IDeleteGroupMessageEvent,
  IUpdateGroupMessageEvent,
} from "./types/groupChatTypes";
import { PaginatedGroupMessages } from "../utilities/types/pagination";
import { IMessage } from "../Hooks/groupChatHooks";
import {
  IChangeUserStatus,
  ILoginEvent,
  ILogoutEvent,
} from "./types/loginAndLogoutTypes";
import { areGroupUsers } from "../../test/validation/schemaValidation";

type props = {
  children: JSX.Element;
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
    socket.on("logged_user_out", (data: IChangeUserStatus) => {
      console.log("logged_user_out client");
      queryClient.setQueryData(
        [`group-users-${data.payload}`],
        (oldData: unknown) => {
          console.log("logged_user_out client", oldData, data);
          const filterResult = (users: IUser[]) => {
            const updatedValue = produce(users, (draft) => {
              const foundIndex = draft.findIndex(
                (user) => user.userId === data.userId
              );
              if (foundIndex !== -1) draft[foundIndex].status = "offline";
            });
            console.log(updatedValue);
            return updatedValue;
          };

          return Array.isArray(oldData) && areGroupUsers(oldData)
            ? filterResult(oldData)
            : oldData;
        }
      );
    });

    socket.on("logged_user_in", (data: IChangeUserStatus) => {
      console.log("logged_user_in client");
      queryClient.setQueryData(
        [`group-users-${data.payload}`],
        (oldData: unknown) => {
          console.log("logged_user_in client", oldData, data);
          const filterResult = (users: IUser[]) => {
            const updatedValue = produce(users, (draft) => {
              const foundIndex = draft.findIndex(
                (user) => user.userId === data.userId
              );
              if (foundIndex !== -1) draft[foundIndex].status = "online";
            });
            console.log(updatedValue);
            return updatedValue;
          };
          return Array.isArray(oldData) && areGroupUsers(oldData)
            ? filterResult(oldData)
            : oldData;
        }
      );
    });

    // GROUP EVENTS
    socket.on("update_group_name", (data: UpdateEvent) => {
      queryClient.setQueriesData(["groups"], (oldData: unknown) => {
        const update = (entity: IGroup) =>
          entity.groupId === data.groupId
            ? { ...entity, ...data.payload }
            : entity;
        return Array.isArray(oldData) ? oldData.map(update) : oldData;
      });
    });

    socket.on("delete_group", (data: DeleteEvent) => {
      queryClient.setQueriesData(["groups"], (oldData: unknown) => {
        const deleteGroup = (group: IGroup) => group.groupId !== data.groupId;
        return Array.isArray(oldData) ? oldData.filter(deleteGroup) : oldData;
      });
    });

    socket.on("update_group_users", (data: UpdateGroupUsersEvent) => {
      queryClient.setQueriesData(
        [`group-users-${data.groupId}`],
        (oldData: unknown) => {
          const pushResult = (arr: IUser[]) => {
            return [...arr, data.payload.userInfo];
          };
          return Array.isArray(oldData) ? pushResult(oldData) : oldData;
        }
      );
    });

    socket.on("removed_user", (data: LeaveGroupEvent) => {
      queryClient.setQueriesData(
        [`group-users-${data.groupId}`],
        (oldData: unknown) => {
          const removeUser = (user: IUser) =>
            user.userId !== data.payload.userId;
          return Array.isArray(oldData) ? oldData.filter(removeUser) : oldData;
        }
      );
    });

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
    socket.on("new_group_chat_message", (data: ICreateGroupMessageEvent) => {
      const newMessage = data.payload.messageInfo;
      const FIRST_PAGE = 0;
      queryClient.setQueryData(
        [`group-messages-${newMessage.channelId}`],
        (oldData: unknown) => {
          const pushResult = (
            infiniteData: InfiniteData<PaginatedGroupMessages<IMessage>>
          ) => {
            if (data.payload !== undefined) {
              const updatedData = produce(infiniteData, (draft) => {
                draft.pages[FIRST_PAGE].data.push(data.payload.messageInfo);
              });
              return updatedData;
            }
          };

          return checkIfPagesExist(oldData) ? pushResult(oldData) : oldData;
        }
      );
    });

    socket.on("update_group_chat_message", (data: IUpdateGroupMessageEvent) => {
      const updatedMessage = data.payload.messageInfo;
      queryClient.setQueriesData(
        [`group-messages-${updatedMessage.channelId}`],
        (oldData: unknown) => {
          const updateResult = (
            infiniteData: InfiniteData<PaginatedGroupMessages<IMessage>>
          ) => {
            if (updatedMessage !== undefined) {
              const updatedData = produce(infiniteData, (draft) => {
                draft.pages[data.payload.pageIndex].data[
                  data.payload.messageIndex
                ] = data.payload.messageInfo;
              });

              return updatedData;
            }
          };

          return checkIfPagesExist(oldData) ? updateResult(oldData) : oldData;
        }
      );
    });

    socket.on("delete_group_chat_message", (data: IDeleteGroupMessageEvent) => {
      const payload = data.payload;
      queryClient.setQueriesData(
        [`group-messages-${payload.channelId}`],
        (oldData: unknown) => {
          const deleteResult = (
            infiniteData: InfiniteData<PaginatedGroupMessages<IMessage>>
          ) => {
            if (payload !== undefined) {
              const updatedData = produce(infiniteData, (draft) => {
                draft.pages[data.payload.pageIndex].data.splice(
                  data.payload.messageIndex,
                  1
                );
              });

              return updatedData;
            }
          };

          return checkIfPagesExist(oldData) ? deleteResult(oldData) : oldData;
        }
      );
    });

    return () => {
      socket.off("echo");
      socket.off("logged_user_in");
      socket.off("logged_user_out");
      socket.off("update_group_name");
      socket.off("delete_group");
      socket.off("update_group_users");
      socket.off("removed_user");
      socket.off("update_channel_list");
      socket.off("new_group_chat_message");
      socket.off("update_group_chat_message");
      socket.off("delete_group_chat_message");
    };
  }, [queryClient]);
  return children;
}

function checkIfPagesExist(
  arr: unknown | InfiniteData<PaginatedGroupMessages<IMessage>>
): arr is InfiniteData<PaginatedGroupMessages<IMessage>> {
  return (
    (arr as InfiniteData<PaginatedGroupMessages<IMessage>>).pages !==
      undefined &&
    (arr as InfiniteData<PaginatedGroupMessages<IMessage>>).pageParams !==
      undefined
  );
}
