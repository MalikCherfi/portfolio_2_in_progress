import * as THREE from "three";

export const handleScroll = (
  scrollTarget: React.RefObject<number>,
  currentScroll: React.RefObject<number>,
  groupRef: React.RefObject<THREE.Group | null>,
) => {
  const min = 0;
  const max = 5;

  scrollTarget.current = THREE.MathUtils.clamp(scrollTarget.current, min, max);

  currentScroll.current = THREE.MathUtils.lerp(
    currentScroll.current,
    scrollTarget.current,
    0.08,
  );

  groupRef.current!.position.y = currentScroll.current;
};
