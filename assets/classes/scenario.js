import Ball from "./ball";
import Player from "./player";
import Runners from "./runner";

export default class Scenario {
  players;
  runners;
  balls;
  targets;
  title;
  description;
  constructor(players, runners, balls, targets, title, description) {
    this.players = players.map((p, i) => new Player(i + 1, ...p));
    this.runners = new Runners(runners).runners;
    this.balls = [new Ball(...balls)];
    this.targets = [];
    this.title = title;
    this.description = description;
  }
}
