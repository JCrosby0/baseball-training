import Scenario from "~/assets/classes/scenario";

export const zrXBHitToLCGap = new Scenario(
  "Extra bases hit to left centre gap"
);
zrXBHitToLCGap.addStep(
  [
    [0, 57], //P
    [0, -15], //C
    [35, 105], //1B
    [15, 130], //2B
    [-35, 105], //3B
    [-15, 130], //SS
    [-30, 230], //LF
    [0, 240], //CF
    [30, 230], //RF
  ], // players
  [0, null, null, null], // runners
  [-0, 0], // ball
  [0, 0], //targets NYI
  "Initial position, no runners on" // description
);
zrXBHitToLCGap.addStep(
  [
    [0, 57], //P
    [0, -15], //C
    [35, 105], //1B
    [15, 130], //2B
    [-35, 105], //3B
    [-15, 130], //SS
    [-30, 230], //LF
    [0, 240], //CF
    [30, 230], //RF
  ], // players
  [1, null, null, null], // runners
  [-14, 253], // ball
  [0, 0], //targets NYI
  "Ball hit to center left field" // description
);
zrXBHitToLCGap.addStep(
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
  [1.5, null, null, null], // runners
  [-14, 253], // ball
  [0, 127], //targets NYI
  "Fielder responses, throw to second" // description
);
zrXBHitToLCGap.addStep(
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
  [2, null, null, null], // runners
  [0, 127], // ball
  [0, 127], //targets NYI
  "Ball and Batter make it to second" // description
);
