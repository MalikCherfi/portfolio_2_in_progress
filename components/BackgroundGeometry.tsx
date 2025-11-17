"use client";

import { useState, type ReactElement } from "react";
import { Float } from "@react-three/drei";

type ItemType = "cube" | "sphere";

const BackgroundGeometry = () => {
  const [items] = useState(() => {
    const arr = [];
    for (let i = 0; i < 160; i++) {
      arr.push({
        position: [
          (Math.random() - 0.5) * 20, // X normal
          (Math.random() - 0.5) * 20, // Y normal

          // Z forcé en arrière-plan uniquement
          -3 - Math.random() * 8, // entre -3 et -11
        ] as [number, number, number],
        scale: Math.random() * 0.4 + 0.1,
        color: Math.random() > 0.5 ? "#B6465F" : "#CE6A6B",
        type: Math.random() > 0.7 ? "sphere" : "cube",
      });
    }
    return arr;
  });

  const setGeometry: Record<ItemType, { component: ReactElement }> = {
    cube: { component: <boxGeometry args={[1, 1, 1]} /> },
    sphere: { component: <sphereGeometry args={[0.7, 16, 16]} /> },
  };

  return (
    <>
      {items.map((item, index) => (
        <Float
          key={index}
          speed={1}
          rotationIntensity={0.3}
          floatIntensity={0.5}
        >
          <mesh position={item.position} scale={item.scale}>
            {setGeometry[item.type as ItemType].component}
            <meshStandardMaterial
              color={item.color}
              emissive={item.color}
              emissiveIntensity={0.3}
              roughness={1}
              metalness={0}
              transparent
              opacity={0.6}
            />
          </mesh>
        </Float>
      ))}
    </>
  );
};

export default BackgroundGeometry;
