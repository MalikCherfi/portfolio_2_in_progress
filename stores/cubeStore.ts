import { create } from "zustand";

type CubeStore = {
  reset: boolean;
  setReset: (value: boolean) => void;
};

export const useCubeStore = create<CubeStore>((set) => ({
  reset: false,
  setReset: (value) => set({ reset: value }),
}));
