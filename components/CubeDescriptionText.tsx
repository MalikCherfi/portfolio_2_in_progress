import CubeTextAnimated from "./CubeTextAnimated";

const CubeDescriptionText = () => {
  const components = [
    {
      id: "welcome",
      positionX: 0,
      positionZ: 2.61,
      lines: [
        {
          text: "Bienvenue sur mon portfolio. Découvrez mes compétences et mon expérience. Je suis Malik Cherfi, développeur web passionné par la création d'expériences numériques innovantes et performantes. Explorez mes projets et n'hésitez pas à me contacter pour collaborer !",
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
          text: "www.linkedin.com/in/malik-cherfi",
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
        { text: "• JavaScript         • MongoDB" },
        { text: "• TypeScript         • PostgreSQL" },
        { text: "• React / Next.js    • Prisma" },
        { text: "• Node.js            • Three.js" },
        { text: "• Tailwind CSS       • Docker" },
      ],
    },
    {
      id: "about",
      positionX: -2.61,
      positionZ: 0,
      rotation: [0, Math.PI / 2 + Math.PI, 0] as [number, number, number],
      lines: [{ text: "LEARN MORE ABOUT ME" }],
    },
  ];

  return (
    <>
      {components.map((comp) => (
        <CubeTextAnimated
          key={comp.id}
          positionX={comp.positionX}
          positionZ={comp.positionZ}
          rotation={comp.rotation}
          lines={comp.lines}
        />
      ))}
    </>
  );
};

export default CubeDescriptionText;
