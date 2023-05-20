import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";

import { useGetBoundingClientRect } from "@/Hooks/useGetBoundingClientRect";
import { useGetElementSize } from "@/Hooks/useGetElementSize";
import { useSocketLoading } from "@/Hooks/useSocketLoading";
import { groupActions } from "@/Redux/group/groupSlice";
import { IGroupMessage } from "@/server/Features/groupMessage/groupMessage";
import { IUser } from "@/server/Features/user/user";
import {
  groupChatEventDataTypes,
  groupChatEventsTypes,
} from "@/shared/socket-events/groupChatTypes";

import Message from "../../../Components/Messages/Message";
import { useGetGroupMessagesByChannelIdQuery } from "../../../Hooks/groupChatHooks";
import { useAppDispatch } from "../../../Hooks/reduxHooks";
import { setModal } from "../../../Redux/slices/modalSlice";

type props = {
  groupId: string;
  topBarRef: React.MutableRefObject<HTMLDivElement | null>;
};

interface GroupMessage extends IGroupMessage {
  pageIndex: number;
  messageIndex: number;
}

export default function GroupChat({ groupId, topBarRef }: props): JSX.Element {
  const searchParams = useSearchParams();
  const channelId = searchParams.get("channel") ?? "";
  const virtuosoRef = useRef<VirtuosoHandle | null>(null);
  const messageRef = useRef<null | HTMLInputElement>(null); // to track the message input
  const messageFormRef = useRef<null | HTMLFormElement>(null);
  const groupChatDivRef = useRef<null | HTMLDivElement>(null);

  const topBarPosition = useGetBoundingClientRect({ ref: topBarRef });
  const formPosition = useGetBoundingClientRect({ ref: messageFormRef });
  const groupChatDivSize = useGetElementSize({ ref: groupChatDivRef });

  const { success: messageSentSuccess, loading: messageSentLoading } =
    useSocketLoading({
      socketEvent: groupChatEventsTypes.NEW_MESSAGE.broadcast,
      errorEvent: groupChatEventsTypes.NEW_MESSAGE.error,
    });

  const {
    success: messageEditSuccess,
    loading: messageEditLoading,
    data,
  } = useSocketLoading<groupChatEventDataTypes["UPDATE_MESSAGE"]["broadcast"]>({
    socketEvent: groupChatEventsTypes.UPDATE_MESSAGE.broadcast,
    errorEvent: groupChatEventsTypes.UPDATE_MESSAGE.error,
  });

  // TODO after inital load need to set dateCreated to last message.
  const {
    data: chatMessages,
    fetchNextPage,
    isSuccess,
    hasNextPage,
  } = useGetGroupMessagesByChannelIdQuery({
    channelId,
    dateCreated: new Date().getTime(),
    limit: 15,
  });

  const dispatch = useAppDispatch();
  const { data: sessionInfo } = useSession();

  const queryClient = useQueryClient();

  const foundUser = useCallback(
    (id: string) => {
      const groupUsers = (
        queryClient.getQueriesData([`group-users-${groupId}`])[0]
          ? (queryClient.getQueriesData([
              `group-users-${groupId}`,
            ])[0][1] as unknown[])
          : []
      ) as IUser[];
      return groupUsers.find((user: IUser) => user.userId === id);
    },
    [queryClient, groupId]
  );
  const displayMessages = useMemo(() => {
    const newArr: GroupMessage[] = [];
    if (isSuccess && chatMessages !== undefined) {
      chatMessages.pages.forEach((messages, pageIndex) => {
        const newMessages =
          chatMessages.pages[chatMessages.pages.length - 1 - pageIndex];
        newMessages?.data.forEach((message, messageIndex) => {
          newArr.push({
            ...message,
            pageIndex: chatMessages.pages.length - 1 - pageIndex,
            messageIndex,
          });
        });
      });
    }
    return newArr;
  }, [chatMessages, isSuccess]);

  useEffect(() => {
    // TODO message is sent to the right visible chat otherwise add notification
    if (!messageSentLoading && messageSentSuccess) {
      virtuosoRef.current?.scrollToIndex({
        index: displayMessages.length - 1,
        behavior: "smooth",
      });
    } else if (!messageEditLoading && messageEditSuccess && data) {
      virtuosoRef.current?.scrollIntoView({
        index: data.payload.messageIndex * (data.payload.pageIndex + 1),
        behavior: "smooth",
        align: "center",
        calculateViewLocation: () => {
          return null;
        },
      });
    } else if (displayMessages.length > 15) {
      virtuosoRef.current?.scrollToIndex(
        (chatMessages?.pages[chatMessages?.pages.length - 1]?.data?.length ??
          15) - 1
      );
    } else {
      virtuosoRef.current?.scrollToIndex(displayMessages.length - 1);
    }
  }, [
    chatMessages?.pages,
    data,
    displayMessages,
    messageEditLoading,
    messageEditSuccess,
    messageSentLoading,
    messageSentSuccess,
  ]);

  return (
    <div
      ref={groupChatDivRef}
      className="flex relative flex-col flex-grow overflow-auto bg-chat-bg"
    >
      <div className="flex relative flex-col flex-grow gap-6">
        {/* TODO Create chat component */}
        {chatMessages === undefined ? (
          <p className="text-center text-lg uppercase font-semibold">
            Select a channel to see your chats!
          </p>
        ) : chatMessages.pages[0] === undefined ? (
          <p className="text-center text-lg uppercase font-semibold">
            Seems like this is your first message send something awesome! No
            pressure!
          </p>
        ) : (
          <Virtuoso
            ref={virtuosoRef}
            data={displayMessages}
            style={{
              height: Math.abs(topBarPosition.bottom - formPosition.top),
              paddingBottom: "100px",
            }}
            firstItemIndex={Math.max(0, displayMessages.length - 15)}
            initialTopMostItemIndex={displayMessages.length - 1}
            totalCount={displayMessages.length}
            startReached={() => {
              return hasNextPage ? fetchNextPage() : "No more pages";
            }}
            itemContent={(index, message) => {
              const user = foundUser(message.userId);
              return (
                <Message
                  deleteCallback={handleDeletingMessage}
                  editCallback={handleEditMessage}
                  message={message}
                  messageIndex={message.messageIndex}
                  pageIndex={message.pageIndex}
                  username={user?.username ?? "Unknown"}
                  key={message.messageId}
                ></Message>
              );
            }}
          />
        )}
      </div>
      <form
        className="p-4 sm:input-group-sm md:input-group-md fixed bottom-0 bg-chat-bg"
        ref={messageFormRef}
        style={{ width: groupChatDivSize?.width }}
        onSubmit={handleMessageSubmit}
      >
        {channelId.length > 0 ? (
          // made it sticky so it will stay at the bottom
          <input
            type="text"
            placeholder="Send a message"
            className="input input-bordered !rounded-full bg-[#2a303c] w-full focus:outline-none"
            ref={messageRef}
          />
        ) : null}
      </form>
    </div>
  );

  function handleMessageSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    if (messageRef.current !== null && sessionInfo !== null) {
      dispatch(
        groupActions.createMessage({
          groupId,
          payload: {
            messageInfo: {
              channelId,
              messageId: "",
              dateCreated: new Date().getTime(),
              text: messageRef.current.value,
              userId: sessionInfo.user?.id,
            },
          },
        })
      );
      // TODO reset only after success
      messageRef.current.value = ""; // resetting value
    }
  }

  function handleDeletingMessage({
    messageId,
    pageIndex,
    messageIndex,
  }: {
    messageId: string;
    pageIndex: number;
    messageIndex: number;
  }) {
    dispatch(
      setModal({
        modalName: "deleteGroupMessage",
        open: true,
        options: {
          messageId,
          groupId,
          pageIndex,
          messageIndex,
          channelId,
        },
      })
    );
  }
  // TODO create shared types
  function handleEditMessage({
    messageInfo,
    pageIndex,
    messageIndex,
  }: {
    messageInfo: IGroupMessage;
    pageIndex: number;
    messageIndex: number;
  }) {
    dispatch(
      groupActions.updateMessage({
        groupId,
        payload: { messageIndex, messageInfo, pageIndex },
      })
    );
  }
}
