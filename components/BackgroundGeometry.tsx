"use client";

import { useState, type ReactElement } from "react";
import { Float } from "@react-three/drei";

type ItemType = "cube" | "sphere";

type arrayItem = {
  position: [number, number, number];
  scale: number;
  color: string;
  type: ItemType;
};

const BackgroundGeometry = () => {
  const [items] = useState(() => {
    const arr: arrayItem[] = [];
    for (let i = 0; i < 160; i++) {
      // Génère un Z aléatoire mais évite le cube principal (-2.6 à 2.6)
      let z = 0;
      if (Math.random() > 0.1) {
        // Derrière le cube
        z = -3 - Math.random() * 8; // entre -3 et -11
      } else {
        // Devant le cube
        z = 3 + Math.random() * 8; // entre 3 et 11
      }

      arr.push({
        position: [
          (Math.random() - 0.5) * 20, // X
          (Math.random() - 0.5) * 20, // Y
          z, // Z
        ],
        scale: Math.random() * 0.4 + 0.1,
        color: Math.random() > 0.5 ? "#B6465F" : "#CE6A6B",
        type: Math.random() > 0.7 ? "sphere" : "cube",
      });
    }
    return arr;
  });

  const geometry: Record<ItemType, { component: ReactElement }> = {
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
            {geometry[item.type as ItemType].component}
            <meshStandardMaterial
              color={item.color}
              emissive={item.color}
              emissiveIntensity={0.3}
              roughness={1}
              metalness={0}
              transparent
              opacity={0.9}
            />
          </mesh>
        </Float>
      ))}
    </>
  );
};

export default BackgroundGeometry;
