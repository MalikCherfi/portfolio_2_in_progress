import { Text } from "@react-three/drei";
import { useState, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { rotateToFace } from "@/utils/rotateToFace";
import { useCubeStore } from "@/stores/cubeStore";
const CubeText = ({ targetQuaternion }) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragThreshold = 5;

  const { setRotate, setZoomCamera, setZoomDone, zoomCamera } = useCubeStore();

  const [fontSize, setFontSize] = useState(0.42);
  const [targetFontSize, setTargetFontSize] = useState(0.42);

  const start = useRef({ x: 0, y: 0 });

  const onPointerDown = (e) => {
    start.current = { x: e.clientX, y: e.clientY };
    setIsDragging(false);
  };

  const onPointerMove = (e) => {
    const dx = e.clientX - start.current.x;
    const dy = e.clientY - start.current.y;
    if (Math.sqrt(dx * dx + dy * dy) > dragThreshold) setIsDragging(true);
  };

  const onClick = (face) => (e) => {
    e.stopPropagation();
    if (!isDragging) {
      rotateToFace({ face, targetQuaternion, setRotate });
      setRotate({ reset: false, target_face: true, face });
      setZoomCamera(true);
      setTimeout(() => setZoomDone(true), 1500);
    }
  };

  // responsive base size
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      let base = 0.42;
      if (w < 600) base = 0.28;
      else if (w < 900) base = 0.38;
      setTargetFontSize(base);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // smooth interpolation
  useFrame(() => {
    const base = zoomCamera ? targetFontSize * 0.6 : targetFontSize;
    setFontSize((f) => f + (base - f) * 0.1);
  });

  const fontProps = {
    font: "/fonts/Iceberg-Regular.ttf",
    fontSize,
    color: "#ffffff",
    anchorX: "center",
    anchorY: "middle",
  };

  return (
    <>
      <Text
        position={[0, 0, 2.61]}
        {...fontProps}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onClick={onClick("front")}
      >
        WELCOME
      </Text>

      <Text
        position={[0, 0, -2.61]}
        rotation={[0, Math.PI, 0]}
        {...fontProps}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onClick={onClick("back")}
      >
        CONTACT
      </Text>

      <Text
        position={[2.61, 0, 0]}
        rotation={[0, -Math.PI / 2 + Math.PI, 0]}
        {...fontProps}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onClick={onClick("right")}
      >
        SKILLS
      </Text>

      <Text
        position={[-2.61, 0, 0]}
        rotation={[0, Math.PI / 2 + Math.PI, 0]}
        {...fontProps}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onClick={onClick("left")}
      >
        ABOUT ME
      </Text>
    </>
  );
};

export default CubeText;
