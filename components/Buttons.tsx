import { useCubeStore } from "@/stores/cubeStore";
import { useThemeStore } from "@/stores/themeStore";
import { RotateCcw, ArrowLeft, Palette } from "lucide-react";
import { changeTheme } from "@/utils/handleColors";

export const Buttons = () => {
  const setRotate = useCubeStore((state) => state.setRotate);
  const zoomCamera = useCubeStore((state) => state.zoomCamera);
  const setZoomCamera = useCubeStore((state) => state.setZoomCamera);
  const setZoomDone = useCubeStore((state) => state.setZoomDone);
  const isTextClicked = useCubeStore((state) => state.isTextClicked);
  const setIsTextClicked = useCubeStore((state) => state.setIsTextClicked);
  const animating = useThemeStore((state) => state.animating);
  const currentTheme = useThemeStore((state) => state.currentTheme);
  const setNextTheme = useThemeStore((state) => state.setNextTheme);
  const setAnimating = useThemeStore((state) => state.setAnimating);
  const setCubeColor = useThemeStore((state) => state.setCubeColor);
  const setGeoColors = useThemeStore((state) => state.setGeoColors);

  return (
    <div className="absolute top-5 left-5 z-10 flex gap-2">
      {!zoomCamera && (
        <>
          <button
            onClick={() => setRotate({ reset: true, target_face: false })}
            className="p-3 rounded-full bg-white/70 hover:bg-white shadow-md"
          >
            <RotateCcw size={22} />
          </button>

          <button
            onClick={() =>
              changeTheme({
                animating,
                currentTheme,
                setNextTheme,
                setAnimating,
                setCubeColor,
                setGeoColors,
              })
            }
            disabled={animating}
            className="p-3 rounded-full bg-white/70 hover:bg-white shadow-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Palette size={22} />
          </button>
        </>
      )}

      {zoomCamera && (
        <button
          onClick={() => {
            if (isTextClicked.clicked) {
              setIsTextClicked(false, undefined);
              setZoomDone(true);
              return;
            }

            setZoomDone(false);

            setTimeout(() => {
              setZoomCamera(false);
            }, 1000);
          }}
          className="p-3 rounded-full bg-white/70 hover:bg-white shadow-md"
        >
          <ArrowLeft size={22} />
        </button>
      )}
    </div>
  );
};
