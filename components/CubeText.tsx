import { Text } from "@react-three/drei";
import { useState, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { rotateToFace } from "@/utils/rotateToFace";
import { useCubeStore } from "@/stores/cubeStore";
const CubeText = ({ targetQuaternion }) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragThreshold = 5;
  const { setRotate, setZoomCamera } = useCubeStore();
  const [fontSize, setFontSize] = useState(0.42); // taille initiale
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
      setZoomCamera(true); // zoom caméra vers 5
    }
  };

  // Détecter la largeur de l'écran
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 600) setTargetFontSize(0.25);
      else if (w < 900) setTargetFontSize(0.35);
      else setTargetFontSize(0.42);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Interpolation fluide chaque frame
  useFrame(() => {
    setFontSize((f) => f + (targetFontSize - f) * 0.1);
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
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onClick={onClick("front")}
        {...fontProps}
      >
        WELCOME
      </Text>
      <Text
        position={[0, 0, -2.61]}
        rotation={[0, Math.PI, 0]}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onClick={onClick("back")}
        {...fontProps}
      >
        CONTACT
      </Text>
      <Text
        position={[2.61, 0, 0]}
        rotation={[0, -Math.PI / 2 + Math.PI, 0]}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onClick={onClick("right")}
        {...fontProps}
      >
        SKILLS
      </Text>
      <Text
        position={[-2.61, 0, 0]}
        rotation={[0, Math.PI / 2 + Math.PI, 0]}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onClick={onClick("left")}
        {...fontProps}
      >
        ABOUT ME
      </Text>
    </>
  );
};

export default CubeText;
