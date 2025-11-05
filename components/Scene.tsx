import { ContactShadows } from "@react-three/drei";
import Cube from "./Cube";

const Scene = () => {
  return (
    <>
      <ambientLight intensity={0.7} />

      <spotLight
        position={[0, 5, 5]}
        angle={1}
        penumbra={1}
        intensity={200}
        castShadow
      />

      <Cube />

      <ContactShadows
        position={[0, -5.6, 0]}
        opacity={0.7}
        width={1.4}
        height={1.4}
        blur={4}
        far={15}
      />
    </>
  );
};

export default Scene;
