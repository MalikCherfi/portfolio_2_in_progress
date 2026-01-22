import { Text } from "@react-three/drei";
import { animated, useSpring, easings } from "@react-spring/three";
import { useThree, useFrame } from "@react-three/fiber";
import { useCubeStore } from "@/stores/cubeStore";
import { PerspectiveCamera } from "three";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const AnimatedText = animated(Text);

type Line = {
  text: string;
  link?: string;
};

type Props = {
  positionX: number;
  positionZ: number;
  rotation?: [number, number, number];
  lines: Line[];
};

export default function CubeTextAnimated({
  positionX,
  positionZ,
  rotation,
  lines,
}: Props) {
  const { zoomDone } = useCubeStore();
  const { viewport, camera } = useThree();
  const perspectiveCamera = camera as PerspectiveCamera;
  const groupRef = useRef<THREE.Group>(null);

  const base = useMemo(() => {
    const w = window.innerWidth;
    const fontSize = w < 600 ? 0.05 : w < 900 ? 0.06 : 0.07;

    return {
      fontSize,
      maxWidth: viewport.width * viewport.height * 0.0056,
      lineGap: fontSize * 1.8,
    };
  }, [viewport]);

  const { targetY } = useMemo(() => {
    const distance = perspectiveCamera.position.z - 2.61;
    const fovRad = (perspectiveCamera.fov * Math.PI) / 180;
    const visibleHeight = 2 * distance * Math.tan(fovRad / 2);
    return { targetY: -visibleHeight / 4 };
  }, [perspectiveCamera.position.z, perspectiveCamera.fov]);

  const spring = useSpring({
    from: { y: targetY, opacity: 0 },
    to: { y: targetY, opacity: zoomDone ? 1 : 0 },
    config: { duration: 1000, easing: easings.easeInOutSine },
  });

  // Masque quand la caméra passe derrière le texte ( car opacité à 0 ne fonctionne pas de manière fiable )
  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.visible = perspectiveCamera.position.z <= 18;
  });

  return (
    <group ref={groupRef}>
      {lines.map((line, index) => (
        <AnimatedText
          key={index}
          position={[
            positionX,
            spring.y.get() - index * base.lineGap,
            positionZ,
          ]}
          rotation={rotation}
          font="/fonts/SpaceGrotesk-VariableFont_wght.ttf"
          fontSize={base.fontSize}
          maxWidth={base.maxWidth}
          lineHeight={1.45}
          letterSpacing={-0.015}
          color={line.link ? "#4ea1ff" : "#ffffff"}
          anchorX="center"
          anchorY="top"
          textAlign="center"
          material-opacity={spring.opacity}
          material-transparent
          onClick={
            line.link
              ? () => window.open(line.link, "_blank", "noopener,noreferrer")
              : undefined
          }
          onPointerOver={
            line.link
              ? () => (document.body.style.cursor = "pointer")
              : undefined
          }
          onPointerOut={
            line.link
              ? () => (document.body.style.cursor = "default")
              : undefined
          }
        >
          {line.text}
        </AnimatedText>
      ))}
    </group>
  );
}
