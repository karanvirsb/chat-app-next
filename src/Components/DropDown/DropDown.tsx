import React, { useEffect, useState } from "react";

import useComponentVisible from "../../Hooks/useComponentVisible";

type props = {
  direction?: "dropdown-top" | "dropdown-left" | "dropdown-right" | "";
  align?: "dropdown-end" | "";
  hover?: boolean;
  btnClass?: string;
  dropDownClass?: string;
  listClass?: string;
  btnChildren: JSX.Element | string;
  children?: JSX.Element;
  symbol?: boolean;
};

export default function DropDown({
  direction = "",
  align = "",
  hover = false,
  btnClass = "",
  dropDownClass = "",
  listClass = "",
  btnChildren,
  children,
  symbol,
}: props) {
  const [clicked, setClicked] = useState(false);
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible();
  const symbolClass = symbol && "flex justify-between w-full";

  useEffect(() => {
    const handleEscPress = (event: KeyboardEvent) => {
      if (event.code === "Escape") {
        setIsComponentVisible(false);
        setClicked(false);
      }
    };

    document.addEventListener("keydown", handleEscPress);
    return () => {
      document.removeEventListener("keydown", handleEscPress);
    };
  }, []);

  useEffect(() => {
    if (!isComponentVisible) {
      setClicked(false);
    }
  }, [isComponentVisible]);

  return (
    <div
      className={`dropdown ${direction} ${align} ${
        hover && "dropdown-hover"
      } ${dropDownClass} mt-auto`}
    >
      <label
        tabIndex={0}
        className={`${
          btnClass
            ? `${btnClass} ${symbolClass}`
            : `btn btn-circle m-1 ${symbolClass}`
        }`}
        onClick={toggleMenu}
      >
        {btnChildren}
        {symbol &&
          (clicked ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          ))}
      </label>

      {isComponentVisible && (
        <ul
          tabIndex={1}
          className={`dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 ${listClass}`}
          ref={ref}
        >
          {children}
        </ul>
      )}
    </div>
  );

  function toggleMenu() {
    if (!clicked) {
      setClicked(true);
      setIsComponentVisible(true);
    } else {
      setClicked(false);
    }
  }
}
