import Scenario from "~/assets/classes/scenario";

export const corners = new Scenario(
  [
    [0, 57],
    [0, -5],
    [35, 105],
    [15, 130],
    [-35, 105],
    [-15, 130],
    [-30, 230],
    [0, 240],
    [30, 230],
  ], // players
  [0, 1, 2, 3], // runners
  [-10, 60], // ball
  [], //targets NYI
  "Default",
  "Default field layout scenario" // description
);
