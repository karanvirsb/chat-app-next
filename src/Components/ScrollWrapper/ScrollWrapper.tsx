import React from "react";

type props = {
  children: JSX.Element | JSX.Element[];
};

// this will wrap around flex containers to allow overflow scroll
function ScrollWrapper({ children }: props) {
  return <div className="flex flex-grow min-h-0">{children}</div>;
}

export default ScrollWrapper;
