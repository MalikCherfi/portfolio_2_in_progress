// components/Loader.tsx
import { useLoaderStore } from "@/stores/loaderStore";
import { useEffect, useState } from "react";

export default function Loader() {
  const isReady = useLoaderStore((s) => s.isReady);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (isReady) {
      const t = setTimeout(() => setVisible(false), 800);
      return () => clearTimeout(t);
    }
  }, [isReady]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "linear-gradient(to top, #CE6A6B, #EBACA2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: isReady ? 0 : 1,
        transition: "opacity 0.8s ease",
        pointerEvents: isReady ? "none" : "all",
      }}
    >
      <div className="spin-ring">
        <div className="shape sq1" />
        <div className="shape tri1" />
        <div className="shape sq2" />
        <div className="shape tri2" />
      </div>
    </div>
  );
}
