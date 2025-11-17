import { ContactShadows } from "@react-three/drei";
import Cube from "./Cube";
import { useCubeStore } from "@/stores/cubeStore";
import * as THREE from "three";
import BackgroundGeometry from "./BackgroundGeometry";

const Scene = () => {
  const bounceY = useCubeStore((state) => state.bounceY);

  // Panneau lumineux à droite
  const rightLight = new THREE.RectAreaLight("#ffffff", 3, 2, 2);
  rightLight.position.set(2.5, 1, 7);
  rightLight.lookAt(0, 0, 0);

  // Panneau lumineux derrière
  const backLight = new THREE.RectAreaLight("#ffffff", 1.5, 3, 2);
  backLight.position.set(0, 1, -6);
  backLight.lookAt(0, 0, 0);

  return (
    <>
      <ambientLight intensity={0.25} color="#ffffff" />

      <hemisphereLight
        color={"#ffffff"}
        groundColor={"#ffffff"}
        intensity={0.15}
      />

      <directionalLight position={[0, 5, 0]} intensity={1.1} color="#ffffff" />

      <primitive object={rightLight} />
      <primitive object={backLight} />

      <Cube />

      <BackgroundGeometry />

      <ContactShadows
        position={[0, -6, 0]}
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
