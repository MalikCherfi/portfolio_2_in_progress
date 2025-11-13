import { create } from "zustand";

type CubeStore = {
  reset: boolean;
  setReset: (value: boolean) => void;
  bounceY: number;
  setBounceY: (y: number) => void;
};

export const useCubeStore = create<CubeStore>((set) => ({
  reset: false,
  setReset: (value) => set({ reset: value }),

  bounceY: 0,
  setBounceY: (y: number) => set({ bounceY: y }),
}));
