"use client";

import { Canvas } from "@react-three/fiber";
import Scene from "../components/Scene";
import { useCubeStore } from "@/stores/cubeStore";

export default function Home() {
  const setReset = useCubeStore((state) => state.setReset);

  return (
    <div className="w-screen h-screen">
      <div className="absolute top-5 left-5 z-10 flex gap-2">
        <button onClick={() => setReset(true)}>Reset</button>
      </div>
      <Canvas
        shadows
        camera={{ position: [0, 1, 14], fov: 45 }}
        gl={{ antialias: true }}
        style={{ background: "#BED3C3" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
