"use client";

import { useState, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

type ItemType = "cube" | "sphere";

type arrayItem = {
  position: [number, number, number];
  scale: number;
  color: string;
  type: ItemType;
  velocity: { x: number; y: number };
};

const BackgroundGeometry = () => {
  const { camera, gl } = useThree();

  const [items, setItems] = useState<arrayItem[]>(
    () =>
      Array.from({ length: 160 }, () => {
        const z =
          Math.random() > 0.2 ? -3 - Math.random() * 8 : 3 + Math.random() * 8;
        return {
          position: [(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20, z],
          scale: Math.random() * 0.4 + 0.1,
          color: Math.random() > 0.5 ? "#B6465F" : "#CE6A6B",
          type: z > 4 ? "sphere" : Math.random() > 0.7 ? "sphere" : "cube",
          velocity: { x: 0, y: 0 },
        };
      }) as arrayItem[]
  );

  const draggingIndex = useRef<number | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 }); // offset in world units
  const lastPos = useRef({ x: 0, y: 0 }); // last world pos to compute velocity
  const raycaster = useRef(new THREE.Raycaster());
  const plane = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)); // plane will be repositioned per-object

  // helper : project mouse to world on plane at given z (plane must be set from object)
  const pointerToPlane = (
    clientX: number,
    clientY: number,
    targetPlane: THREE.Plane
  ) => {
    const rect = (gl.domElement as HTMLCanvasElement).getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.current.setFromCamera({ x, y }, camera);
    const intersection = new THREE.Vector3();
    raycaster.current.ray.intersectPlane(targetPlane, intersection);
    return intersection;
  };

  const onPointerDown = (e: any, index: number) => {
    e.stopPropagation();
    // capture pointer so we keep receiving events even if cursor leaves the mesh
    try {
      (e.target as Element).setPointerCapture?.(e.pointerId);
    } catch {}

    const meshPos = new THREE.Vector3(...items[index].position);
    // plane parallel to camera view but positioned at meshPos
    // we compute a plane that faces the camera: normal = camera.getWorldDirection()
    const camDir = new THREE.Vector3();
    camera.getWorldDirection(camDir);
    plane.current.setFromNormalAndCoplanarPoint(
      camDir.clone().negate(),
      meshPos
    );

    const worldPoint = pointerToPlane(e.clientX, e.clientY, plane.current);
    if (!worldPoint) return;

    dragOffset.current = {
      x: items[index].position[0] - worldPoint.x,
      y: items[index].position[1] - worldPoint.y,
    };

    lastPos.current = {
      x: worldPoint.x + dragOffset.current.x,
      y: worldPoint.y + dragOffset.current.y,
    };

    draggingIndex.current = index;
  };

  const onPointerMove = (e: any) => {
    if (draggingIndex.current === null) return;
    e.stopPropagation();
    const idx = draggingIndex.current;
    // use plane.current set at pointerdown
    const worldPoint = pointerToPlane(e.clientX, e.clientY, plane.current);
    if (!worldPoint) return;

    const newX = worldPoint.x + dragOffset.current.x;
    const newY = worldPoint.y + dragOffset.current.y;

    // velocity = delta from lastPos (world units)
    const vx = newX - lastPos.current.x;
    const vy = newY - lastPos.current.y;
    lastPos.current = { x: newX, y: newY };

    setItems((prev) => {
      const copy = [...prev];
      const cur = copy[idx];
      copy[idx] = {
        ...cur,
        position: [newX, newY, cur.position[2]],
        velocity: { x: vx, y: vy },
      };
      return copy;
    });
  };

  const endDrag = (e?: any) => {
    // release pointer capture if available
    if (e?.target) {
      try {
        (e.target as Element).releasePointerCapture?.(e.pointerId);
      } catch {}
    }
    draggingIndex.current = null;
    // inertia will run because items already have velocity set in onPointerMove
  };

  // attach handlers per frame: apply inertia
  useFrame(() => {
    setItems((prev) =>
      prev.map((item) => {
        // if item is currently being dragged, skip inertia update for it
        if (
          draggingIndex.current !== null &&
          prev[draggingIndex.current] === item
        ) {
          return item;
        }

        const vx = item.velocity.x * 0.92; // friction
        const vy = item.velocity.y * 0.92;

        // very small threshold to stop
        if (Math.abs(vx) < 0.00001 && Math.abs(vy) < 0.00001) {
          if (item.velocity.x === 0 && item.velocity.y === 0) return item;
          return { ...item, velocity: { x: 0, y: 0 } };
        }

        return {
          ...item,
          position: [
            item.position[0] + vx,
            item.position[1] + vy,
            item.position[2],
          ],
          velocity: { x: vx, y: vy },
        };
      })
    );
  });

  const geometryMap = {
    cube: <boxGeometry args={[1, 1, 1]} />,
    sphere: <sphereGeometry args={[0.7, 16, 16]} />,
  };

  return (
    <>
      {items.map((item, index) => {
        const [x, y, z] = item.position;
        const isInFrontOfCube = z > 4 && x > -2 && x < 2 && y > -2 && y < 2;
        return (
          <Float
            key={index}
            speed={1}
            rotationIntensity={0.3}
            floatIntensity={0.5}
          >
            <mesh
              position={item.position}
              scale={item.scale}
              castShadow={false}
              receiveShadow={false}
              onPointerDown={(e) => onPointerDown(e, index)}
              onPointerMove={onPointerMove}
              onPointerUp={(e) => endDrag(e)}
              onPointerLeave={(e) => {
                // when pointer leaves the mesh we want to end drag but keep inertia
                endDrag(e);
              }}
              onPointerCancel={(e) => endDrag(e)}
            >
              {geometryMap[item.type]}
              {isInFrontOfCube ? (
                <MeshTransmissionMaterial
                  color={item.color}
                  emissive={item.color}
                  emissiveIntensity={0.3}
                  transmission={0.8} // pas 1 complet
                  thickness={0.3} // un peu moins épais
                  roughness={0.2} // léger flou
                  chromaticAberration={0} // désactivé
                  backside={false} // pas de backface
                  samples={2} // moins d’échantillons
                  // transmissionSampler={true} // réutilise le buffer pour tous
                />
              ) : (
                <meshStandardMaterial
                  color={item.color}
                  emissive={item.color}
                  emissiveIntensity={0.3}
                  roughness={1}
                  metalness={0}
                  transparent
                  opacity={0.9}
                />
              )}
            </mesh>
          </Float>
        );
      })}
    </>
  );
};

export default BackgroundGeometry;
