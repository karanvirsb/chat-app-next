import React from "react";

import ChannelContainer from "../../../Components/ChannelContainer/ChannelContainer";
import { useAppSelector } from "../../../Hooks/reduxHooks";
import MeChat from "./MeChat";
import MeSideBarInfo from "./MeSideBarInfo";
import MeTopBar from "./MeTopBar";

export default function MeChannel() {
  const isSideBarOpen = useAppSelector((state) => state.sideBarReducer.open);
  return (
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
  );
}
