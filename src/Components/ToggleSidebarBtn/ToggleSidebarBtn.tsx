import React from "react";
import { useAppSelector, useAppDispatch } from "../../Hooks/reduxHooks";
import { setSideBarClosed, setSideBarOpen } from "@/Redux/slices/sideBarSlice";
import MenuBtn from "../MenuBtn/MenuBtn";

export default function ToggleSidebarBtn() {
  const isSideBarOpen = useAppSelector((state) => state.sideBarReducer.open);
  const dispatch = useAppDispatch();
  return (
    <>
      <button className="md:hidden" onClick={toggleSideBar}>
        {/* DESKTOP */}
        {isSideBarOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 hover:text-black sm:hidden"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 hover:text-black sm:hidden"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
            />
          </svg>
        )}
      </button>
      <MenuBtn></MenuBtn>
    </>
  );

  function toggleSideBar() {
    if (isSideBarOpen) {
      dispatch(setSideBarClosed());
    } else {
      dispatch(setSideBarOpen());
    }
  }
}
