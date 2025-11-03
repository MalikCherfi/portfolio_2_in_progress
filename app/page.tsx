"use client";

import { Canvas } from "@react-three/fiber";
import Scene from "../components/Scene";

export default function Home() {
  return (
    <div className="w-screen h-screen">
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
