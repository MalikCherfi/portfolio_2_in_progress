import { Environment, ContactShadows } from "@react-three/drei";
import Cube from "./Cube";

const Scene = () => {
  return (
    <>
      <ambientLight intensity={0.35} />

      <spotLight
        position={[0, 5, 0]}
        angle={0.6}
        penumbra={1}
        intensity={0.3}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-radius={8}
      />

      <Cube />

      <ContactShadows
        position={[0, -3.6, 0]}
        opacity={0.7}
        width={1.4}
        height={1.4}
        blur={4}
        far={15}
      />

      <Environment preset="studio" background={false} />
    </>
  );
};

export default Scene;
