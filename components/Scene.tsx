import { ContactShadows } from "@react-three/drei";
import Cube from "./Cube";
import { useCubeStore } from "@/stores/cubeStore";
import * as THREE from "three";
import BackgroundGeometry from "./BackgroundGeometry";
import { EffectComposer, DepthOfField } from "@react-three/postprocessing";
import { useMemo } from "react";

const Scene = () => {
  const bounceY = useCubeStore((state) => state.bounceY);

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

      <EffectComposer multisampling={0}>
        <DepthOfField
          focusDistance={0} // 👈 tu touches PAS
          focalLength={0.015} // 👈 plus petit = cube encore + net
          bokehScale={2}
        />
      </EffectComposer>

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
