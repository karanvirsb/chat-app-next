import React, { MouseEventHandler, useState } from "react";

type props = {
  children: any;
  title: string;
  clickEvent?: () => void;
};

const Collapse = ({ children, title, clickEvent }: props) => {
  const [clicked, setClicked] = useState(false);
  return (
    // TODO add transition time
    <>
      <div className="grid grid-cols-[1fr_3fr_1fr] items-center gap-2 w-full py-4 px-2">
        <span
          className="text-md flex items-center justify-self-end self-start"
          onClick={() => {
            setClicked((prev) => !prev);
          }}
        >
          {clicked ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-6 opacity-90 cursor-pointer hover:opacity-80"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-6 opacity-90 cursor-pointer"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          )}
        </span>
        <div className="justify-self-start self-start flex flex-col">
          <p
            className="tracking-wide cursor-pointer hover:opacity-80"
            onClick={() => {
              setClicked((prev) => !prev);
            }}
          >
            {title}
          </p>
          {clicked && children}
        </div>
        {/* TODO hover color */}
        {clickEvent != null ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-6 justify-self-center self-start opacity-90 cursor-pointer hover:opacity-80"
            onClick={() => clickEvent()}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        ) : null}
      </div>
    </>
  );
};

export default Collapse;
