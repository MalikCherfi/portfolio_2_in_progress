import { Text } from "@react-three/drei";
import { animated, useSpring, easings } from "@react-spring/three";
import { useThree, useFrame } from "@react-three/fiber";
import { useCubeStore } from "@/stores/cubeStore";
import { PerspectiveCamera } from "three";
import { useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { handleTextOpacityOnScroll } from "../utils/handleTextOpacityOnScroll";
import { handleScroll } from "../utils/handleScroll";

const AnimatedText = animated(Text);

type Line = {
  text?: string;
  link?: string;
  cols?: { text: string; link: string; onClick?: () => void }[];
  onClick?: () => void;
  addGap?: boolean;
};

type Props = {
  positionX: number;
  positionZ: number;
  rotation?: [number, number, number];
  lines: Line[];
};

type HeightInfo = {
  totalHeight: number;
  addGap?: boolean;
};

export default function CubeSubTextAnimated({
  positionX,
  positionZ,
  rotation,
  lines,
}: Props) {
  const isTextClicked = useCubeStore((state) => state.isTextClicked);
  const zoomDone = useCubeStore((state) => state.zoomDone);
  const zoomCamera = useCubeStore((state) => state.zoomCamera);
  const { camera } = useThree();
  const perspectiveCamera = camera as PerspectiveCamera;
  const groupRef = useRef<THREE.Group>(null);
  const scrollTarget = useRef(0);
  const currentScroll = useRef(0);

  const [heights, setHeights] = useState<HeightInfo[]>(
    Array(lines.length).fill({ totalHeight: 0 }),
  );
  const lineOpacitiesRef = useRef<number[]>(Array(lines.length).fill(1));
  const textMeshRefs = useRef<(THREE.Mesh | null)[]>([]);

  const base = useMemo(() => {
    const w = window.innerWidth;
    const fontSize = w < 600 ? 0.05 : w < 900 ? 0.06 : 0.07;

    const distance = zoomCamera ? 5 : 20;
    const fovRad = (perspectiveCamera.fov * Math.PI) / 180;
    const visibleHeight = 2 * distance * Math.tan(fovRad / 2);
    const maxWidth = visibleHeight * perspectiveCamera.aspect * 0.45;

    return {
      fontSize,
      maxWidth,
      lineHeight: 1.45,
      visibleHeight,
    };
  }, [zoomCamera, perspectiveCamera.fov, perspectiveCamera.aspect]);

  const { targetY } = useMemo(() => {
    const targetDistance = zoomCamera ? 5 - 2.61 : 20 - 2.61;
    const fovRad = (perspectiveCamera.fov * Math.PI) / 180;
    const visibleHeight = 2 * targetDistance * Math.tan(fovRad / 2);
    return { targetY: -visibleHeight / 4 };
  }, [perspectiveCamera.fov, zoomCamera]);

  const offsets = useMemo(() => {
    const arr: number[] = [];
    let cumulative = 0;

    for (let i = 0; i < heights.length; i++) {
      arr.push(cumulative);

      const h = heights[i]?.totalHeight ?? 0;

      cumulative += h;

      if (heights[i]?.addGap) {
        cumulative += base.fontSize * base.lineHeight;
      }
    }

    return arr;
  }, [heights, base.fontSize, base.lineHeight]);

  const spring = useSpring({
    from: { y: targetY, opacity: 0 },
    to: { y: targetY, opacity: zoomDone && isTextClicked.clicked ? 1 : 0 },
    config: { duration: 1000, easing: easings.easeInOutSine },
  });

  useFrame(() => {
    if (!groupRef.current) return;

    groupRef.current.visible = perspectiveCamera.position.z <= 18;

    handleTextOpacityOnScroll(
      groupRef,
      offsets,
      base,
      lineOpacitiesRef,
      positionX,
      spring,
      textMeshRefs,
    );

    handleScroll(scrollTarget, currentScroll, groupRef);
  });

  useEffect(() => {
    let lastTouchY = 0;

    const handleWheel = (e: WheelEvent) => {
      scrollTarget.current += e.deltaY * 0.002;
    };

    const handleTouchStart = (e: TouchEvent) => {
      lastTouchY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const deltaY = lastTouchY - e.touches[0].clientY;
      lastTouchY = e.touches[0].clientY;
      scrollTarget.current += deltaY * 0.009;
    };

    window.addEventListener("wheel", handleWheel);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return (
    <group ref={groupRef}>
      {lines.map((line, index) => {
        return (
          <AnimatedText
            ref={(el) => (textMeshRefs.current[index] = el)}
            key={index}
            position={[positionX, spring.y.get() - offsets[index], positionZ]}
            rotation={rotation}
            font="/fonts/SpaceGrotesk-VariableFont_wght.ttf"
            fontSize={base.fontSize}
            maxWidth={base.maxWidth}
            lineHeight={base.lineHeight}
            letterSpacing={-0.015}
            color={line.link ? "#4ea1ff" : "#ffffff"}
            anchorX="center"
            anchorY="top"
            textAlign="center"
            material-transparent
            onSync={(self) => {
              const info = self.textRenderInfo;
              if (!info) return;

              const totalHeight = info.blockBounds[3] - info.blockBounds[1];

              setHeights((prev) => {
                const copy = [...prev];
                copy[index] = { totalHeight, addGap: line.addGap };
                return copy;
              });
            }}
            onClick={() => {
              if (line.link) {
                return window.open(line.link, "_blank", "noopener,noreferrer");
              }
              if (line.onClick) return line.onClick();
            }}
          >
            {line.text}
          </AnimatedText>
        );
      })}
    </group>
  );
}
