import React, { useState } from "react";

import ChannelContainer from "../../../Components/ChannelContainer/ChannelContainer";
import ScrollWrapper from "../../../Components/ScrollWrapper/ScrollWrapper";
import { useAppSelector } from "../../../Hooks/reduxHooks";
import useLocalStorage from "../../../Hooks/useLocalStorage";
import GroupChat from "./GroupChat";
import GroupSidebarInfo from "./GroupSidebarInfo";
import GroupTopBar from "./GroupTopBar";
import GroupUsers from "./GroupUsers";

type props = {
  groupId: string;
};

export default function GroupChannel({ groupId }: props) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState(""); // TODO this is for when a different channel is selected for the chat
  const isSideBarOpen = useAppSelector((state) => state.sideBarReducer.open);

  return (
    <>
      {isSideBarOpen && <GroupSidebarInfo groupId={groupId}></GroupSidebarInfo>}
      <ChannelContainer>
        <>
          <GroupTopBar
            isUserMenuOpen={isUserMenuOpen}
            toggleUserMenu={toggleUserMenu}
          ></GroupTopBar>
          <ScrollWrapper>
            <GroupChat groupId={groupId}></GroupChat>
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
