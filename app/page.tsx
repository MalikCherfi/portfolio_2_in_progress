"use client";

import { Canvas } from "@react-three/fiber";
import Scene from "../components/Scene";
import { useState } from "react";

export default function Home() {
  const [resetCubePosition, setResetCubePosition] = useState(false);

  return (
    <div className="w-screen h-screen">
      <div className="absolute top-5 left-5 z-10 flex gap-2">
        <button onClick={() => setResetCubePosition(true)}>
          Reset
        </button>
      </div>
      <Canvas
        shadows
        camera={{ position: [0, 1, 14], fov: 45 }}
        gl={{ antialias: true }}
        style={{ background: "#BED3C3" }}
      >
        <Scene
          resetCubePosition={resetCubePosition}
          setResetCubePosition={setResetCubePosition}
        />
      </Canvas>
    </div>
  );
}
