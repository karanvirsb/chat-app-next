import {
  FetchNextPageOptions,
  InfiniteQueryObserverResult,
  useQueryClient,
} from "@tanstack/react-query";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import React, { useEffect, useRef } from "react";

import { IGroupMessage } from "@/server/Features/groupMessage/groupMessage";

import { IUser } from "../../Hooks/groupHooks";
import useIntersectionObserver from "../../Hooks/useIntersectionObserver";
import { PaginatedGroupMessages } from "../../utilities/types/pagination";
import Message from "./Message";
dayjs.extend(localizedFormat);

type props = {
  messages: IGroupMessage[] | undefined;
  groupId: string;
  lastPage?: boolean;
  editCallback: ({
    messageInfo,
    pageIndex,
    messageIndex,
  }: {
    messageInfo: IGroupMessage;
    pageIndex: number;
    messageIndex: number;
  }) => void;
  deleteCallback: ({
    messageId,
    pageIndex,
    messageIndex,
  }: {
    messageId: string;
    pageIndex: number;
    messageIndex: number;
  }) => void;
  fetchNextPage?: (
    options?: FetchNextPageOptions | undefined
  ) => Promise<
    InfiniteQueryObserverResult<
      PaginatedGroupMessages<IGroupMessage> | undefined,
      unknown
    >
  >;
  pageIndex: number;
};

export default function Messages({
  messages,
  groupId,
  lastPage,
  fetchNextPage,
  editCallback,
  deleteCallback,
  pageIndex,
}: props): JSX.Element {
  const firstElementRef = useRef<HTMLDivElement>(null);
  const entry = useIntersectionObserver(firstElementRef, {});
  const isVisible = !!(entry?.isIntersecting ?? false);

  const queryClient = useQueryClient();
  const groupUsers = queryClient.getQueriesData([`group-users-${groupId}`])[0]
    ? (queryClient.getQueriesData([
        `group-users-${groupId}`,
      ])[0][1] as unknown[])
    : [];

  useEffect(() => {
    if (isVisible && fetchNextPage != null) {
      void fetchNextPage();
    }
  }, [fetchNextPage, isVisible]);

  return (
    <>
      {messages?.map((message, index) => {
        const foundUser = isGroupUsers(groupUsers)
          ? groupUsers.find((user) => user.userId === message.userId)
          : undefined;
        if (lastPage !== null && index === 0) {
          return (
            <Message
              editCallback={editCallback}
              deleteCallback={deleteCallback}
              key={message.messageId}
              ref={firstElementRef}
              message={message}
              username={foundUser?.username}
              messageIndex={index}
              pageIndex={pageIndex}
            ></Message>
          );
        } else {
          return (
            <Message
              editCallback={editCallback}
              deleteCallback={deleteCallback}
              key={message.messageId}
              message={message}
              username={foundUser?.username}
              messageIndex={index}
              pageIndex={pageIndex}
            ></Message>
          );
        }
      })}
    </>
  );

  function isGroupUsers(arr: IUser[] | unknown[]): arr is IUser[] {
    return (
      arr &&
      (arr as IUser[]).map !== undefined &&
      (arr as IUser[])[0] &&
      (arr as IUser[])[0].userId !== undefined
    );
  }
}
