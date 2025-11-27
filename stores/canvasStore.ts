import { create } from "zustand";

type CanvasStore = {
  isDraggingObject: boolean;
  setIsDraggingObject: (value: boolean) => void;
};

export const useCanvasStore = create<CanvasStore>((set) => ({
  isDraggingObject: false,
  setIsDraggingObject: (value) => set({ isDraggingObject: value }),
}));
