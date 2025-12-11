import { create } from "zustand";

type CubeRotate = {
  reset: boolean;
  target_face: boolean;
};

type CubeStore = {
  rotate: CubeRotate;
  setRotate: (value: CubeRotate) => void;
  bounceY: number;
  setBounceY: (y: number) => void;
};

export const useCubeStore = create<CubeStore>((set) => ({
  rotate: { reset: false, target_face: false },
  setRotate: (value) => set({ rotate: value }),

  bounceY: 0,
  setBounceY: (y) => set({ bounceY: y }),
}));
