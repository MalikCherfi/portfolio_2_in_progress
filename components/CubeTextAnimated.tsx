import { Text } from "@react-three/drei";
import { animated, useSpring } from "@react-spring/three";
import { useEffect, useState, useMemo } from "react";

const AnimatedText = animated(Text);

const description =
  "Développeur Full Stack avec 2 ans d'expérience, j'ai travaillé sur des projets variés, allant de la maintenance applicative à la conception et au développement de nouvelles fonctionnalités.";

interface Props {
  zoomDone: boolean;
}

export default function CubeTextAnimated({ zoomDone }: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(zoomDone);
  }, [zoomDone]);

  const fontSize = 0.08;
  const maxLineWidth = 3; // largeur max en unités three
  const lineHeight = 0.1;
  const words = useMemo(() => description.split(" "), []);

  const lines = useMemo(() => {
    let x = 0;
    let y = 0;

    const maxLineWidth = 3.5;
    const lineHeight = fontSize * 1.6;

    const LETTER_SPACING = -0.02;
    const CHAR_WIDTH = 0.55;
    const SPACE_WIDTH = fontSize * 0.35;

    console.log(SPACE_WIDTH);

    return words.map((word) => {
      const wordWidth =
        word.length * fontSize * CHAR_WIDTH +
        (word.length - 1) * LETTER_SPACING * fontSize;

      if (x + wordWidth > maxLineWidth) {
        x = 0;
        y -= lineHeight;
      }

      const position: [number, number, number] = [x, y, 2.61];

      x += wordWidth + SPACE_WIDTH;

      return { word, position };
    });
  }, [words]);

  return (
    <group position={[-maxLineWidth / 2, -0.8, 0]}>
      {lines.map(({ word, position }, i) => {
        const spring = useSpring({
          from: { scale: [0, 0, 0], opacity: 0, y: position[1] - 0.2 },
          to: {
            scale: show ? [1, 1, 1] : [0, 0, 0],
            opacity: show ? 1 : 0,
            y: show ? position[1] : position[1] - 0.2,
          },
          delay: i * 70,
          config: { tension: 180, friction: 14 },
        });

        return (
          <AnimatedText
            key={i}
            position-x={position[0]}
            position-y={spring.y}
            position-z={position[2]}
            font="/fonts/Iceberg-Regular.ttf"
            fontSize={fontSize}
            color="#ffffff"
            anchorX="left"
            anchorY="top"
            {...spring}
          >
            {word}
          </AnimatedText>
        );
      })}
    </group>
  );
}
