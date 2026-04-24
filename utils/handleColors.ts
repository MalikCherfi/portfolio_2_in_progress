type Theme = {
  name: string;
  from: string;
  to: string;
  cube: string;
  geo: string[];
};

type ChangeThemeParams = {
  animating: boolean;
  currentTheme: number;
  setNextTheme: (index: number | null) => void;
  setAnimating: (value: boolean) => void;
  setCubeColor: (color: string) => void;
  setGeoColors: (colors: string[]) => void;
};

type HandleAnimationEndParams = {
  nextTheme: number | null;
  setCurrentTheme: (index: number) => void;
  setNextTheme: (index: number | null) => void;
  setAnimating: (value: boolean) => void;
};

export const THEMES: Theme[] = [
  {
    name: "Rose",
    from: "#CE6A6B",
    to: "#EBACA2",
    cube: "#B6465F",
    geo: ["#B6465F", "#CE6A6B"],
  },
  {
    name: "Bordeaux",
    from: "#8B3A5A",
    to: "#C48AA4",
    cube: "#9c335f",
    geo: ["#9c335f", "#8B3A5A"],
  },
  {
    name: "Terracotta",
    from: "#C1614F",
    to: "#E8A98A",
    cube: "#c6513c",
    geo: ["#c6513c", "#C1614F"],
  },
];

export const changeTheme = ({
  animating,
  currentTheme,
  setNextTheme,
  setAnimating,
  setCubeColor,
  setGeoColors,
}: ChangeThemeParams) => {
  if (animating) return;
  const next = (currentTheme + 1) % THEMES.length;
  setNextTheme(next);
  setAnimating(true);
  setCubeColor(THEMES[next].cube);
  setGeoColors(THEMES[next].geo);
  return undefined;
};

export const handleAnimationEnd = ({
  nextTheme,
  setCurrentTheme,
  setNextTheme,
  setAnimating,
}: HandleAnimationEndParams) => {
  if (nextTheme === null) return;
  setCurrentTheme(nextTheme);
  setNextTheme(null);
  setAnimating(false);
  return undefined;
};
