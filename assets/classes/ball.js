export default class Ball {
  type;
  positionName;
  positionNumber;
  angle;
  dist;
  constructor(angle, dist) {
    this.positionNumber = "ball";
    this.type = "ball";
    this.positionName = "ball";
    this.angle = angle;
    this.dist = dist;
  }
}
