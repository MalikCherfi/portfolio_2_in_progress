import { ContactShadows } from "@react-three/drei";
import Cube from "./Cube";
import { useCubeStore } from "@/stores/cubeStore";
import * as THREE from "three";

const Scene = () => {
  const bounceY = useCubeStore((state) => state.bounceY);

  const rightLight = new THREE.RectAreaLight("#ffffff", 2.0, 2, 2);
  rightLight.position.set(2, 0, 7);
  rightLight.lookAt(0, 0, 0);

  return (
    <>
      {/* Lumière d'ambiance, faible, juste pour déboucher les ombres */}
      <ambientLight intensity={0.25} color="#ffffff" />

      {/* Lumière principale type “softbox” au-dessus du cube */}
      <directionalLight
        position={[0, 5, 0]} // pile au-dessus
        intensity={1.2}
        color="#ffffff"
      />
      <primitive object={rightLight} />
      <Cube />
      <ContactShadows
        position={[0, -5.6, 0]}
        opacity={0.7}
        width={1.4 + bounceY}
        height={1.4 + bounceY}
        blur={4}
        far={15}
      />
    </>
  );
};

export default Scene;
