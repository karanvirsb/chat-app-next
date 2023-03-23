import ChannelContainer from "@/Components/ChannelContainer/ChannelContainer";
import ScrollWrapper from "@/Components/ScrollWrapper/ScrollWrapper";
import { useAppSelector } from "@/Hooks/reduxHooks";
import React, { useState } from "react";
import GroupChat from "./Components/GroupChat";
import GroupSidebarInfo from "./Components/GroupSidebarInfo";
import GroupTopBar from "./Components/GroupTopBar";
import GroupUsers from "./Components/GroupUsers";

type props = {
  groupId: string;
};

export default function GroupChannel({ groupId }: props) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState("-1"); // TODO this is for when a different channel is selected for the chat
  const isSideBarOpen = useAppSelector((state) => state.sideBarReducer.open);

  return (
    <>
      {isSideBarOpen && (
        <GroupSidebarInfo
          groupId={groupId}
          setSelectedChannel={setSelectedChannel}
        ></GroupSidebarInfo>
      )}
      <ChannelContainer>
        <>
          <GroupTopBar
            isUserMenuOpen={isUserMenuOpen}
            toggleUserMenu={toggleUserMenu}
            selectedChannel={selectedChannel}
            groupId={groupId}
          ></GroupTopBar>
          <ScrollWrapper>
            <GroupChat
              channelId={selectedChannel}
              groupId={groupId}
            ></GroupChat>
            <>
              {isUserMenuOpen ? (
                <GroupUsers
                  isUserMenuOpen={isUserMenuOpen}
                  toggleUserMenu={toggleUserMenu}
                  groupId={groupId}
                ></GroupUsers>
              ) : null}
            </>
          </ScrollWrapper>
        </>
      </ChannelContainer>
    </>
  );
  function toggleUserMenu() {
    setIsUserMenuOpen((prev) => !prev);
  }
}
