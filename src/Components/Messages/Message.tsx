import dayjs from "dayjs";
import React, { FormEvent, forwardRef, useRef, useState } from "react";

import { IMessage } from "../../Hooks/groupChatHooks";

type props = {
  message: IMessage;
  username: string | undefined;
  editCallback: ({
    messageId,
    updateValue,
    pageIndex,
    messageIndex,
  }: {
    messageId: string;
    updateValue: string;
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
  messageIndex: number;
  pageIndex: number;
};

const Message = forwardRef(function (
  {
    message,
    username,
    editCallback,
    deleteCallback,
    messageIndex,
    pageIndex,
  }: props,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const [editting, setEditting] = useState(false);
  const messageRef = useRef<HTMLInputElement>(null);
  return (
    <div
      key={message.messageId}
      ref={ref}
      className="flex flex-col gap-2 py-2 px-4 rounded-md hover:bg-[#2A303C] group relative"
    >
      <div className="flex items-center gap-4">
        <span className="font-semibold text-white">
          {username ?? "Could not find username."}
        </span>
        <span className="text-sm text-[#ABABAB]">
          {dayjs(message.dateCreated).format("L LTS")}
        </span>
        <span className="italic">
          {message.dateModified != null ? "Edited" : null}
        </span>
      </div>
      {/* <p className="text-[#D9D9D9]">{message.text}</p> */}
      {editting ? (
        <form className="w-full" onSubmit={handleEditMessageSubmit}>
          <input
            className="w-full bg-[#2A303C] text-white p-2 outline outline-1 outline-gray-500 rounded-md"
            defaultValue={message.text}
            ref={messageRef}
          ></input>
        </form>
      ) : (
        <p className="text-[#D9D9D9]">{message.text}</p>
      )}

      <div className="absolute -top-3 gap-3 right-0 hidden p-2 rounded-md group-hover:flex bg-[#1F242D] drop-shadow-sm">
        {/* edit btn */}
        <button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 hover:text-yellow-200"
            onClick={() => {
              setEditting(true);
              messageRef.current?.focus({ preventScroll: true });
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            />
          </svg>
        </button>

        {/* Trash can */}
        <button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 hover:text-red-200"
            onClick={handleDeleteMessage}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
        </button>
      </div>
    </div>
  );

  function handleEditMessageSubmit(e: FormEvent) {
    e.preventDefault();
    // callback
    if (messageRef.current !== null) {
      editCallback({
        messageId: message.messageId,
        updateValue: messageRef.current.value,
        pageIndex,
        messageIndex,
      });

      messageRef.current.blur;
      setEditting(false);
    }
  }

  function handleDeleteMessage() {
    deleteCallback({
      messageId: message.messageId,
      messageIndex: messageIndex,
      pageIndex,
    });
  }
});
export default Message;
