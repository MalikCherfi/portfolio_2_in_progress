import { Text } from "@react-three/drei";
import { animated, useSpring, easings } from "@react-spring/three";
import { useThree, useFrame } from "@react-three/fiber";
import { useCubeStore } from "@/stores/cubeStore";
import { PerspectiveCamera } from "three";
import { useMemo, useRef, useCallback } from "react";
import * as THREE from "three";

const AnimatedText = animated(Text);

type Line = {
  text?: string;
  link?: string;
  cols?: { text: string; onClick?: () => void }[];
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
  columnCount,
}: Props) {
  const zoomCamera = useCubeStore((state) => state.zoomCamera);
  const zoomDone = useCubeStore((state) => state.zoomDone);
  const isTextClicked = useCubeStore((state) => state.isTextClicked);
  const { camera } = useThree();
  const perspectiveCamera = camera as PerspectiveCamera;
  const groupRef = useRef<THREE.Group>(null);

  // Refs vers chaque TextMesh, clé = `lineIndex-colIndex`
  const textRefs = useRef<Record<string, any>>({});
  // Hauteurs réelles mesurées par row, clé = `lineIndex-rowIndex`
  const measuredHeights = useRef<Record<string, number>>({});

  const base = useMemo(() => {
    const w = window.innerWidth;
    const fontSize = w < 600 ? 0.05 : w < 900 ? 0.06 : 0.07;
    const distance = zoomCamera ? 5 : 20;
    const fovRad = (perspectiveCamera.fov * Math.PI) / 180;
    const visibleHeight = 2 * distance * Math.tan(fovRad / 2);
    const maxWidth = visibleHeight * perspectiveCamera.aspect * 0.45;
    return { fontSize, maxWidth, lineGap: fontSize * 2 };
  }, [zoomCamera, perspectiveCamera.fov, perspectiveCamera.aspect]);

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

  const getColumnCount = () => (window.innerWidth < 1100 ? 2 : 4);

  // useFrame : repositionne tous les textes cols en fonction des hauteurs mesurées
  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.visible = perspectiveCamera.position.z <= 18;

    const baseY = spring.y.get();

    lines.forEach((line, lineIndex) => {
      if (!line.cols) return;

      const colCount = columnCount || getColumnCount();
      const colWidth = base.maxWidth / colCount;
      const rows = Math.ceil(line.cols.length / colCount);

      // Recalcule les offsets cumulatifs depuis les hauteurs réelles
      const rowOffsets: number[] = [0];
      for (let r = 1; r < rows; r++) {
        const prevHeight =
          measuredHeights.current[`${lineIndex}-${r - 1}`] ?? base.lineGap;
        rowOffsets[r] = rowOffsets[r - 1] + prevHeight + base.lineGap * 0.3;
      }

      for (let i = 0; i < line.cols.length; i++) {
        const col = i % colCount;
        const row = Math.floor(i / colCount);
        const ref = textRefs.current[`${lineIndex}-${i}`];
        if (!ref) continue;

        ref.position.x = positionX;
        ref.position.y = baseY - rowOffsets[row];
        ref.position.z = positionZ + (col - (colCount - 1) / 2) * colWidth;
      }
    });
  });

  // onSync : mesure la hauteur réelle du bloc de texte et garde la max par row
  const handleSync = useCallback(
    (lineIndex: number, colIndex: number) => (troika: any) => {
      const bounds = troika?.textRenderInfo?.blockBounds;
      if (!bounds) return;

      const height = Math.abs(bounds[3] - bounds[1]);
      const row = Math.floor(colIndex / (columnCount || getColumnCount()));
      const key = `${lineIndex}-${row}`;

      const prev = measuredHeights.current[key] ?? 0;
      // On garde la hauteur max de la row
      if (height > prev) {
        measuredHeights.current[key] = height;
      }
    },
    [columnCount],
  );

  return (
    <group ref={groupRef}>
      {lines.map((line, index) => {
        if (line.cols) {
          const colCount = columnCount || getColumnCount();
          const colWidth = base.maxWidth / colCount;

          return line.cols.map((col, i) => (
            <AnimatedText
              key={`${index}-${i}`}
              ref={(r) => {
                textRefs.current[`${index}-${i}`] = r;
              }}
              position={[positionX, spring.y.get(), positionZ]}
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
              onSync={handleSync(index, i)}
              onClick={() => {
                if (col.onClick) col.onClick();
              }}
              onPointerOver={
                col.onClick
                  ? () => (document.body.style.cursor = "pointer")
                  : undefined
              }
              onPointerOut={
                col.onClick
                  ? () => (document.body.style.cursor = "default")
                  : undefined
              }
            >
              {col.text}
            </AnimatedText>
          ));
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
              if (line.link)
                return window.open(line.link, "_blank", "noopener,noreferrer");
              if (line.onClick) return line.onClick();
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
