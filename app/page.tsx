"use client";

import { Canvas } from "@react-three/fiber";
import Scene from "../components/Scene";
import { Buttons } from "../components/Buttons";
import * as THREE from "three";
import { Stats } from "@react-three/drei";
import SceneReadyWatcher from "../components/SceneReadyWatcher";
import Loader from "../components/Loader";

export default function Home() {
  return (
    <div className="w-screen h-screen bg-gradient-to-t from-[#CE6A6B] to-[#EBACA2]">
      <Loader />
      <Buttons />
      <Canvas
        style={{ touchAction: "none" }}
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
