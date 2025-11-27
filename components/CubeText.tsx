import { Text } from "@react-three/drei";
import { useState, useRef } from "react";

const CubeText = () => {
  const [isDragging, setIsDragging] = useState(false);
  const dragThreshold = 3; // pixels

  const start = useRef({ x: 0, y: 0 });

  const onPointerDown = (e) => {
    start.current = { x: e.clientX, y: e.clientY };
    setIsDragging(false);
  };

  const onPointerMove = (e) => {
    const dx = e.clientX - start.current.x;
    const dy = e.clientY - start.current.y;
    if (Math.sqrt(dx * dx + dy * dy) > dragThreshold) {
      setIsDragging(true);
    }
  };

  const onClick = (callback) => (e) => {
    e.stopPropagation();
    if (!isDragging) callback(e); // seulement si ce n’était pas un drag
  };

  const radius = 3.5;
  const height = 6;

  // sommets de la base (y = -height/2)
  const basePoints = [
    [-radius, -height / 2, -radius],
    [radius, -height / 2, -radius],
    [radius, -height / 2, radius],
    [-radius, -height / 2, radius],
  ];

  // sommet
  const top = [0, height / 2, 0];

  // Face avant = triangle (top, basePoints[2], basePoints[3])
  const faceVertices = [top, basePoints[2], basePoints[3]];

  // centroid
  const centroid = faceVertices
    .reduce(
      (acc, v) => [acc[0] + v[0], acc[1] + v[1], acc[2] + v[2]],
      [0, 0, 0]
    )
    .map((c) => c / 3);

  return (
    <>
      {/* <Text
        position={[0, 0, 2.61]}
        rotation={[0, 0, 0]}
        fontSize={0.42}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onClick={onClick(() => console.log("CLICK FRONT"))}
      >
        WELCOME
      </Text> */}
      <Text
        position={centroid}
        fontSize={0.42}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"

      >
        WELCOME
      </Text>
      {/* Face arrière */}
      {/* <Text
        position={[0, 0, -2.61]}
        rotation={[0, Math.PI, 0]} // inversé pour être lisible depuis l'extérieur
        fontSize={0.42}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onClick={onClick(() => console.log("CLICK BACK"))}
      >
        CONTACT
      </Text> */}
      {/* Face droite */}
      {/* <Text
        position={[2.61, 0, 0]}
        rotation={[0, -Math.PI / 2 + Math.PI, 0]} // orienté vers l'extérieur
        fontSize={0.42}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onClick={onClick(() => console.log("CLICK RIGHT"))}
      >
        SKILLS
      </Text> */}
      {/* Face gauche */}
      {/* <Text
        position={[-2.61, 0, 0]}
        rotation={[0, Math.PI / 2 + Math.PI, 0]} // orienté vers l'extérieur
        fontSize={0.42}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onClick={onClick(() => console.log("CLICK LEFT"))}
      >
        ABOUT ME
      </Text> */}
    </>
  );
};

export default CubeText;
