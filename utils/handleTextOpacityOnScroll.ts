import * as THREE from "three";
import { SpringValue } from "@react-spring/three";

type Base = {
  fontSize: number;
  maxWidth: number;
  lineHeight: number;
  visibleHeight: number;
};

type SpringWithOpacity = {
  opacity: SpringValue<number>;
};

export const handleTextOpacityOnScroll = (
  groupRef: React.RefObject<THREE.Group | null>,
  offsets: number[],
  base: Base,
  lineOpacitiesRef: React.MutableRefObject<number[]>,
  positionX: number,
  spring: SpringWithOpacity,
  textMeshRefs: React.MutableRefObject<(THREE.Mesh | null)[]>,
): void => {
  const groupY = groupRef.current!.position.y;

  const visibleTop = base.visibleHeight / 8;
  const visibleBottom = -base.visibleHeight / 3;
  const fadeDistance = 0.5;

  const newOpacities = offsets.map((offset) => {
    const y = groupY - offset;

    const topFadeStart = visibleTop - fadeDistance;
    const bottomFadeStart = visibleBottom + fadeDistance;

    if (y > topFadeStart) {
      return THREE.MathUtils.clamp(1 - (y - topFadeStart) / fadeDistance, 0, 1);
    }

    if (y < bottomFadeStart) {
      return THREE.MathUtils.clamp(
        1 - (bottomFadeStart - y) / fadeDistance,
        0,
        1,
      );
    }

    return 1;
  });

  lineOpacitiesRef.current = newOpacities;

  textMeshRefs.current.forEach((mesh, i) => {
    if (!mesh) return;
    mesh.position.x = newOpacities[i] <= 0.08 ? 9999 : positionX;
    (mesh.material as THREE.MeshBasicMaterial).opacity =
      spring.opacity.get() * lineOpacitiesRef.current[i];
  });
};
