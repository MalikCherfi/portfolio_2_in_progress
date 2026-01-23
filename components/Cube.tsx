import { useRef, useState, useMemo, useEffect } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useCubeStore } from "@/stores/cubeStore";
import { RoundedBox } from "@react-three/drei";
import { useTexture } from "@react-three/drei";
import CubeText from "./CubeText";
import CubeDescriptionText from "./CubeDescriptionText";
import { useIsMobile } from "../utils/useIsMobile";

const Cube = () => {
  const groupRef = useRef<THREE.Group | null>(null);
  const velocity = useRef({ x: 0, y: 0 });
  const prev = useRef({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const isMobile = useIsMobile();

  const { rotate, setRotate, zoomCamera } = useCubeStore();
  const clock = useRef(new THREE.Clock());
  const timeOffset = useRef(0);
  const setBounceY = useCubeStore((state) => state.setBounceY);
  const ao = useTexture("/ao.png");
  const boxRef = useRef<THREE.Mesh>(null!);
  const { camera } = useThree();

  const defaultQuaternion = useRef(new THREE.Quaternion());
  const targetQuaternion = useRef(new THREE.Quaternion());

  const axisX = useMemo(() => new THREE.Vector3(1, 0, 0), []);
  const axisY = useMemo(() => new THREE.Vector3(0, 1, 0), []);

  // --- Frame loop ---
  useFrame(() => {
    if (!groupRef.current) return;

    const elapsed = clock.current.getElapsedTime();
    const t = elapsed - timeOffset.current;

    // ---------------- CAMERA ----------------
    const targetZ = zoomCamera ? 5 : 20;
    camera.position.lerp(new THREE.Vector3(0, 0, targetZ), 0.05);
    camera.lookAt(0, 0, 0);

    // ---------------- TARGET Y ----------------
    let targetY = 0;

    if (zoomCamera) {
      const fovRad = ((camera as THREE.PerspectiveCamera).fov * Math.PI) / 180;
      const visibleHeight = 2 * 5 * Math.tan(fovRad / 2);
      targetY = (0.5 - 0.32) * visibleHeight;
    } else {
      // ✅ BOUNCE VIVANT
      targetY = Math.sin(t * 2) * 0.2;
    }

    // ---------------- ROTATION / POSITION ----------------
    if (!rotate.reset && !rotate.target_face) {
      groupRef.current.position.y +=
        (targetY - groupRef.current.position.y) * 0.1;

      // si zoomCamera, stopper la rotation et l’inertie
      if (!zoomCamera) {
        groupRef.current.rotateOnWorldAxis(axisY, velocity.current.x);
        groupRef.current.rotateOnWorldAxis(axisX, velocity.current.y);
        velocity.current.x *= 0.95;
        velocity.current.y *= 0.95;
      } else {
        velocity.current.x = 0;
        velocity.current.y = 0;
      }
    } else {
      const targetPos = new THREE.Vector3(0, targetY, 0);
      groupRef.current.position.lerp(targetPos, 0.1);
      groupRef.current.quaternion.slerp(
        rotate.reset ? defaultQuaternion.current : targetQuaternion.current,
        0.1,
      );

      if (
        groupRef.current.position.distanceTo(targetPos) < 0.01 &&
        groupRef.current.quaternion.angleTo(
          rotate.reset ? defaultQuaternion.current : targetQuaternion.current,
        ) < 0.01
      ) {
        // 🔥 reset propre du bounce
        timeOffset.current = clock.current.getElapsedTime();
        setRotate({ reset: false, target_face: false });
      }
    }

    setBounceY(groupRef.current.position.y);
  });

  useEffect(() => {
    if (!boxRef.current || isMobile) return;

    const geo = boxRef.current.geometry;

    // Dupliquer UV → uv2
    geo.setAttribute(
      "uv2",
      new THREE.BufferAttribute(geo.attributes.uv.array, 2),
    );
  }, [isMobile]);

  // --- Drag handlers ---
  const onPointerDown = (e: any) => {
    e.stopPropagation();
    e.nativeEvent.preventDefault();
    setIsDragging(true);
    prev.current.x = e.clientX;
    prev.current.y = e.clientY;
    try {
      (e.target as Element).setPointerCapture?.(e.pointerId);
    } catch {}
  };
  const onPointerMove = (e: any) => {
    e.stopPropagation();
    e.nativeEvent.preventDefault();
    if (!isDragging || !groupRef.current) return;
    const dx = e.clientX - prev.current.x;
    const dy = e.clientY - prev.current.y;
    const rotationSpeed = 0.004;
    groupRef.current.rotateOnWorldAxis(axisY, dx * rotationSpeed);
    groupRef.current.rotateOnWorldAxis(axisX, dy * rotationSpeed);
    velocity.current.x = dx * rotationSpeed;
    velocity.current.y = dy * rotationSpeed;
    prev.current.x = e.clientX;
    prev.current.y = e.clientY;
  };
  const onPointerUp = (e: any) => {
    e.stopPropagation();
    e.nativeEvent.preventDefault();
    setIsDragging(false);
    try {
      (e.target as Element).releasePointerCapture?.(e.pointerId);
    } catch {}
  };

  return (
    <group
      ref={groupRef}
      onPointerDown={!zoomCamera && onPointerDown}
      onPointerMove={!zoomCamera && onPointerMove}
      onPointerUp={!zoomCamera && onPointerUp}
      onPointerLeave={!zoomCamera && onPointerUp}
      onPointerCancel={!zoomCamera && onPointerUp}
    >
      {/* CubeText pour les faces cliquables */}
      <CubeText targetQuaternion={targetQuaternion} />

      {/* Texte descriptif animé après zoom */}
      <CubeDescriptionText />

      <RoundedBox
        ref={boxRef}
        args={[5.2, 5.2, 5.2]}
        radius={0.04}
        smoothness={4}
        castShadow={!isMobile}
        receiveShadow={!isMobile}
      >
        <meshStandardMaterial
          color="#B6465F"
          roughness={0.55}
          metalness={0}
          aoMap={isMobile ? undefined : ao}
          aoMapIntensity={isMobile ? 0 : 0.1}
          dithering
        />
      </RoundedBox>
    </group>
  );
};

export default Cube;
