// stores/loaderStore.ts
import { create } from "zustand";

type LoaderStore = {
  isReady: boolean;
  setReady: () => void;
};

export const useLoaderStore = create<LoaderStore>((set) => ({
  isReady: false,
  setReady: () => set({ isReady: true }),
}));
