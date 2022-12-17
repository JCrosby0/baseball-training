import Scenario from "~/assets/classes/scenario";

export const zrBaseHitToRF = new Scenario(
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
  [[-90, 5], [], [], []], // runners
  [30, 220], // ball
  [], //targets NYI
  "Base hit to right field",
  "Fielder responses to a hit to right field" // description
);
