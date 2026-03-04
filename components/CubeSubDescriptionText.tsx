import CubeSubTextAnimated from "./CubeSubTextAnimated";
import { useCubeStore } from "@/stores/cubeStore";
import type { ProjectId } from "@/stores/cubeStore";

const CubeSubDescriptionText = () => {
  const { isTextClicked } = useCubeStore();

  const components: Record<ProjectId, { component: () => React.ReactElement }> =
    {
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
      ani_seniors: {
        component: () => (
          <CubeSubTextAnimated
            key="ani_seniors"
            positionX={-2.61}
            positionZ={0}
            rotation={[0, Math.PI / 2 + Math.PI, 0] as [number, number, number]}
            lines={[
              {
                text: "Ani Seniors est une application mobile qui met en relation les personnes âgées avec des aidants pour les aider dans leurs tâches quotidiennes.",
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
      occitanie_solutions: {
        component: () => (
          <CubeSubTextAnimated
            key="occitanie_solutions"
            positionX={-2.61}
            positionZ={0}
            rotation={[0, Math.PI / 2 + Math.PI, 0] as [number, number, number]}
            lines={[
              {
                text: "Occitanie Solutions est une plateforme qui met en relation les entreprises de la région Occitanie avec des prestataires de services pour les aider à trouver des solutions adaptées à leurs besoins.",
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
      demateriz: {
        component: () => (
          <CubeSubTextAnimated
            key="demateriz"
            positionX={-2.61}
            positionZ={0}
            rotation={[0, Math.PI / 2 + Math.PI, 0] as [number, number, number]}
            lines={[
              {
                text: "Démateriz est une plateforme qui permet aux entreprises de dématérialiser leurs processus de gestion documentaire en mettant en relation les différents acteurs (fournisseurs, clients, etc.).",
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
      vbr: {
        component: () => (
          <CubeSubTextAnimated
            key="vbr"
            positionX={-2.61}
            positionZ={0}
            rotation={[0, Math.PI / 2 + Math.PI, 0] as [number, number, number]}
            lines={[
              {
                text: "VBR est une application mobile qui permet aux utilisateurs de suivre leur consommation d’énergie et de réduire leur empreinte carbone en leur fournissant des conseils personnalisés.",
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
      adm: {
        component: () => (
          <CubeSubTextAnimated
            key="adm"
            positionX={-2.61}
            positionZ={0}
            rotation={[0, Math.PI / 2 + Math.PI, 0] as [number, number, number]}
            lines={[
              {
                text: "ADM est une plateforme qui permet aux entreprises de gérer leurs ressources humaines en mettant en relation les différents acteurs (employeurs, employés, etc.).",
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

  return (
    <>
      {isTextClicked.clicked &&
        isTextClicked.id &&
        components[isTextClicked.id].component()}
    </>
  );
};

export default CubeSubDescriptionText;
