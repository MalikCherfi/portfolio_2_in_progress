import { Text } from "@react-three/drei";
import { animated, useSpring, easings } from "@react-spring/three";
import { useCubeStore } from "@/stores/cubeStore";

const AnimatedText = animated(Text);

const description = `
Développeur Full Stack avec 2 ans d'expérience, j'ai travaillé sur des projets variés,
allant de la maintenance applicative à la conception et au développement de nouvelles
fonctionnalités. J'ai occupé le rôle de lead développeur sur divers projets.
Toujours en quête de nouveaux challenges, je cherche à évoluer dans un environnement
dynamique où je peux apporter mon expertise tout en continuant à apprendre.
`;

interface Props {
  zoomDone: boolean;
}

export default function CubeTextAnimated() {
  const { zoomDone } = useCubeStore();
  const spring = useSpring({
    from: { y: -2, opacity: 0 },
    to: {
      y: zoomDone ? -0.4 : -2,
      opacity: zoomDone ? 1 : 0,
    },
    config: {
      duration: 2000,
      easing: easings.easeInOutSine,
    },
  });

  return (
    <AnimatedText
      position-x={0}
      position-y={spring.y}
      position-z={2.61}
      font="/fonts/Iceland-Regular.ttf"
      fontSize={0.085}
      lineHeight={1.45}
      letterSpacing={-0.02}
      color="#ffffff"
      anchorX="center"
      anchorY="top"
      material-opacity={spring.opacity}
      material-transparent
    >
      {description}
    </AnimatedText>
  );
}
