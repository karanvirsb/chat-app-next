import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";

import { groupActions } from "@/Redux/group/groupSlice";
import { IGroupMessage } from "@/server/Features/groupMessage/groupMessage";
import { IUser } from "@/server/Features/user/user";

import Message from "../../../Components/Messages/Message";
import { useGetGroupMessagesByChannelIdQuery } from "../../../Hooks/groupChatHooks";
import { useAppDispatch } from "../../../Hooks/reduxHooks";
import { setModal } from "../../../Redux/slices/modalSlice";

type props = {
  groupId: string;
};

interface GroupMessage extends IGroupMessage {
  pageIndex: number;
  messageIndex: number;
}

export default function GroupChat({ groupId }: props): JSX.Element {
  const searchParams = useSearchParams();
  const channelId = searchParams.get("channel") ?? "";
  const virtuosoRef = useRef<VirtuosoHandle | null>(null);
  const messageRef = useRef<null | HTMLInputElement>(null); // to track the message input

  // TODO after inital load need to set dateCreated to last message.
  const {
    data: chatMessages,
    fetchNextPage,
    isSuccess,
  } = useGetGroupMessagesByChannelIdQuery({
    channelId,
    dateCreated: new Date().getTime(),
    limit: 10,
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
        messages?.data.forEach((message, messageIndex) => {
          newArr.push({ ...message, pageIndex, messageIndex });
        });
      });
    }
    return newArr;
  }, [chatMessages, isSuccess]);

  useEffect(() => {
    if (displayMessages.length <= 10) {
      virtuosoRef.current?.scrollToIndex(displayMessages.length - 1);
    } else {
      virtuosoRef.current?.scrollToIndex(10);
    }
  }, [displayMessages]);

  return (
    <div className="flex relative flex-col flex-grow overflow-auto bg-chat-bg">
      <div className="flex flex-grow flex-col w-full gap-6 p-4 ">
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
          <>
            <Virtuoso
              ref={virtuosoRef}
              data={displayMessages}
              // style={{ height: 400 }}
              // useWindowScroll
              firstItemIndex={Math.max(0, displayMessages.length - 10)}
              initialTopMostItemIndex={Math.max(9, displayMessages.length - 1)}
              followOutput="smooth"
              startReached={() => {
                const hasNext =
                  chatMessages.pages &&
                  (
                    chatMessages.pages[chatMessages?.pages.length - 1] ?? {
                      hasNextPage: false,
                    }
                  ).hasNextPage;
                return hasNext ? fetchNextPage() : "No more pages";
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
          </>
        )}
      </div>
      {channelId.length > 0 ? (
        // made it sticky so it will stay at the bottom
        <form
          className="p-4 input-group sticky bottom-0 bg-chat-bg"
          onSubmit={handleMessageSubmit}
        >
          <input
            type="text"
            placeholder="Send a message"
            className="input input-bordered !rounded-full bg-[#2a303c] w-full focus:outline-none"
            ref={messageRef}
          />
        </form>
      ) : null}
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
