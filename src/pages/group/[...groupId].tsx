import { useSearchParams } from "next/navigation";
import React, { useRef, useState } from "react";

import ChannelContainer from "@/Components/ChannelContainer/ChannelContainer";
import { Layout } from "@/Components/Layout";
import ScrollWrapper from "@/Components/ScrollWrapper/ScrollWrapper";
import { useAppSelector } from "@/Hooks/reduxHooks";

import GroupChat from "./Components/GroupChat";
import GroupSidebarInfo from "./Components/GroupSidebarInfo";
import { GroupTopBar } from "./Components/GroupTopBar";
import GroupUsers from "./Components/GroupUsers";

export default function GroupChannel() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(true);
  const searchParams = useSearchParams();
  const groupId = searchParams.get("groupId") ?? "";
  const topBarRef = useRef<HTMLDivElement | null>(null);
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
            ref={topBarRef}
          ></GroupTopBar>
          <ScrollWrapper>
            <GroupChat groupId={groupId} topBarRef={topBarRef}></GroupChat>
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
