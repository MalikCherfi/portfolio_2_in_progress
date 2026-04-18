// components/SceneReadyWatcher.tsx
import { useFrame, useThree } from "@react-three/fiber";
import { useLoaderStore } from "@/stores/loaderStore";
import { useRef } from "react";

export default function SceneReadyWatcher() {
  const { gl } = useThree();
  const setReady = useLoaderStore((s) => s.setReady);
  const frameCount = useRef(0);
  const done = useRef(false);

  useFrame(() => {
    if (done.current) return;

    frameCount.current += 1;

    if (frameCount.current >= 10 && gl.getContext()) {
      done.current = true;
      setReady();
    }
  });

  return null;
}
