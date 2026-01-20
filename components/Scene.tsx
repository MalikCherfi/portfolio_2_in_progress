import { ContactShadows } from "@react-three/drei";
import Cube from "./Cube";
import { useCubeStore } from "@/stores/cubeStore";
import * as THREE from "three";
import BackgroundGeometry from "./BackgroundGeometry";
import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

const Scene = () => {
  const bounceY = useCubeStore((state) => state.bounceY);
  const zoomCamera = useCubeStore((state) => state.zoomCamera);

  const rightLight = useMemo(() => {
    const light = new THREE.RectAreaLight("#ffffff", 3, 2, 2);
    light.position.set(2.5, 1, 7);
    light.lookAt(0, 0, 0);
    return light;
  }, []);

  const backLight = useMemo(() => {
    const light = new THREE.RectAreaLight("#ffffff", 1.5, 3, 2);
    light.position.set(0, 1, -6);
    light.lookAt(0, 0, 0);
    return light;
  }, []);

  const { camera } = useThree();

  // position initiale et cible de la caméra
  const camTarget = useRef(new THREE.Vector3(0, 0, 20));

  // Interpolation fluide de la caméra
  useFrame(() => {
    const targetZ = zoomCamera ? 5 : 20; // zoom si zoomCamera=true
    camTarget.current.set(0, 0, targetZ);
    camera.position.lerp(camTarget.current, 0.05);
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.25} color="#ffffff" />
      <hemisphereLight color="#ffffff" groundColor="#ffffff" intensity={0.15} />
      <directionalLight position={[0, 5, 0]} intensity={1.1} color="#ffffff" />
      <primitive object={rightLight} />
      <primitive object={backLight} />

      {/* Cube */}
      <Cube />

      {/* Background */}
      <BackgroundGeometry />

      {/* Shadows */}
      <ContactShadows
        position={[0, -5, 0]}
        opacity={0.6}
        width={3 + bounceY}
        height={3 + bounceY}
        blur={4}
        far={15}
      />
    </>
  );
};

export default Scene;
