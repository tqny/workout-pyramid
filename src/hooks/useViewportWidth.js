import { useEffect, useState } from "react";

export function useViewportWidth(defaultWidth = 1200) {
  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window === "undefined" ? defaultWidth : window.innerWidth
  );

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    function onResize() {
      setViewportWidth(window.innerWidth);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return viewportWidth;
}
