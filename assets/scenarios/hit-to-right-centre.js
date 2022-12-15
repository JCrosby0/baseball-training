import Scenario from "~/assets/classes/scenario";

export const hitRightCentre = new Scenario(
  [
    [-67, 91], //P
    [0, -5], //C
    [0, -30], //1B
    [5, 150], //2B
    [-45, 90], //3B
    [0, 125], //SS
    [-10, 95], //LF
    [17, 269], //CF
    [24, 293], //RF
  ], // players
  [[20, 100], [-20, 100], [], [135, 25]], // runners
  [17, 257], // ball
  [], //targets NYI
  "Hit to Right-Centre-Field",
  "Fielder responses to a hit to right center field" // description
);
