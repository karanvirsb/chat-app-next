import { useEffect, useState } from "react";

export function useGetBoundingClientRect({
  ref,
}: {
  ref: React.MutableRefObject<HTMLDivElement | null>;
}) {
  const [position, setPosition] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });

  useEffect(() => {
    setPosition((prev) => {
      const refPosition = ref?.current?.getBoundingClientRect();
      return {
        ...prev,
        top: refPosition?.top ?? 0,
        left: refPosition?.left ?? 0,
        right: refPosition?.right ?? 0,
        bottom: refPosition?.bottom ?? 0,
      };
    });
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const handleOnChange = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        const elem = ref?.current?.getBoundingClientRect() ?? null;
        if (elem) {
          setPosition((prev) => {
            return {
              ...prev,
              top: elem.top,
              bottom: elem.bottom,
              left: elem.left,
              right: elem.right,
            };
          });
        }
      }, 500);
    };

    window.addEventListener("resize", handleOnChange);

    return () => {
      window.removeEventListener("resize", handleOnChange);
      clearTimeout(timer);
    };
  }, []);

  return position;
}
