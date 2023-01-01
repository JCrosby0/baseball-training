export default class Target {
  type;
  positionName;
  positionNumber;
  angle;
  dist;
  constructor(angle, dist) {
    this.positionNumber = "target";
    this.type = "target";
    this.positionName = "target";
    this.angle = angle;
    this.dist = dist;
  }
}
