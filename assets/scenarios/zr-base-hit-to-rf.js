import Scenario from "~/assets/classes/scenario";

export const zrBaseHitToRF = new Scenario("Base hit to right field");
zrBaseHitToRF.addStep(
  [
    [0, 57], //P
    [0, -5], //C
    [40, 90], //1B
    [12, 145], //2B
    [-45, 90], //3B
    [-1, 125], //SS
    [-27, 112], //LF
    [21, 249], //CF
    [30, 230], //RF
  ], // players
  [0.5, null, null, null], // runners
  [30, 220], // ball
  [], //targets NYI
  "Fielder responses to a hit to right field" // description
);
