import * as THREE from "three";

export const rotateToFace = ({ face, targetQuaternion, setRotate }) => {
  const q = new THREE.Quaternion();

  switch (face) {
    case "front":
      q.setFromEuler(new THREE.Euler(0, 0, 0));
      break;
    case "back":
      q.setFromEuler(new THREE.Euler(0, Math.PI, 0));
      break;
    case "right":
      q.setFromEuler(new THREE.Euler(0, -Math.PI / 2, 0));
      break;
    case "left":
      q.setFromEuler(new THREE.Euler(0, Math.PI / 2, 0));
      break;
  }

  targetQuaternion.current.copy(q);
  setRotate({ reset: false, target_face: true }); // 👉 déclenche l'animation retour
};
