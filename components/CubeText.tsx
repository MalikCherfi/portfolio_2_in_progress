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

  const fontProps = {
    font: "/fonts/Iceberg-Regular.ttf",
    fontSize: 0.42,
    color: "#ffffff",
    anchorX: "center",
    anchorY: "middle",
  };

  return (
    <>
      <Text
        position={[0, 0, 2.61]}
        rotation={[0, 0, 0]}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onClick={onClick(() => console.log("CLICK FRONT"))}
        {...fontProps}
      >
        WELCOME
      </Text>
      {/* Face arrière */}
      <Text
        position={[0, 0, -2.61]}
        rotation={[0, Math.PI, 0]} // inversé pour être lisible depuis l'extérieur
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onClick={onClick(() => console.log("CLICK BACK"))}
        {...fontProps}
      >
        CONTACT
      </Text>
      {/* Face droite */}
      <Text
        position={[2.61, 0, 0]}
        rotation={[0, -Math.PI / 2 + Math.PI, 0]} // orienté vers l'extérieur
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onClick={onClick(() => console.log("CLICK RIGHT"))}
        {...fontProps}
      >
        SKILLS
      </Text>
      {/* Face gauche */}
      <Text
        position={[-2.61, 0, 0]}
        rotation={[0, Math.PI / 2 + Math.PI, 0]} // orienté vers l'extérieur
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onClick={onClick(() => console.log("CLICK LEFT"))}
        {...fontProps}
      >
        ABOUT ME
      </Text>
    </>
  );
};

export default CubeText;
