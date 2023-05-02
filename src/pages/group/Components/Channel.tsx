import React, { useState } from "react";

import { ChannelContextMenu } from "@/Components/ContextMenu/ChannelContextMenu";

type props = {
  channelName: string;
  channelId: string;
  active?: boolean;
  displayDeleteChannelModal: ({ channelId }: { channelId: string }) => void;
};

export function Channel({
  channelName,
  channelId,
  active,
  displayDeleteChannelModal,
}: props) {
  const [openContextMenu, setOpenContextMenu] = useState(false);
  return (
    <li
      className="cursor-pointer opacity-80 relative"
      key={channelName + channelId}
      onContextMenu={(e) => {
        e.preventDefault();
        setOpenContextMenu(true);
      }}
    >
      {active ? <span className="mr-2">#</span> : null}
      {channelName}

      <ChannelContextMenu
        isOpen={openContextMenu}
        setIsOpen={setOpenContextMenu}
        channelId={channelId}
        deleteCb={() =>
          displayDeleteChannelModal({
            channelId,
          })
        }
      />
    </li>
  );
}