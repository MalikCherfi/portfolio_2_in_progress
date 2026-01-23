"use client";

import { useRef, useState, useMemo, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

type ItemType = "cube" | "sphere";

type ArrayItem = {
  position: [number, number, number];
  scale: number;
  color: string;
  type: ItemType;
  velocity: { x: number; y: number };
};

const BackgroundGeometry = () => {
  const { camera, gl } = useThree();

  // --- INITIAL ITEMS ---
  const [items, setItems] = useState<ArrayItem[]>(() => {
    const mobile = window.innerWidth <= 1000;
    const length = mobile ? 40 : 160;
    return Array.from({ length }, () => {
      const z =
        Math.random() > 0.2 ? -3 - Math.random() * 8 : 3 + Math.random() * 8;
      return {
        position: [(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20, z],
        scale: Math.random() * 0.4 + 0.1,
        color: Math.random() > 0.5 ? "#B6465F" : "#CE6A6B",
        type: z > 4 ? "sphere" : Math.random() > 0.7 ? "sphere" : "cube",
        velocity: { x: 0, y: 0 },
      };
    });
  });

  // --- REFS POUR DRAG ET CALCULS TEMP ---
  const draggingIndex = useRef<number | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const lastPos = useRef({ x: 0, y: 0 });
  const raycaster = useRef(new THREE.Raycaster());
  const plane = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0));

  const tempVec = useMemo(() => new THREE.Vector3(), []);
  const tempCamDir = useMemo(() => new THREE.Vector3(), []);

  // --- HELPER : MOUSE TO WORLD ---
  const pointerToPlane = useCallback(
    (clientX: number, clientY: number, targetPlane: THREE.Plane) => {
      const rect = (gl.domElement as HTMLCanvasElement).getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.current.setFromCamera({ x, y }, camera);
      const intersection = new THREE.Vector3();
      raycaster.current.ray.intersectPlane(targetPlane, intersection);
      return intersection;
    },
    [camera, gl.domElement],
  );

  // --- POINTER HANDLERS ---
  const onPointerDown = useCallback(
    (e: any, index: number) => {
      e.stopPropagation();
      try {
        (e.target as Element).setPointerCapture?.(e.pointerId);
      } catch {}

      tempVec.set(...items[index].position);

      // plane per object facing camera
      camera.getWorldDirection(tempCamDir);
      plane.current.setFromNormalAndCoplanarPoint(
        tempCamDir.clone().negate(),
        tempVec,
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
    },
    [items, camera, pointerToPlane],
  );

  const onPointerMove = useCallback(
    (e: any) => {
      if (draggingIndex.current === null) return;
      e.stopPropagation();
      const idx = draggingIndex.current;

      const worldPoint = pointerToPlane(e.clientX, e.clientY, plane.current);
      if (!worldPoint) return;

      const newX = worldPoint.x + dragOffset.current.x;
      const newY = worldPoint.y + dragOffset.current.y;

      const vx = newX - lastPos.current.x;
      const vy = newY - lastPos.current.y;
      lastPos.current = { x: newX, y: newY };

      setItems((prev) => {
        const copy = [...prev];
        copy[idx] = {
          ...copy[idx],
          position: [newX, newY, copy[idx].position[2]],
          velocity: { x: vx, y: vy },
        };
        return copy;
      });
    },
    [pointerToPlane],
  );

  const endDrag = useCallback((e?: any) => {
    if (e?.target) {
      try {
        (e.target as Element).releasePointerCapture?.(e.pointerId);
      } catch {}
    }
    draggingIndex.current = null;
  }, []);

  // --- GEOMETRY MAP ---
  const geometryMap = useMemo(
    () => ({
      cube: <boxGeometry args={[1, 1, 1]} />,
      sphere: <sphereGeometry args={[0.7, 16, 16]} />,
    }),
    [],
  );

  // --- USE FRAME : INERTIA + DRAG ---
  useFrame(() => {
    setItems((prev) =>
      prev.map((item, idx) => {
        if (draggingIndex.current === idx) return item;

        const vx = item.velocity.x * 0.92;
        const vy = item.velocity.y * 0.92;

        if (Math.abs(vx) < 1e-5 && Math.abs(vy) < 1e-5) {
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
      }),
    );
  });

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
              onPointerLeave={(e) => endDrag(e)}
              onPointerCancel={(e) => endDrag(e)}
            >
              {geometryMap[item.type]}
              {isInFrontOfCube ? (
                <MeshTransmissionMaterial
                  color={item.color}
                  emissive={item.color}
                  emissiveIntensity={0.3}
                  transmission={0.8}
                  thickness={0.3}
                  roughness={0.2}
                  chromaticAberration={0}
                  backside={false}
                  samples={2}
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
