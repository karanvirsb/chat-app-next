import React from "react";

import Spinner from "../Spinner/Spinner";

type props = {
  text: string;
  onClick: (...args: any) => any;
  classname?: string;
  isLoading?: boolean;
};

export default function BtnCallToAction({
  text,
  onClick,
  classname,
  isLoading,
}: props) {
  return (
    <button
      className={`btn bg-btn-cta  border-none font-bold tracking-wider hover:bg-btn-cta-hover text-white ${classname}`}
      onClick={onClick}
    >
      {isLoading ? <Spinner></Spinner> : text}
    </button>
  );
}
