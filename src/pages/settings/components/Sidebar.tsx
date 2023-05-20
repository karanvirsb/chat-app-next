import { useRouter } from "next/navigation";
import React from "react";

import { useAppSelector } from "../../../Hooks/reduxHooks";

type props = {
  tabs: string[];
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
};

export default function Sidebar({ tabs, activeIndex, setActiveIndex }: props) {
  const router = useRouter();
  const isSideBarOpen = useAppSelector((state) => state.sideBarReducer.open);
  return (
    <nav
      className={`flex flex-col items-end bg-groupInfo-bg min-w-[250px] h-screen md:fixed ${
        isSideBarOpen ? "md:translate-x-0" : "md:-translate-x-[100%]"
      }`}
    >
      <button className="mt-4 px-4 self-start md:hidden" onClick={goBackToHome}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.25 9l-3 3m0 0l3 3m-3-3h7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
      <div className="mt-6 flex flex-col items-end w-[75%]">
        <h2 className="mb-4  px-2 text-gray-400 w-full">User Settings</h2>
        <ul className="flex flex-col items-end w-full">
          {tabs.map((tab, index) => {
            if (index === activeIndex) {
              return (
                <li key={tab} className="w-full text-center rounded-md">
                  <a
                    className="tab bg-[#2A303C] rounded-tl-md rounded-bl-md  text-[#DFDFDF] w-full"
                    onClick={() => {
                      setActiveTab(index);
                    }}
                  >
                    {tab}
                  </a>
                </li>
              );
            } else {
              return (
                <li key={tab} className="w-full text-center ">
                  <a
                    className="tab hover:bg-[#343C4B] text-[#DFDFDF] w-full"
                    onClick={() => {
                      setActiveTab(index);
                    }}
                  >
                    {tab}
                  </a>
                </li>
              );
            }
          })}
        </ul>
      </div>
    </nav>
  );

  function goBackToHome() {
    router.back();
  }

  function setActiveTab(index: number) {
    setActiveIndex(() => index);
  }
}
