import { Environment } from "@react-three/drei";
import Cube from "./Cube";

const Scene = () => {
  return (
    <>
      <ambientLight intensity={0.4} />
      <spotLight
        position={[5, 5, 5]}
        angle={0.4}
        penumbra={0.5}
        intensity={1.2}
        castShadow
      />
      <directionalLight position={[-5, -5, -5]} intensity={0.6} />
      <Cube />
      <Environment preset="city" />
    </>
  );
};

export default Scene;
