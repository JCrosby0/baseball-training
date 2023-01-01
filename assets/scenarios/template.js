import Scenario from "~/assets/classes/scenario";

export const defaultScenario = new Scenario("Template");
defaultScenario.addStep(
  [
    [0, 57], //P
    [0, -15], //C
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
  "Template Step - 1" // description
);
defaultScenario.addStep(
  [
    [0, 57], //P
    [0, -5], //C
    [35, 115], //1B
    [15, 140], //2B
    [-35, 115], //3B
    [-15, 140], //SS
    [-30, 240], //LF
    [0, 250], //CF
    [30, 240], //RF
  ], // players
  [0, 1, 2, 3], // runners
  [-10, 60], // ball
  [], //targets NYI
  "Template Step - 2" // description
);
