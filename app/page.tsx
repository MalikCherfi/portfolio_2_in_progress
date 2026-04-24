"use client";

import { Canvas } from "@react-three/fiber";
import Scene from "../components/Scene";
import { Buttons } from "../components/Buttons";
import * as THREE from "three";
import { Stats } from "@react-three/drei";
import SceneReadyWatcher from "../components/SceneReadyWatcher";
import Loader from "../components/Loader";
import { useState, useCallback } from "react";
import { useCubeStore } from "@/stores/cubeStore";

// Dans THEMES de page.tsx
const THEMES = [
  {
    from: "#CE6A6B",
    to: "#EBACA2",
    cube: "#B6465F",
    geo: ["#B6465F", "#CE6A6B"],
  },
  {
    name: "Bordeaux",
    from: "#8B3A5A",
    to: "#C48AA4",
    cube: "#9c335f",
    geo: ["#9c335f", "#8B3A5A"],
  },
  {
    name: "Terracotta",
    from: "#C1614F",
    to: "#E8A98A",
    cube: "#c6513c",
    geo: ["#c6513c", "#C1614F"],
  },
];

export default function Home() {
  const [currentTheme, setCurrentTheme] = useState(0);
  const [nextTheme, setNextTheme] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);
  const setCubeColor = useCubeStore((state) => state.setCubeColor);
  const setGeoColors = useCubeStore((state) => state.setGeoColors);

  const changeTheme = useCallback(() => {
    if (animating) return;
    const next = (currentTheme + 1) % THEMES.length;
    setNextTheme(next);
    setAnimating(true);
    setCubeColor(THEMES[next].cube);
    setGeoColors(THEMES[next].geo);
  }, [animating, currentTheme, setCubeColor, setGeoColors]);

  const handleAnimationEnd = useCallback(() => {
    if (nextTheme === null) return;
    setCurrentTheme(nextTheme);
    setNextTheme(null);
    setAnimating(false);
  }, [nextTheme]);

  const cur = THEMES[currentTheme];
  const nxt = nextTheme !== null ? THEMES[nextTheme] : null;

  return (
    <div className="w-screen h-screen relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to top, ${cur.from}, ${cur.to})`,
        }}
      />

      {nxt && (
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, ${nxt.from}, ${nxt.to})`,
            clipPath: "circle(0% at 50% 50%)",
            animation:
              "ripple-expand 3000ms cubic-bezier(0.4, 0, 0.2, 1) forwards",
          }}
          onAnimationEnd={handleAnimationEnd}
        />
      )}

      <button
        onClick={changeTheme}
        disabled={animating}
        className="absolute bottom-6 right-6 z-50 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium border border-white/30 hover:bg-white/30 transition-colors disabled:opacity-50"
      >
        Changer couleurs
      </button>

      <style>{`
        @keyframes ripple-expand {
          from { clip-path: circle(0% at 50% 50%); }
          to   { clip-path: circle(150% at 50% 50%); }
        }
      `}</style>

      <Loader />
      <Buttons />
      <Canvas
        style={{ touchAction: "none", position: "absolute", inset: 0 }}
        shadows={false}
        camera={{ position: [0, 0, 20], fov: 45 }}
        gl={{
          antialias: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
          outputColorSpace: THREE.SRGBColorSpace,
          powerPreference: "high-performance",
          stencil: false,
          preserveDrawingBuffer: false,
        }}
        dpr={[1, 2]}
      >
        <SceneReadyWatcher />
        <Stats />
        <Scene />
      </Canvas>
    </div>
  );
}
