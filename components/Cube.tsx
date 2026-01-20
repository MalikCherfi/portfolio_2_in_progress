import { useRef, useState, useEffect, useMemo } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useCubeStore } from "@/stores/cubeStore";
import { RoundedBox } from "@react-three/drei";
import { useTexture } from "@react-three/drei";
import CubeText from "./CubeText";

const Cube = () => {
  const groupRef = useRef<THREE.Group | null>(null);
  const velocity = useRef({ x: 0, y: 0 });
  const prev = useRef({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const { rotate, setRotate, zoomCamera } = useCubeStore();
  const clock = useRef(new THREE.Clock());
  const setBounceY = useCubeStore((state) => state.setBounceY);
  const ao = useTexture("/ao.png");
  const boxRef = useRef<THREE.Mesh>(null!);
  const { camera } = useThree();

  // Orientation de base (ne jamais modifier)
  const defaultQuaternion = useRef(new THREE.Quaternion());

  // Orientation cible (quand tu cliques sur une face)
  const targetQuaternion = useRef(new THREE.Quaternion());

  const axisX = useMemo(() => new THREE.Vector3(1, 0, 0), []);
  const axisY = useMemo(() => new THREE.Vector3(0, 1, 0), []);

  const timeOffset = useRef(0);

  useFrame(() => {
    if (!groupRef.current) return;

    const elapsed = clock.current.getElapsedTime();
    const t = elapsed - timeOffset.current;

    // ----- Position Y cible -----
    let targetY = 0;

    if (zoomCamera) {
      const perspectiveCamera = camera as THREE.PerspectiveCamera;

      // Calcul dynamique pour que le cube soit à 30% depuis le haut de l'écran
      const cameraZ = 5; // distance actuelle caméra
      const fovRad = (perspectiveCamera.fov * Math.PI) / 180;
      const visibleHeight = 2 * cameraZ * Math.tan(fovRad / 2);
      const screenPercent = 0.32; // 0 = bas, 1 = haut
      targetY = (0.5 - screenPercent) * visibleHeight;
    } else {
      // Bounce normal quand pas de zoom
      targetY = Math.sin(t * 2) * 0.2;
    }

    // ----- Rotation et position -----
    if (!rotate.reset && !rotate.target_face) {
      // Interpolation Y pour transition fluide
      groupRef.current.position.y +=
        (targetY - groupRef.current.position.y) * 0.1;

      // Rotation par drag/inertie
      groupRef.current.rotateOnWorldAxis(axisY, velocity.current.x);
      groupRef.current.rotateOnWorldAxis(axisX, velocity.current.y);

      // Diminution progressive de l’inertie
      velocity.current.x *= 0.95;
      velocity.current.y *= 0.95;
    } else {
      // Animation fluide vers la position initiale ou face cible
      const targetPos = new THREE.Vector3(0, targetY, 0);
      groupRef.current.position.lerp(targetPos, 0.1);
      groupRef.current.quaternion.slerp(
        rotate.reset ? defaultQuaternion.current : targetQuaternion.current,
        0.1,
      );

      // Stop rotation quand proche de la cible
      if (
        groupRef.current.position.distanceTo(targetPos) < 0.01 &&
        groupRef.current.quaternion.angleTo(
          rotate.reset ? defaultQuaternion.current : targetQuaternion.current,
        ) < 0.01
      ) {
        timeOffset.current = clock.current.getElapsedTime();
        setRotate({ reset: false, target_face: false });
      }
    }

    // ----- Mise à jour des ombres -----
    setBounceY(groupRef.current.position.y);
  });

  useEffect(() => {
    if (!boxRef.current) return;

    const geo = boxRef.current.geometry;

    // Dupliquer UV → uv2
    geo.setAttribute(
      "uv2",
      new THREE.BufferAttribute(geo.attributes.uv.array, 2),
    );
  }, []);

  const onPointerDown = (e: any) => {
    e.stopPropagation();
    setIsDragging(true);
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
      {/* <mesh
        position={[0, 0, 2.61]} // légèrement devant la face avant
        onClick={(e) => console.log("Bouton cliqué !")}
      >
        <planeGeometry args={[0.8, 0.4]} />
        <meshStandardMaterial color="orange" />
      </mesh> */}

      <CubeText targetQuaternion={targetQuaternion} />

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
          // emissive="#B6465F"
          roughness={0.55}
          metalness={0}
          aoMap={ao}
          aoMapIntensity={0.1}
          dithering
        />
      </RoundedBox>
    </group>
  );
};

export default Cube;
