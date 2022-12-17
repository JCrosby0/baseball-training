import Scenario from "~/assets/classes/scenario";

export const zrXBHitToRCGap = new Scenario(
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
  [[-90, 5], [], [], []], // runners
  [20, 254], // ball
  [], //targets NYI
  "Extra bases hit to right-center gap",
  "Fielder responses to a hit to right field" // description
);
