"use client";

import Cube from "./Cube";

const geometries = [
  {
    id: "cube",
    type: "box",
    component: "RoundedBox",
    position: [0, 0, 0], // centre
    rotation: [0, 0, 0],
    args: [5.2, 5.2, 5.2], // width, height, depth
    radius: 0.04,
    smoothness: 4,
    color: "#B6465F",
  },

  {
    id: "sphere",
    type: "sphere",
    component: "Sphere",
    position: [20, 0, 20], // 🔵 côté droit sur X
    rotation: [0, 0, 0],
    args: [3, 32, 32], // radius, widthSegments, heightSegments
    color: "#B6465F",
  },

  {
    id: "pyramid",
    type: "cone",
    component: "Cone",
    position: [-20, 0, 20], // 🔺 côté gauche sur X
    rotation: [0, Math.PI, 0],
    args: [3.5, 6, 4], // radius, height, radialSegments (4 = pyramide)
    color: "#B6465F",
  },

  {
    id: "losange",
    type: "octahedron",
    component: "Octahedron",
    position: [0, 0, 40], // 🔷 derrière Z-
    rotation: [0, 0, 0],
    args: [4, 0], // radius, detail
    color: "#B6465F",
  },
];

const Geometries = () => {
  return geometries.map((geo) => <Cube geo={geo} />);
};

export default Geometries;
