import { useRef, useState, useEffect, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useCubeStore } from "@/stores/cubeStore";
import { useCanvasStore } from "@/stores/canvasStore";
import { RoundedBox } from "@react-three/drei";
import { useTexture } from "@react-three/drei";
import CubeText from "./CubeText";

const Cube = () => {
  const groupRef = useRef<THREE.Group | null>(null);
  const velocity = useRef({ x: 0, y: 0 });
  const prev = useRef({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const { reset, setReset } = useCubeStore();
  const { setIsDraggingObject } = useCanvasStore();
  const clock = useRef(new THREE.Clock());
  const setBounceY = useCubeStore((state) => state.setBounceY);
  const ao = useTexture("/ao.png");
  const boxRef = useRef<THREE.Mesh>(null!);

  const initialPosition = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  const initialQuaternion = useMemo(() => new THREE.Quaternion(), []);

  const axisX = useMemo(() => new THREE.Vector3(1, 0, 0), []);
  const axisY = useMemo(() => new THREE.Vector3(0, 1, 0), []);

  const timeOffset = useRef(0);

  useFrame(() => {
    if (!groupRef.current) return;

    const elapsed = clock.current.getElapsedTime();
    const t = elapsed - timeOffset.current; // on applique l'offset temporel

    if (!reset) {
      // 🎯 effet bounce vertical fluide
      const bounce = Math.sin(t * 2) * 0.2;
      groupRef.current.position.y = bounce;
      setBounceY(bounce);

      // rotation + inertie
      groupRef.current.rotateOnWorldAxis(axisY, velocity.current.x);
      groupRef.current.rotateOnWorldAxis(axisX, velocity.current.y);

      velocity.current.x *= 0.95;
      velocity.current.y *= 0.95;
    } else {
      // Animation fluide vers la position initiale
      groupRef.current.position.lerp(initialPosition, 0.1);
      groupRef.current.quaternion.slerp(initialQuaternion, 0.1);

      // Stop reset quand on est proche
      if (
        groupRef.current.position.distanceTo(initialPosition) < 0.01 &&
        groupRef.current.quaternion.angleTo(initialQuaternion) < 0.01
      ) {
        // 🔄 Quand le reset est fini, on recale le bounce ici :
        timeOffset.current = clock.current.getElapsedTime();
        setReset(false);
      }
    }
  });

  useEffect(() => {
    if (!boxRef.current) return;

    const geo = boxRef.current.geometry;

    // Dupliquer UV → uv2
    geo.setAttribute(
      "uv2",
      new THREE.BufferAttribute(geo.attributes.uv.array, 2)
    );
  }, []);

  const onPointerDown = (e: any) => {
    e.stopPropagation();
    setIsDragging(true);
    setIsDraggingObject(true);
    prev.current.x = e.clientX;
    prev.current.y = e.clientY;
    try {
      (e.target as Element).setPointerCapture?.(e.pointerId);
    } catch {}
  };

  const onPointerMove = (e: any) => {
    e.stopPropagation();
    if (!isDragging || !groupRef.current) return;

    const dx = e.clientX - prev.current.x;
    const dy = e.clientY - prev.current.y;

    const rotationSpeed = 0.004;

    // rotation sur les axes globaux, pas locaux
    groupRef.current.rotateOnWorldAxis(axisY, dx * rotationSpeed);
    groupRef.current.rotateOnWorldAxis(axisX, dy * rotationSpeed);

    velocity.current.x = dx * rotationSpeed;
    velocity.current.y = dy * rotationSpeed;

    prev.current.x = e.clientX;
    prev.current.y = e.clientY;
  };

  const onPointerUp = (e: any) => {
    e.stopPropagation();
    setIsDragging(false);
    setIsDraggingObject(false);
    try {
      (e.target as Element).releasePointerCapture?.(e.pointerId);
    } catch {}
  };

  return (
    <group
      ref={groupRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {/* <mesh
        position={[0, 0, 2.61]} // légèrement devant la face avant
        onClick={(e) => console.log("Bouton cliqué !")}
      >
        <planeGeometry args={[0.8, 0.4]} />
        <meshStandardMaterial color="orange" />
      </mesh> */}

      <CubeText />

      <RoundedBox
        ref={boxRef}
        args={[5.2, 5.2, 5.2]}
        radius={0.04}
        smoothness={4}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color="#B6465F"
          emissive="#B6465F"
          roughness={0.55}
          metalness={0}
          aoMap={ao}
          aoMapIntensity={1.2}
          dithering
        />
      </RoundedBox>
    </group>
  );
};

export default Cube;
