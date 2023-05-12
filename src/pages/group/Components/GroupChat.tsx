import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";

import useIntersectionObserver from "@/Hooks/useIntersectionObserver";
import { groupActions } from "@/Redux/group/groupSlice";
import { IGroupMessage } from "@/server/Features/groupMessage/groupMessage";
import { IUser } from "@/server/Features/user/user";

import Message from "../../../Components/Messages/Message";
import Messages from "../../../Components/Messages/Messages";
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
  const chatMessagesRef = useRef<null | HTMLDivElement>(null); // to track the message container
  // const observerElem = useRef<null | HTMLDivElement>(null); // to track the load more
  // const bottomElem = useRef<null | HTMLDivElement>(null); // to track the bottom of the chat
  // const messageIntoViewRef = useRef<null | HTMLDivElement>(null); // to track the new message
  // const firstElemRef = useRef<null | HTMLDivElement>(null); // to see if the component has already rendered

  // TODO after inital load need to set dateCreated to last message.
  const {
    data: chatMessages,
    fetchNextPage,
    isSuccess,
    isFetchingNextPage,
  } = useGetGroupMessagesByChannelIdQuery({
    channelId,
    dateCreated: new Date().getTime(),
    limit: 10,
  });

  const dispatch = useAppDispatch();
  const { data: sessionInfo } = useSession();

  const queryClient = useQueryClient();
  const groupUsers = (
    queryClient.getQueriesData([`group-users-${groupId}`])[0]
      ? (queryClient.getQueriesData([
          `group-users-${groupId}`,
        ])[0][1] as unknown[])
      : []
  ) as IUser[];

  const foundUser = useCallback(
    (id: string) => {
      return groupUsers.find((user: IUser) => user.userId === id);
    },
    [groupUsers]
  );
  const displayMessages = useMemo(() => {
    const newArr: GroupMessage[] = [];
    if (isSuccess && chatMessages !== undefined) {
      chatMessages.pages.forEach((messages, pageIndex) => {
        // const newMessages =
        //   chatMessages.pages[chatMessages.pages.length - 1 - pageIndex];
        messages?.data.forEach((message, messageIndex) => {
          newArr.push({ ...message, pageIndex, messageIndex });
        });
      });
    }
    return newArr;
  }, [chatMessages, isSuccess]);

  // const handleObserver = useCallback(
  //   (entries: IntersectionObserverEntry[]) => {
  //     const [target] = entries;
  //     if (
  //       target.isIntersecting &&
  //       chatMessages?.pages[chatMessages.pages.length - 1]?.hasNextPage &&
  //       firstElemRef.current !== null
  //     ) {
  //       fetchNextPage();
  //     }
  //   },
  //   [chatMessages, fetchNextPage]
  // );

  // useEffect(() => {
  //   if (observerElem.current) {
  //     const element = observerElem.current;
  //     const option = { threshold: 0 };

  //     const observer = new IntersectionObserver(handleObserver, option);
  //     observer.observe(element);
  //     return () => observer.unobserve(element);
  //   }
  // }, [fetchNextPage, handleObserver]);

  // useEffect(() => {
  //   if (bottomElem.current && !messageIntoViewRef.current) {
  //     bottomElem.current.scrollIntoView({ behavior: "smooth" });
  //   } else {
  //     messageIntoViewRef.current?.scrollIntoView();
  //   }
  // });

  useEffect(() => {
    if (displayMessages.length <= 10) {
      virtuosoRef.current?.scrollToIndex(displayMessages.length - 1);
    } else {
      virtuosoRef.current?.scrollToIndex(10);
    }
  }, [displayMessages]);

  return (
    <div
      className="flex relative flex-col flex-grow overflow-auto bg-chat-bg"
      ref={chatMessagesRef}
    >
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
            <Virtuoso ref={virtuosoRef} data={displayMessages} />
            {displayMessages.map((message, index) => {
              // TODO add page index
              const user = foundUser(message.userId);
              if (index === 10) {
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
              }

              if (index === displayMessages.length - 1) {
                console.log("first ref");
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
              }
              return (
                <Message
                  deleteCallback={handleDeletingMessage}
                  editCallback={handleEditMessage}
                  message={message}
                  messageIndex={index}
                  pageIndex={0}
                  username={user?.username ?? "Unknown"}
                  key={message.messageId}
                ></Message>
              );
            })}
            {/* <div ref={bottomElem}>end</div> */}
          </>

          // chatMessages?.pages.map((_, index, pages) => {
          //   if (index === 0) {
          //     return (
          //       <Messages
          //         editCallback={handleEditMessage}
          //         deleteCallback={handleDeletingMessage}
          //         key={`messages-${index}`}
          //         groupId={groupId}
          //         messages={pages[pages.length - 1 - index]?.data}
          //         lastPage={true}
          //         fetchNextPage={fetchNextPage}
          //         pageIndex={pages.length - 1 - index}
          //       ></Messages>
          //     );
          //   } else {
          //     return (
          //       <Messages
          //         editCallback={handleEditMessage}
          //         deleteCallback={handleDeletingMessage}
          //         key={`messages-${index}`}
          //         groupId={groupId}
          //         messages={pages[pages.length - 1 - index]?.data}
          //         pageIndex={pages.length - 1 - index}
          //       ></Messages>
          //     );
          //   }
          // })
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
