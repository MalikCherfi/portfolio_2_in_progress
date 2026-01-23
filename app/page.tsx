"use client";

import { Canvas } from "@react-three/fiber";
import Scene from "../components/Scene";
import { useCubeStore } from "@/stores/cubeStore";
import { RotateCcw, ArrowLeft } from "lucide-react";
import * as THREE from "three";
import { Stats } from "@react-three/drei";

export default function Home() {
  const setRotate = useCubeStore((state) => state.setRotate);
  const zoomCamera = useCubeStore((state) => state.zoomCamera);
  const setZoomCamera = useCubeStore((state) => state.setZoomCamera);
  const setZoomDone = useCubeStore((state) => state.setZoomDone);

  return (
    <div className="w-screen h-screen bg-gradient-to-t from-[#CE6A6B] to-[#EBACA2]">
      <div className="absolute top-5 left-5 z-10 flex gap-2">
        {!zoomCamera && (
          <button
            onClick={() => setRotate({ reset: true, target_face: false })}
            className="p-3 rounded-full bg-white/70 hover:bg-white shadow-md"
          >
            <RotateCcw size={22} />
          </button>
        )}

        {zoomCamera && (
          <button
            onClick={() => {
              setZoomDone(false);

              setTimeout(() => {
                setZoomCamera(false);
              }, 1000);
            }}
            className="p-3 rounded-full bg-white/70 hover:bg-white shadow-md"
          >
            <ArrowLeft size={22} />
          </button>
        )}
      </div>

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
        <Stats />
        <Scene />
      </Canvas>
    </div>
  );
}
