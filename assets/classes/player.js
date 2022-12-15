const baseballPositions = {
  1: "P",
  2: "C",
  3: "1B",
  4: "2B",
  5: "3B",
  6: "SS",
  7: "LF",
  8: "CF",
  9: "RF",
};

export default class Player {
  type;
  positionName;
  positionNumber;
  angle;
  dist;
  constructor(number, angle, dist) {
    this.positionNumber = number;
    this.type = "player";
    this.positionName = Object.keys(baseballPositions).includes(
      number.toString()
    )
      ? baseballPositions[number]
      : number;
    this.angle = angle;
    this.dist = dist;
  }
}
