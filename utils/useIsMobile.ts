import { useState, useEffect } from "react";

export const useIsMobile = (maxWidth = 1000) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const check = () => setIsMobile(window.innerWidth <= maxWidth);
    check();

    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [maxWidth]);

  return isMobile;
};
