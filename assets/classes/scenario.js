import Ball from "./ball";
import Player from "./player";
import Runners from "./runner";
import Target from "./target";

export class Step {
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
    this.targets = [new Target(...targets)];
    this.title = title;
    this.description = description;
  }
}

export default class Scenario {
  title;
  steps;
  constructor(title) {
    this.title = title;
    this.steps = [];
  }
  addStep(players, runners, balls, targets, description) {
    this.steps.push(new Step(players, runners, balls, targets, description));
  }
}
