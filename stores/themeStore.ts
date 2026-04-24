import { create } from "zustand";

type ThemeStore = {
  cubeColor: string;
  setCubeColor: (color: string) => void;
  geoColors: string[];
  setGeoColors: (colors: string[]) => void;
};

export const useThemeStore = create<ThemeStore>((set) => ({
  cubeColor: "#B6465F",
  setCubeColor: (color) => set({ cubeColor: color }),

  geoColors: ["#B6465F", "#CE6A6B"],
  setGeoColors: (colors) => set({ geoColors: colors }),
}));
