import { create } from "zustand";

type ThemeStore = {
  cubeColor: string;
  setCubeColor: (color: string) => void;
  geoColors: string[];
  setGeoColors: (colors: string[]) => void;
  currentTheme: number;
  setCurrentTheme: (index: number) => void;
  animating: boolean;
  setAnimating: (value: boolean) => void;
  nextTheme: number | null;
  setNextTheme: (index: number | null) => void;
};

export const useThemeStore = create<ThemeStore>((set) => ({
  cubeColor: "#B6465F",
  setCubeColor: (color) => set({ cubeColor: color }),

  geoColors: ["#B6465F", "#CE6A6B"],
  setGeoColors: (colors) => set({ geoColors: colors }),

  currentTheme: 0,
  setCurrentTheme: (index) => set({ currentTheme: index }),

  animating: false,
  setAnimating: (value) => set({ animating: value }),

  nextTheme: null,
  setNextTheme: (index) => set({ nextTheme: index }),
}));
