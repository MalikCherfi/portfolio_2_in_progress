import { Text } from "@react-three/drei";
import { animated, useSpring, easings } from "@react-spring/three";
import { useThree, useFrame } from "@react-three/fiber";
import { useCubeStore } from "@/stores/cubeStore";
import { PerspectiveCamera } from "three";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const AnimatedText = animated(Text);

type Line = {
  text?: string;
  link?: string;
  cols?: { text: string; link: string; onClick?: () => void }[];
  onClick?: () => void;
};

type Props = {
  positionX: number;
  positionZ: number;
  rotation?: [number, number, number];
  lines: Line[];
  columnCount?: number;
};

export default function CubeTextAnimated({
  positionX,
  positionZ,
  rotation,
  lines,
  columnCount
}: Props) {
  const { zoomDone, isTextClicked, zoomCamera } = useCubeStore();
  const { camera } = useThree();
  const perspectiveCamera = camera as PerspectiveCamera;
  const groupRef = useRef<THREE.Group>(null);

  // base fontSize et gaps
  const base = useMemo(() => {
    const w = window.innerWidth;
    const fontSize = w < 600 ? 0.05 : w < 900 ? 0.06 : 0.07;

    const distance = zoomCamera ? 5 : 20;

    const fovRad = (camera.fov * Math.PI) / 180;

    const visibleHeight = 2 * distance * Math.tan(fovRad / 2);

    const maxWidth = visibleHeight * camera.aspect * 0.45;

    return {
      fontSize,
      maxWidth,
      lineGap: fontSize * 2,
    };
  }, [zoomCamera, camera.fov, camera.aspect]);

  const { targetY } = useMemo(() => {
    const targetDistance = zoomCamera ? 5 - 2.61 : 20 - 2.61;
    const fovRad = (perspectiveCamera.fov * Math.PI) / 180;
    const visibleHeight = 2 * targetDistance * Math.tan(fovRad / 2);
    return { targetY: -visibleHeight / 4 };
  }, [perspectiveCamera.fov, zoomCamera]);

  const spring = useSpring({
    from: { y: targetY, opacity: 0 },
    to: { y: targetY, opacity: zoomDone && !isTextClicked.clicked ? 1 : 0 },
    config: { duration: 1000, easing: easings.easeInOutSine },
  });

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.visible = perspectiveCamera.position.z <= 18;
  });

  const getColumnCount = () => {
    const w = window.innerWidth;
    if (w < 1100) return 2;
    return 4;
  };

  const estimateLineCount = (text: string, maxWidth: number) => {
    // estimation grossière mais stable
    const avgCharWidth = base.fontSize * 0.6;
    const charsPerLine = maxWidth / avgCharWidth;
    return Math.ceil(text.length / charsPerLine);
  };

  return (
    <group ref={groupRef}>
      {lines.map((line, index) => {
        let currentY = spring.y.get();

        if (line.cols) {
          const colCount = columnCount || getColumnCount();
          const colWidth = base.maxWidth / colCount;
          const rows = Math.ceil(line.cols.length / colCount);

          const elements = [];

          for (let i = 0; i < line.cols.length; i++) {
            const col = i % colCount;
            const row = Math.floor(i / colCount);

            const text = line.cols[i].text;
            const onClick = line.cols[i].onClick;
            const lineCount = estimateLineCount(text, colWidth);

            elements.push(
              <AnimatedText
                key={`${index}-${i}`}
                position={[
                  positionX,
                  currentY - row * base.lineGap * lineCount,
                  positionZ + (col - (colCount - 1) / 2) * colWidth,
                ]}
                rotation={rotation}
                font="/fonts/SpaceGrotesk-VariableFont_wght.ttf"
                fontSize={base.fontSize}
                maxWidth={colWidth * 0.9}
                lineHeight={1.3}
                anchorX="center"
                anchorY="top"
                textAlign="center"
                material-opacity={spring.opacity}
                material-transparent
                onClick={() => {
                  if (onClick) {
                    return onClick();
                  }

                  return undefined;
                }}
                onPointerOver={
                  onClick
                    ? () => (document.body.style.cursor = "pointer")
                    : undefined
                }
                onPointerOut={
                  onClick
                    ? () => (document.body.style.cursor = "default")
                    : undefined
                }
              >
                {text}
              </AnimatedText>,
            );
          }

          // 🔥 on décale le curseur Y pour la prochaine ligne
          currentY -= rows * base.lineGap * 1.6;

          return elements;
        }

        return (
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
            onClick={() => {
              if (line.link) {
                return window.open(line.link, "_blank", "noopener,noreferrer");
              }

              if (line.onClick) {
                return line.onClick();
              }

              return undefined;
            }}
            onPointerOver={
              line.link || line.onClick
                ? () => (document.body.style.cursor = "pointer")
                : undefined
            }
            onPointerOut={
              line.link || line.onClick
                ? () => (document.body.style.cursor = "default")
                : undefined
            }
          >
            {line.text}
          </AnimatedText>
        );
      })}
    </group>
  );
}
