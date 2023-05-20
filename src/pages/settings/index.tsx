import React, { useState } from "react";

import { useAppSelector } from "../../Hooks/reduxHooks";
import AccountTab from "./components/AccountTab";
import Sidebar from "./components/Sidebar";

const tabs = ["Accounts"];
export default function Settings() {
  const [activeIndex, setActiveIndex] = useState(0);
  const isSideBarOpen = useAppSelector((state) => state.sideBarReducer.open);

  return (
    <div className="flex flex-grow w-full ">
      <Sidebar
        tabs={tabs}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
      ></Sidebar>
      <div
        className={`w-full ${
          isSideBarOpen ? "md:translate-x-[250px]" : "md:translate-x-0"
        }`}
      >
        {activeIndex === 0 && <AccountTab></AccountTab>}
      </div>
    </div>
  );
}
