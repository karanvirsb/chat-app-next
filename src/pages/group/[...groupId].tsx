import ChannelContainer from "@/Components/ChannelContainer/ChannelContainer";
import ScrollWrapper from "@/Components/ScrollWrapper/ScrollWrapper";
import React, { useState } from "react";
import GroupChat from "./Components/GroupChat";
import GroupTopBar from "./Components/GroupTopBar";
import GroupUsers from "./Components/GroupUsers";
import { useSearchParams } from "next/navigation";

export default function GroupChannel() {
  const searchParams = useSearchParams();
  const groupId = searchParams.get("groupId") ?? "";
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(true);

  return (
    <ChannelContainer>
      <>
        <GroupTopBar
          isUserMenuOpen={isUserMenuOpen}
          toggleUserMenu={toggleUserMenu}
          groupId={groupId}
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
  );
  function toggleUserMenu() {
    setIsUserMenuOpen((prev) => !prev);
  }
}
