import React from "react";

import { useAppSelector } from "../../Hooks/reduxHooks";

type props = {
  children: JSX.Element;
};

export default function SidebarInfo({ children }: props) {
  const isSideBarOpen = useAppSelector((state) => state.sideBarReducer.open);

  return (
    <div
      className={`flex flex-col z-10 min-w-[250px] md:fixed md:top-0 md:left-[72px] md:bottom-0 md:z-[5] ${
        isSideBarOpen ? "md:translate-x-0" : "md:-translate-x-[100%]"
      } `}
    >
      {children}
    </div>
  );
}
