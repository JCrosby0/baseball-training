import Scenario from "~/assets/classes/scenario";

export const zrXBHitToLCGap = new Scenario(
  [
    [-70, 70], //P
    [0, -5], //C
    [15, 90], //1B
    [0, 127], //2B
    [-45, 90], //3B
    [-17, 151], //SS
    [-20, 254], //LF
    [-10, 250], //CF
    [49, 87], //RF
  ], // players
  [[-90, 5], [], [], []], // runners
  [-14, 253], // ball
  [], //targets NYI
  "Extra bases hit to left centre gap",
  "Fielder responses to a hit to left field" // description
);
