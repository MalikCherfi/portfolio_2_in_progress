import CubeTextAnimated from "./CubeTextAnimated";

const CubeDescriptionText = () => {
  const components = [
    {
      id: "welcome",
      positionX: 0,
      positionZ: 2.61,
      description:
        "Bienvenue sur mon portfolio. Découvrez mes compétences et mon expérience. Je suis Malik Cherfi, développeur web passionné par la création d'expériences numériques innovantes et performantes. Explorez mes projets et n'hésitez pas à me contacter pour collaborer !",
    },
    {
      id: "contact",
      positionX: 0,
      positionZ: -2.61,
      rotation: [0, Math.PI, 0],
      description: "FEEL FREE TO REACH OUT TO ME",
    },
    {
      id: "skills",
      positionX: 2.61,
      positionZ: 0,
      rotation: [0, -Math.PI / 2 + Math.PI, 0],
      description: "DISCOVER MY SKILLS AND EXPERTISE",
    },
    {
      id: "about",
      positionX: -2.61,
      positionZ: 0,
      rotation: [0, Math.PI / 2 + Math.PI, 0],
      description: "LEARN MORE ABOUT ME",
    },
  ];
  return (
    <>
      {components.map((comp) => (
        <CubeTextAnimated
          key={comp.id}
          positionX={comp.positionX}
          positionZ={comp.positionZ}
          rotation={comp.rotation as [number, number, number] | undefined}
          description={comp.description}
        />
      ))}
    </>
  );
};

export default CubeDescriptionText;
