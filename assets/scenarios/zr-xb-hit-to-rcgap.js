import Scenario from "~/assets/classes/scenario";

export const zrXBHitToRCGap = new Scenario(
  "Extra bases hit to right-center gap"
);
zrXBHitToRCGap.addStep(
  [
    [-64, 100], //P
    [0, -5], //C
    [40, 90], //1B
    [9, 152], //2B
    [-45, 90], //3B
    [-1, 125], //SS
    [-21, 99], //LF
    [17, 258], //CF
    [23, 259], //RF
  ], // players
  [1.5, null, null, null], // runners
  [20, 254], // ball
  [], //targets NYI
  "Fielder responses to a hit to right field" // description
);
