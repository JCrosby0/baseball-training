import Scenario from "~/assets/classes/scenario";

export const basesLoaded = new Scenario(
  [
    [0, 57], //P
    [0, -5], //C
    [35, 105], //1B
    [15, 130], //2B
    [-35, 105], //3B
    [-15, 130], //SS
    [-30, 230], //LF
    [0, 240], //CF
    [30, 230], //RF
  ], // players
  [0, 1, 2, 3], // runners
  [-10, 60], // ball
  [], //targets NYI
  "Default - BL",
  "Default field layout scenario" // description
);
