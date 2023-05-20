import React from "react";

import ChannelContainer from "@/Components/ChannelContainer/ChannelContainer";
import { Layout } from "@/Components/Layout";
import { useAppSelector } from "@/Hooks/reduxHooks";

import MeChat from "./Components/MeChat";
import MeSideBarInfo from "./Components/MeSideBarInfo";
import MeTopBar from "./Components/MeTopBar";

export default function Me() {
  const isSideBarOpen = useAppSelector((state) => state.sideBarReducer.open);
  return (
    <Layout>
      <>
        {isSideBarOpen && <MeSideBarInfo></MeSideBarInfo>}
        <ChannelContainer>
          <>
            <MeTopBar></MeTopBar>
            <div className="flex flex-grow">
              <MeChat></MeChat>
            </div>
          </>
        </ChannelContainer>
      </>
    </Layout>
  );
}
