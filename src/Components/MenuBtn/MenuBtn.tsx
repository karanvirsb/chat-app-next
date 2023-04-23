import React from "react";

import { setSideBarClosed, setSideBarOpen } from "@/Redux/slices/sideBarSlice";

import { useAppDispatch, useAppSelector } from "../../Hooks/reduxHooks";

function MenuBtn() {
  const dispatch = useAppDispatch();
  const isSideBarOpen = useAppSelector((state) => state.sideBarReducer.open);
  return (
    <button onClick={toggleSideBar}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6 m-md:hidden"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
        />
      </svg>
    </button>
  );

  function toggleSideBar() {
    if (isSideBarOpen) {
      dispatch(setSideBarClosed());
    } else {
      dispatch(setSideBarOpen());
    }
  }
}

export default MenuBtn;
