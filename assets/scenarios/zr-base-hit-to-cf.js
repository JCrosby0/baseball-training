import Scenario from "~/assets/classes/scenario";

export const zrBaseHitToCF = new Scenario(
  [
    [0, 80], //P
    [0, -5], //C
    [40, 90], //1B
    [0, 155], //2B
    [-45, 90], //3B
    [0, 130], //SS
    [-12, 245], //LF
    [0, 240], //CF
    [12, 245], //RF
  ], // players
  [[-90, 5], [], [], []], // runners
  [0, 235], // ball
  [], //targets NYI
  "Base hit to centre field",
  "Fielder responses to a hit to centre field" // description
);
