import React, { useEffect } from "react";

import useComponentVisible from "@/Hooks/useComponentVisible";

type props = {
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
// TODO when component is not clicked, it disappears

export function ContextMenu({ children, setIsOpen, isOpen }: props) {
  const { isComponentVisible, ref, setIsComponentVisible } =
    useComponentVisible();

  useEffect(() => {
    setIsComponentVisible(isOpen)
  }, [])

  useEffect(() => {
    let timer: NodeJS.Timeout;
    timer = setTimeout(() => {
      if (!isComponentVisible && isOpen) {
        setIsOpen(false);
      }
    }, 100)
    return () => clearTimeout(timer);
  }, [isComponentVisible, setIsOpen, isOpen]);

  useEffect(() => {
    const handleEscPress = (event: KeyboardEvent) => {
      if (event.code === "Escape") {
        setIsComponentVisible(false);
      }
    };

    document.addEventListener("keydown", handleEscPress);
    return () => {
      document.removeEventListener("keydown", handleEscPress);
    };
  }, [setIsComponentVisible]);

  return (
    <ul
      className={`menu opacity-100 absolute left-[100%] top-0 bg-base-100  p-2 rounded-md`}
      ref={ref}
    >
      {children}
    </ul>
  );
}
