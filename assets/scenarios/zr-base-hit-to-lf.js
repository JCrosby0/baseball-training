import Scenario from "~/assets/classes/scenario";

export const zrBaseHitToLF = new Scenario(
  [
    [-57, 71], //P
    [0, -5], //C
    [45, 90], //1B
    [0, 125], //2B
    [-45, 90], //3B
    [-13, 150], //SS
    [-30, 230], //LF
    [-25, 245], //CF
    [22, 110], //RF
  ], // players
  [[-90, 5], [], [], []], // runners
  [-30, 223], // ball
  [], //targets NYI
  "Base hit to left field",
  "Fielder responses to a hit to left field" // description
);
