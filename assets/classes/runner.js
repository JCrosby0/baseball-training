export default class Runners {
  runners;
  constructor(inArray) {
    this.runners = [];
    for (let i = 0; i < 4; i++) {
      if (inArray.includes(i)) {
        this.runners.push(new Runner(i));
      }
    }
    for (let i = 0; i < inArray.length; i++) {
      if (Array.isArray(inArray[i]) && inArray[i].length === 2) {
        this.runners.push(new Runner(i, ...inArray[i]));
      }
    }
  }
}
const runnerDefaultLocations = [
  { angle: 90, dist: 5 },
  { angle: 45, dist: 90 },
  { angle: 0, dist: Math.sqrt(2 * 90 ** 2) },
  { angle: -45, dist: 90 },
];
const runnerNames = {
  0: "B",
  1: "R1",
  2: "R2",
  3: "R3",
};
export class Runner {
  type;
  positionName;
  positionNumber;
  angle;
  dist;
  constructor(number, angle = null, dist = null) {
    this.positionNumber = number;
    this.type = "runner";
    this.positionName = runnerNames[number];
    this.angle = angle || runnerDefaultLocations[number].angle;
    this.dist = dist || runnerDefaultLocations[number].dist;
  }
}
