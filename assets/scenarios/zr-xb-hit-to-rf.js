import Scenario from "~/assets/classes/scenario";

export const zrXBHitToRF = new Scenario(
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
  [[-90, 5], [], [], []], // runners
  [42, 280], // ball
  [], //targets NYI
  "Extra bases hit to right",
  "Fielder responses to a hit to right field" // description
);
