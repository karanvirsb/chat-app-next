import { InfiniteData, QueryClient } from "@tanstack/react-query";
import produce from "immer";
import { Socket } from "socket.io-client";

import { IMessage } from "@/Hooks/groupChatHooks";
import { groupChatEventsTypes } from "@/shared/socket-events/groupChatTypes";
import { PaginatedGroupMessages } from "@/utilities/types/pagination";

import {
  ICreateGroupMessageEvent,
  IDeleteGroupMessageEvent,
  IUpdateGroupMessageEvent,
} from "../types/groupChatTypes";

type props = { socket: Socket; queryClient: QueryClient };

export function groupChatEvents({ socket, queryClient }: props) {
  socket.on(
    groupChatEventsTypes.NEW_MESSAGE.broadcast,
    (data: ICreateGroupMessageEvent) => {
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
                if (draft?.pages[FIRST_PAGE] && draft.pages[FIRST_PAGE].data) {
                  draft.pages[FIRST_PAGE]?.data?.push(data.payload.messageInfo);
                } else {
                  draft.pages[FIRST_PAGE] = {
                    data: [data.payload.messageInfo],
                    hasNextPage: false,
                    nextPage: null,
                  };
                }
              });
              return updatedData;
            }
          };

          return checkIfPagesExist(oldData) ? pushResult(oldData) : oldData;
        }
      );
    }
  );

  socket.on(
    groupChatEventsTypes.UPDATE_MESSAGE.broadcast,
    (data: IUpdateGroupMessageEvent) => {
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
    }
  );

  socket.on(
    groupChatEventsTypes.DELETE_MESSAGE.broadcast,
    (data: IDeleteGroupMessageEvent) => {
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
    }
  );
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
