import Scenario from "~/assets/classes/scenario";

export const zrXBHitToLF = new Scenario("Extra bases hit to left");
zrXBHitToLF.addStep(
  [
    [-57, 47], //P
    [0, -5], //C
    [20, 116], //1B
    [0, 127], //2B
    [-45, 90], //3B
    [-24, 148], //SS
    [-40, 266], //LF
    [-24, 267], //CF
    [43, 87], //RF
  ], // players
  [1.5, null, null, null], // runners
  [-41, 271], // ball
  [], //targets NYI
  "Fielder responses to a hit to left field" // description
);
