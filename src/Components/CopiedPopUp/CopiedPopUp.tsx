import React, { useEffect } from "react";

type props = {
  copied: boolean;
  setCopied: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function CopiedPopUp({ copied, setCopied }: props) {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (copied) {
      timer = setTimeout(() => {
        setCopied(false);
      }, 1500);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [copied]);

  return copied ? (
    <div className=" bg-[#121212] fixed top-1/2 left-1/2 font-semibold p-4 rounded-md opacity-80 z-50 ">
      Copied
    </div>
  ) : null;
}
