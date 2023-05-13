import React, { useEffect, useState } from "react";

export function useGetElementSize({
  ref,
}: {
  ref: React.RefObject<HTMLElement | null>;
}) {
  const [sizes, setSizes] = useState<{ width: number; height: number }>();

  useEffect(() => {
    if (!ref.current) return;

    const { width, height } = ref.current.getBoundingClientRect();
    setSizes({ width, height });
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const handleWindowResize = () => {
      if (timer) clearTimeout(timer);

      timer = setTimeout(() => {
        if (!ref.current) return;

        const { width, height } = ref.current.getBoundingClientRect();

        setSizes({ width, height });
      }, 0);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  return sizes;
}
