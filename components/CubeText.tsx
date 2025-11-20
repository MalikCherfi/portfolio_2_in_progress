import { Text } from "@react-three/drei";

const CubeText = () => {
  return (
    <>
      <Text
        position={[0, 0, 2.61]}
        rotation={[0, 0, 0]}
        fontSize={0.42}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        onPointerDown={() => console.log("CLICK FRONT")}
      >
        BIENVENUE
      </Text>
      {/* Face arrière */}
      <Text
        position={[0, 0, -2.61]}
        rotation={[0, Math.PI, 0]} // inversé pour être lisible depuis l'extérieur
        fontSize={0.42}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        onPointerDown={() => console.log("CLICK BACK")}
      >
        CONTACT
      </Text>
      {/* Face droite */}
      <Text
        position={[2.61, 0, 0]}
        rotation={[0, -Math.PI / 2 + Math.PI, 0]} // orienté vers l'extérieur
        fontSize={0.42}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        onPointerDown={() => console.log("CLICK RIGHT")}
      >
        SKILLS
      </Text>
      {/* Face gauche */}
      <Text
        position={[-2.61, 0, 0]}
        rotation={[0, Math.PI / 2 + Math.PI, 0]} // orienté vers l'extérieur
        fontSize={0.42}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        onPointerDown={() => console.log("CLICK LEFT")}
      >
        ABOUT ME
      </Text>
    </>
  );
};

export default CubeText;
