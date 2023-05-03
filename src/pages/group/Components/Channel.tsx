import React, { useState } from "react";

import { ChannelContextMenu } from "@/Components/ContextMenu/ChannelContextMenu";

type props = {
  channelName: string;
  channelId: string;
  active?: boolean;
  setActive: React.Dispatch<React.SetStateAction<string>>;
  displayDeleteChannelModal: ({ channelId }: { channelId: string }) => void;
};

export function Channel({
  channelName,
  channelId,
  active,
  displayDeleteChannelModal,
  setActive,
}: props) {
  const [openContextMenu, setOpenContextMenu] = useState(false);
  return (
    <li
      onClick={() => {
        !active && setActive(channelId);
      }}
      className="cursor-pointer opacity-80 relative"
      key={"li-" + channelId}
      onContextMenu={(e) => {
        e.preventDefault();
        setOpenContextMenu(true);
      }}
    >
      {active ? <span className="mr-2">#</span> : null}
      {channelName}

      <ChannelContextMenu
        key={channelId + "-context"}
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
