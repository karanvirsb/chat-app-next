import React from "react";

// TODO create one chat component
export default function MeChat() {
  return (
    <div className="bg-chat-bg flex flex-col flex-grow h-full">
      <div className="flex-grow p-4 w-full ">
        {/* TODO Create chat component */}
      </div>
      <div className="input-group p-4">
        <input
          type="text"
          placeholder="Send a message"
          className="input input-bordered bg-[#2a303c] w-full focus:outline-none"
        />
      </div>
    </div>
  );
}
