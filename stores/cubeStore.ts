import { create } from "zustand";

export type ProjectId =
  | "nomade_process"
  | "ani_seniors"
  | "occitanie_solutions"
  | "demateriz"
  | "vbr"
  | "adm";

type CubeRotate = {
  reset: boolean;
  target_face: boolean;
  face?: "front" | "back" | "left" | "right";
};

type CubeStore = {
  rotate: CubeRotate;
  setRotate: (value: CubeRotate) => void;
  bounceY: number;
  setBounceY: (y: number) => void;
  zoomCamera: boolean;
  setZoomCamera: (zoom: boolean) => void;
  zoomDone: boolean;
  setZoomDone: (zoom: boolean) => void;
  isTextClicked: {
    clicked: boolean;
    id: ProjectId | undefined;
  };
  setIsTextClicked: (clicked: boolean, id?: ProjectId) => void;
  cubeColor: string;
  setCubeColor: (color: string) => void;
  geoColors: string[];
  setGeoColors: (colors: string[]) => void;
};

export const useCubeStore = create<CubeStore>((set) => ({
  rotate: { reset: false, target_face: false },
  setRotate: (value) => set({ rotate: value }),

  bounceY: 0,
  setBounceY: (y) => set({ bounceY: y }),

  zoomCamera: false,
  setZoomCamera: (zoom) => set({ zoomCamera: zoom }),

  zoomDone: false,
  setZoomDone: (zoom) => set({ zoomDone: zoom }),

  isTextClicked: { clicked: false, id: undefined },
  setIsTextClicked: (clicked, id) =>
    set({ isTextClicked: { clicked, id: id || undefined } }),

  cubeColor: "#B6465F",
  setCubeColor: (color) => set({ cubeColor: color }),

  geoColors: ["#B6465F", "#CE6A6B"],
  setGeoColors: (colors) => set({ geoColors: colors }),
}));
