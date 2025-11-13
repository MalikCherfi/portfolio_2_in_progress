import { ContactShadows } from "@react-three/drei";
import Cube from "./Cube";
import { useCubeStore } from "@/stores/cubeStore";

const Scene = () => {
  const bounceY = useCubeStore((state) => state.bounceY);

  return (
    <>
      <ambientLight intensity={1} color={"#ffffff"} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1.0}
        color={"#ffffff"}
      />
      <directionalLight
        position={[-5, 2, -5]}
        intensity={1}
        color={"#ffffff"}
      />
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
