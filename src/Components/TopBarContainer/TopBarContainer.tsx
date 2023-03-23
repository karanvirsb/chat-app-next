import React from "react";

type props = {
  children: JSX.Element;
};

export default function TopBarContainer({ children }: props) {
  return (
    <div className="flex items-center justify-between flex-none w-full h-16 px-4 py-2 font-semibold text-white border-b border-r-0 bg-chat-bg border-groupBar-bg drop-shadow-md">
      {children}
    </div>
  );
}
