import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { useAppDispatch, useAppSelector } from "../../Hooks/reduxHooks";
import { setSideBarClosed } from "../../Redux/slices/sideBarSlice";

export default function BottomBar() {
  const [activeTab, setActiveTab] = useState(0);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isSideBarOpen = useAppSelector((state) => state.sideBarReducer.open); // to check if menu button was clicked

  return (
    <nav
      className={`fixed bottom-0 left-0 z-[10] ${
        isSideBarOpen ? "translate-y-0" : "translate-y-[100%]"
      } bg-groupBar-bg flex justify-around min-h-[75px] w-full m-md:hidden`}
    >
      {generateBottomBarButtons().map((tab, index) => {
        if (index === activeTab) {
          return (
            <button
              key={index}
              className="[&>svg]:fill-yellow-300"
              onClick={() => {
                changeActiveTab(index);
              }}
            >
              {tab}
            </button>
          );
        } else {
          return (
            <button
              key={index}
              className="[&>svg]:fill-[#EBEBEB]"
              onClick={() => {
                changeActiveTab(index);
              }}
            >
              {tab}
            </button>
          );
        }
      })}
    </nav>
  );

  function changeActiveTab(index: number) {
    setActiveTab(() => index);
  }

  function generateBottomBarButtons() {
    return [
      // CHAT ICON
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-8 h-8"
        onClick={goToChats}
        key="chat-icon"
      >
        <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z" />
        <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z" />
      </svg>,
      // USER ICON
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-8 h-8"
        onClick={goToFriends}
        key="user-icon"
      >
        <path
          fillRule="evenodd"
          d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z"
          clipRule="evenodd"
        />
        <path d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z" />
      </svg>,
      // SEARCH ICON
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-8 h-8"
        onClick={goToSearch}
        key="search-icon"
      >
        <path
          fillRule="evenodd"
          d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"
          clipRule="evenodd"
        />
      </svg>,
      // ACCOUNT ICON
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-8 h-8"
        onClick={goToSettings}
        key="account-icon"
      >
        <path
          fillRule="evenodd"
          d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
          clipRule="evenodd"
        />
      </svg>,
    ];
  }
  function goToChats() {
    if (isSideBarOpen && activeTab === 0) {
      dispatch(setSideBarClosed());
    } else {
      dispatch(setSideBarClosed());
      router.push("/");
    }
  }

  function goToFriends() {
    dispatch(setSideBarClosed());
    router.push("/friends");
  }
  function goToSearch() {
    dispatch(setSideBarClosed());
    router.push("/search");
  }
  function goToSettings() {
    if (isSideBarOpen && activeTab === 3) {
      dispatch(setSideBarClosed());
    } else {
      dispatch(setSideBarClosed());
      router.push("/settings");
    }
  }
}
