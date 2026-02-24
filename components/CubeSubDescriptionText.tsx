import CubeSubTextAnimated from "./CubeSubTextAnimated";
import { useCubeStore } from "@/stores/cubeStore";

const CubeSubDescriptionText = () => {
  const { isTextClicked } = useCubeStore();

  const components = {
    nomade_process: {
      component: (
        <CubeSubTextAnimated
          key="nomade_process"
          positionX={-2.61}
          positionZ={0}
          rotation={[0, Math.PI / 2 + Math.PI, 0] as [number, number, number]}
          lines={[
            {
              text: "Nomade Process est une entreprise spécialisée dans la transformation numérique des entreprises. Ils offrent des solutions innovantes pour améliorer l'efficacité et la productivité des organisations.",
            },
          ]}
        />
      ),
    },
  };

  return <>{isTextClicked.clicked && components[isTextClicked.id].component}</>;
};

export default CubeSubDescriptionText;
