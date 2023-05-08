import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef } from "react";

import { groupActions } from "@/Redux/group/groupSlice";
import { IGroupMessage } from "@/server/Features/groupMessage/groupMessage";

// import useGetSession from "../../../Hooks/useGetSession";
import Messages from "../../../Components/Messages/Messages";
import {
  useCreateGroupMessageMutation,
  useEditMessageTextMutation,
  useGetGroupMessagesByChannelIdQuery,
} from "../../../Hooks/groupChatHooks";
import { useAppDispatch } from "../../../Hooks/reduxHooks";
import { setModal } from "../../../Redux/slices/modalSlice";

type props = {
  groupId: string;
};

export default function GroupChat({ groupId }: props): JSX.Element {
  const searchParams = useSearchParams();
  const channelId = searchParams.get("channel") ?? "";
  const messageRef = useRef<null | HTMLInputElement>(null);
  const chatMessagesRef = useRef<null | HTMLDivElement>(null);
  // TODO after inital load need to set dateCreated to last message.
  const { data: chatMessages, fetchNextPage } =
    useGetGroupMessagesByChannelIdQuery({
      channelId,
      dateCreated: new Date(),
      limit: 10,
    });
  // const { mutate: createMessage } = useCreateGroupMessageMutation({ groupId });
  // const { mutate: updateText } = useEditMessageTextMutation({ groupId });

  const dispatch = useAppDispatch();
  const { data: sessionInfo } = useSession();

  // useEffect(() => {
  //   // scroll height gives height of element
  //   // client height gives height of actual element or css height
  //   // so scroll top is the vertical top and max is scrollHeight
  //   if (chatMessagesRef.current !== null) {
  //     const isScrolledToBottom =
  //       chatMessagesRef.current.scrollHeight -
  //         chatMessagesRef.current.clientHeight <=
  //       chatMessagesRef.current.scrollTop + 1;

  //     if (!isScrolledToBottom)
  //       chatMessagesRef.current.scrollTop =
  //         chatMessagesRef.current.scrollHeight -
  //         chatMessagesRef.current.clientHeight;
  //   }
  // }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (chatMessagesRef.current !== null) {
        chatMessagesRef.current.scrollTop =
          chatMessagesRef.current.scrollHeight -
          chatMessagesRef.current.clientHeight;
      }
      console.log("timeout");
    }, 100);

    return () => clearTimeout(timer);
  }, [channelId]);

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
        ) : chatMessages.pages === undefined ? (
          <p className="text-center text-lg uppercase font-semibold">
            Seems like this is your first message send something awesome! No
            pressure!
          </p>
        ) : (
          chatMessages?.pages.map((_, index, pages) => {
            if (index === 0) {
              return (
                <Messages
                  editCallback={handleEditMessage}
                  deleteCallback={handleDeletingMessage}
                  key={`messages-${index}`}
                  groupId={groupId}
                  messages={pages[pages.length - 1 - index]?.data}
                  lastPage={true}
                  fetchNextPage={fetchNextPage}
                  pageIndex={pages.length - 1 - index}
                ></Messages>
              );
            } else {
              return (
                <Messages
                  editCallback={handleEditMessage}
                  deleteCallback={handleDeletingMessage}
                  key={`messages-${index}`}
                  groupId={groupId}
                  messages={pages[pages.length - 1 - index]?.data}
                  pageIndex={pages.length - 1 - index}
                ></Messages>
              );
            }
          })
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
              dateCreated: new Date(),
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
