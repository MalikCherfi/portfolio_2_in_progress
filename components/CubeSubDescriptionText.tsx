import CubeSubTextAnimated from "./CubeSubTextAnimated";
import { useCubeStore } from "@/stores/cubeStore";

const CubeSubDescriptionText = () => {
  const { isTextClicked } = useCubeStore();

  const components = {
    nomade_process: {
      component: () => (
        <CubeSubTextAnimated
          key="nomade_process"
          positionX={-2.61}
          positionZ={0}
          rotation={[0, Math.PI / 2 + Math.PI, 0] as [number, number, number]}
          lines={[
            {
              text: "Nomade Process est une plateforme SaaS qui facilite la mise à jour des documents de copropriété en mettant en relation les services gouvernementaux, les syndics et différents prestataires (avocats, notaires, géomètres, etc.).",
              addGap: true,
            },
            {
              text: "🛠️ Rôle : Lead Developer",
            },
            {
              text: "J’ai participé au projet de bout en bout :",
            },
            {
              text: "Analyse des besoins et participation aux spécifications fonctionnelles",
            },
            {
              text: "Conception technique de l’architecture",
            },
          ]}
        />
      ),
    },
  };

  return <>{isTextClicked.clicked && components[isTextClicked.id]?.component()}</>;
};

export default CubeSubDescriptionText;
