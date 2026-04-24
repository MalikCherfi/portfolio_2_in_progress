import { useThemeStore } from "@/stores/themeStore";
import { handleAnimationEnd, THEMES } from "../utils/handleColors";

export const BackgroundColor = () => {
  const currentTheme = useThemeStore((state) => state.currentTheme);
  const setCurrentTheme = useThemeStore((state) => state.setCurrentTheme);
  const nextTheme = useThemeStore((state) => state.nextTheme);
  const setNextTheme = useThemeStore((state) => state.setNextTheme);
  const setAnimating = useThemeStore((state) => state.setAnimating);

  const cur = THEMES[currentTheme];
  const nxt = nextTheme !== null ? THEMES[nextTheme] : null;

  return (
    <>
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to top, ${cur.from}, ${cur.to})`,
        }}
      />

      {nxt && (
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, ${nxt.from}, ${nxt.to})`,
            clipPath: "circle(0% at 50% 50%)",
            animation:
              "ripple-expand 3000ms cubic-bezier(0.4, 0, 0.2, 1) forwards",
          }}
          onAnimationEnd={() =>
            handleAnimationEnd({
              nextTheme,
              setCurrentTheme,
              setNextTheme,
              setAnimating,
            })
          }
        />
      )}

      <style>{`
        @keyframes ripple-expand {
            from { clip-path: circle(0% at 50% 50%); }
            to   { clip-path: circle(150% at 50% 50%); }
            }
            `}</style>
    </>
  );
};
