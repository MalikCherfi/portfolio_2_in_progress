"use client";

import { Canvas } from "@react-three/fiber";
import Scene from "../components/Scene";
import { useCubeStore } from "@/stores/cubeStore";
import { RotateCcw } from "lucide-react";
import * as THREE from "three";

export default function Home() {
  const setReset = useCubeStore((state) => state.setReset);

  return (
    <div className="w-screen h-screen">
      <div className="absolute top-5 left-5 z-10 flex gap-2">
        <button
          onClick={() => setReset(true)}
          className="p-3 rounded-full bg-white/70 hover:bg-white shadow-md"
        >
          <RotateCcw size={22} />
        </button>
      </div>
      <Canvas
        shadows
        camera={{ position: [0, 1, 20], fov: 45 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        onCreated={({ gl }) => {
          gl.toneMappingExposure = 1.2;
        }}
        dpr={[1, 2]} // performance
        style={{ background: "#CE6A6B" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
