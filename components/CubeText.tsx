import { Text } from "@react-three/drei";
import { useState, useRef } from "react";
import { rotateToFace } from "@/utils/rotateToFace";
import { useCubeStore } from "@/stores/cubeStore";
const CubeText = ({ targetQuaternion }) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragThreshold = 5;
  const { setRotate, setZoomCamera } = useCubeStore();

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

  return (
    <>
      <Text
        position={[0, 0, 2.61]}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onClick={onClick("front")}
        font="/fonts/Iceberg-Regular.ttf"
        fontSize={0.42}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        WELCOME
      </Text>
      <Text
        position={[0, 0, -2.61]}
        rotation={[0, Math.PI, 0]}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onClick={onClick("back")}
        font="/fonts/Iceberg-Regular.ttf"
        fontSize={0.42}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        CONTACT
      </Text>
      <Text
        position={[2.61, 0, 0]}
        rotation={[0, -Math.PI / 2 + Math.PI, 0]}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onClick={onClick("right")}
        font="/fonts/Iceberg-Regular.ttf"
        fontSize={0.42}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        SKILLS
      </Text>
      <Text
        position={[-2.61, 0, 0]}
        rotation={[0, Math.PI / 2 + Math.PI, 0]}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onClick={onClick("left")}
        font="/fonts/Iceberg-Regular.ttf"
        fontSize={0.42}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        ABOUT ME
      </Text>
    </>
  );
};

export default CubeText;
