import Scenario from "~/assets/classes/scenario";

export const zrXBHitToRF = new Scenario("Extra bases hit to right");
zrXBHitToRF.addStep(
  [
    [-65, 108], //P
    [0, -5], //C
    [40, 90], //1B
    [12, 145], //2B
    [-45, 90], //3B
    [-1, 125], //SS
    [-27, 112], //LF
    [30, 275], //CF
    [40, 275], //RF
  ], // players
  [1.5, null, null, null], // runners
  [42, 280], // ball
  [], //targets NYI
  "Fielder responses to a hit to right field" // description
);
