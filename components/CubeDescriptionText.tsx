import CubeTextAnimated from "./CubeTextAnimated";
import { useCubeStore } from "@/stores/cubeStore";

const CubeDescriptionText = () => {
  const { setIsTextClicked, isTextClicked } = useCubeStore();

  const components = [
    {
      id: "welcome",
      positionX: 0,
      positionZ: 2.61,
      lines: [
        {
          text: "Bienvenue sur mon portfolio. Découvrez mes compétences et mon expérience.\nJe suis Malik Cherfi, développeur web passionné par la création d'expériences numériques innovantes et performantes. Explorez mes projets et n'hésitez pas à me contacter pour collaborer !",
        },
      ],
    },
    {
      id: "contact",
      positionX: 0,
      positionZ: -2.61,
      rotation: [0, Math.PI, 0] as [number, number, number],
      lines: [
        { text: "malikcherfi@gmail.com" },
        { text: "+33 6 47 32 09 96" },
        { text: "Toulouse, France" },
        {
          text: "LinkedIn",
          link: "https://www.linkedin.com/in/malik-cherfi",
        },
      ],
    },
    {
      id: "skills",
      positionX: 2.61,
      positionZ: 0,
      rotation: [0, -Math.PI / 2 + Math.PI, 0] as [number, number, number],
      lines: [
        {
          cols: [
            { text: "React" },
            { text: "NodeJs" },
            { text: "VueJs" },
            { text: "NextJs" },
            { text: "NuxtJs" },
            { text: "MongoDB" },
            { text: "Prisma" },
            { text: "Mongoose" },
            { text: "MySQL" },
            { text: "TypeScript" },
            { text: "JavaScript" },
            { text: "Tailwind CSS" },
            { text: "ThreeJs" },
            { text: "Drei" },
            { text: "Jest" },
            { text: "GitHub" },
            { text: "GitLab" },
          ],
        },
      ],
    },
    {
      id: "projects",
      positionX: -2.61,
      positionZ: 0,
      rotation: [0, Math.PI / 2 + Math.PI, 0] as [number, number, number],
      columnCount: 2,
      lines: [
        {
          cols: [
            {
              text: "Nomade Process",
              onClick: () => {
                setIsTextClicked(true, "nomade_process");
              },
            },
            {
              text: "Ani Seniors",
              onClick: () => {
                setIsTextClicked(true, "ani_seniors");
              },
            },
            {
              text: "Occitanie solutions",
              onClick: () => {
                setIsTextClicked(true, "occitanie_solutions");
              },
            },
            {
              text: "Démateriz",
              onClick: () => {
                setIsTextClicked(true, "demateriz");
              },
            },
            {
              text: "VBR",
              onClick: () => {
                setIsTextClicked(true, "vbr");
              },
            },
            {
              text: "ADM",
              onClick: () => {
                setIsTextClicked(true, "adm");
              },
            },
          ],
        },
      ],
    },
  ];

  return (
    <>
      {components.map(
        (comp) =>
          !isTextClicked.clicked && (
            <CubeTextAnimated
              key={comp.id}
              positionX={comp.positionX}
              positionZ={comp.positionZ}
              rotation={comp.rotation}
              lines={comp.lines}
              columnCount={comp.columnCount}
            />
          ),
      )}
    </>
  );
};

export default CubeDescriptionText;
