import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useCanvasStore } from "@/stores/canvasStore";

const CameraController = () => {
  const { camera, gl } = useThree();
  const { isDraggingObject } = useCanvasStore();

  const rotating = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const rotationY = useRef(camera.rotation.y); // ← seulement Y

  useEffect(() => {
    const dom = gl.domElement;

    const down = (e) => {
      rotating.current = true;
      last.current.x = e.clientX;
    };

    const move = (e) => {
      if (!rotating.current || isDraggingObject) return;

      const dx = e.clientX - last.current.x;

      rotationY.current += dx * 0.005; // ← rotation horizontale uniquement

      last.current.x = e.clientX;
    };

    const up = () => {
      rotating.current = false;
    };

    dom.addEventListener("pointerdown", down);
    dom.addEventListener("pointermove", move);
    dom.addEventListener("pointerup", up);

    return () => {
      dom.removeEventListener("pointerdown", down);
      dom.removeEventListener("pointermove", move);
      dom.removeEventListener("pointerup", up);
    };
  }, [gl, isDraggingObject]);

  useFrame(() => {
    if (!isDraggingObject && rotating.current) {
      camera.rotation.y = rotationY.current; // ← verrouillé sur l'horizontale
      camera.rotation.x = 0; // ← au cas où
    }
  });

  return null;
};

export default CameraController;
