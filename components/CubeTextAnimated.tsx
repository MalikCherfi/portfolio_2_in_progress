import { Text } from "@react-three/drei";
import { animated, useSpring, easings } from "@react-spring/three";
import { useThree } from "@react-three/fiber";
import { useCubeStore } from "@/stores/cubeStore";
import { PerspectiveCamera } from "three";
import { useMemo } from "react";

const AnimatedText = animated(Text);

const description = `Bienvenue sur mon portfolio. Découvrez mes compétences et mon expérience. Je suis Malik Cherfi, développeur web passionné par la création d'expériences numériques innovantes et performantes. Explorez mes projets et n'hésitez pas à me contacter pour collaborer !`;

export default function CubeTextAnimated() {
  const { zoomDone } = useCubeStore();
  const { viewport, camera } = useThree();
  const perspectiveCamera = camera as PerspectiveCamera;

  const { targetY } = useMemo(() => {
    const distance = perspectiveCamera.position.z - 2.61;
    const fovRad = (perspectiveCamera.fov * Math.PI) / 180;
    const visibleHeight = 2 * distance * Math.tan(fovRad / 2);

    const bottom = -visibleHeight / 2;
    const targetY = bottom / 2;

    return { targetY };
  }, [perspectiveCamera.position.z, perspectiveCamera.fov]);

  const getBaseValues = () => {
    const w = window.innerWidth;
    if (w < 600)
      return {
        fontSize: 0.055 * 0.9,
        maxWidth: viewport.width * viewport.height * 0.0056,
      };
    if (w < 900)
      return {
        fontSize: 0.065 * 0.9,
        maxWidth: viewport.width * viewport.height * 0.0056,
      };
    return {
      fontSize: 0.075 * 0.9,
      maxWidth: viewport.width * viewport.height * 0.0056,
    };
  };

  const base = getBaseValues();

  const spring = useSpring({
    from: { y: targetY, opacity: 0 },
    to: {
      y: targetY,
      opacity: zoomDone ? 1 : 0,
    },
    config: {
      duration: 1000,
      easing: easings.easeInOutSine,
    },
  });

  return (
    <AnimatedText
      position-x={0}
      position-y={spring.y}
      position-z={2.61}
      font="/fonts/SpaceGrotesk-VariableFont_wght.ttf"
      fontSize={base.fontSize}
      maxWidth={base.maxWidth}
      lineHeight={1.45}
      letterSpacing={-0.015}
      color="#ffffff"
      anchorX="center"
      anchorY="top"
      textAlign="center"
      material-opacity={spring.opacity}
      material-transparent
    >
      {description}
    </AnimatedText>
  );
}
