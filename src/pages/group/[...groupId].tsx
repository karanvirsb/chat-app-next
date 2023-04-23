import ChannelContainer from "@/Components/ChannelContainer/ChannelContainer";
import ScrollWrapper from "@/Components/ScrollWrapper/ScrollWrapper";
import React, { useState } from "react";
import GroupChat from "./Components/GroupChat";
import GroupTopBar from "./Components/GroupTopBar";
import GroupUsers from "./Components/GroupUsers";
import { useSearchParams } from "next/navigation";
import { useAppSelector } from "@/Hooks/reduxHooks";
import GroupSidebarInfo from "./Components/GroupSidebarInfo";
import { Layout } from "@/Components/Layout";

export default function GroupChannel() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(true);
  const searchParams = useSearchParams();
  const groupId = searchParams.get("groupId") ?? "";
  const isSideBarOpen = useAppSelector((state) => state.sideBarReducer.open);
  return (
    <Layout>
      {isSideBarOpen && (
        <GroupSidebarInfo
          groupId={searchParams.get("groupId") ?? ""}
        ></GroupSidebarInfo>
      )}
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
    </Layout>
  );
  function toggleUserMenu() {
    setIsUserMenuOpen((prev) => !prev);
  }
}
