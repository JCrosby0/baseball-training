<template>
  <div class="page">
    <nav>
      <h1>Diamond Training</h1>
    </nav>
    <div class="container">
      <div class="aside">
        <h2>Select a scenario:</h2>
        <div v-for="(scen, i) in scenarios" :key="'scenario' + i">
          <input
            type="radio"
            :id="scen.title"
            name="scenario"
            class=""
            :value="i"
            v-model="currentScenarioIndex"
          />
          <label :for="scen.title">{{ scen.title }}</label>
        </div>
        <h3>Select Step:</h3>
        <div
          class="step"
          v-for="(step, index) in currentScenario.steps"
          :key="'step-' + index"
        >
          <input
            type="radio"
            :id="'step-' + index"
            name="step"
            class=""
            :value="index"
            v-model="currentStepIndex"
          />
          <label :for="'step-' + index">{{ index }}</label>
        </div>
      </div>
      <div class="diamond">
        <div class="svg-wrapper">
          <svg id="playerOverlay" width="100%"></svg>
          <SVGDiamond id="fieldBackground" class="svg" width="100%" />
        </div>
      </div>
      <div class="summary">
        <h2>Scenario: {{ currentScenario.title }}</h2>
        <p>{{ currentStep.description }}</p>
        <p>{{ currentStep.title }}</p>
        <p>Runners: {{ currentStep.runners.map((r) => r.positionName) }}</p>
        <div class="position-info">
          <ul class="left">
            <li>
              Ball: Angle: {{ currentStep.balls[0].angle }}; Depth:
              {{ currentStep.balls[0].dist }}
            </li>
            <li>
              Target: Angle: {{ currentStep.targets[0].angle }}; Depth:
              {{ currentStep.targets[0].dist }}
            </li>
            <br />
            <li v-for="p in currentStep.players" :key="p.positionName">
              {{ p.positionName }}: Angle: {{ p.angle }}; Depth: {{ p.dist }}
            </li>
            <br />
            <li v-for="p in currentStep.runners" :key="p.positionName">
              {{ p.positionName }}: Angle: {{ p.angle }}; Depth: {{ p.dist }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SVGDiamond from "~/components/svg-diamond.vue";
import * as d3 from "d3";
import { glovePaths } from "~/components/pathGlove";
import { helmetPaths } from "~/components/pathHelmet";
import scenarios from "~/assets/scenarios/_all";

export default {
  name: "Diamond Training",
  components: {
    SVGDiamond,
  },
  mounted() {
    this.d3Update(this.currentStep);
  },
  data() {
    return {
      scale: 2.5,
      scenarios,
      currentScenarioIndex: 0,
      currentStepIndex: 0,
      //durations
      ballDuration: 2000,
      playerDuration: 4350,
      //paths
      glovePaths,
      helmetPaths,
      // d3 references
      svg: null, // the parent svg
      playerData: null, // players
      x: null, // x scale
      y: null, // y scale
    };
  },
  watch: {
    currentStepIndex(n, o) {
      if (n !== o) {
        this.d3Update(this.currentStep);
      }
    },
    currentScenarioIndex(n, o) {
      if (n !== o) {
        this.currentStepIndex = 0;

        this.d3Update(this.currentStep);
      }
    },
  },
  computed: {
    currentScenario() {
      return this.scenarios[this.currentScenarioIndex];
    },
    currentStep() {
      if (!this.currentScenario) return {};
      return this.currentScenario.steps[this.currentStepIndex];
    },
  },
  methods: {
    //
    translatePoint(d) {
      return `translate(${this.x(this.dePolarise(d.angle, d.dist).x)} ${this.y(
        this.dePolarise(d.angle, d.dist).y
      )})`;
    },
    // take a runner distance around the bases as a float, where [0-1] is on the home-first base path, etc.
    translateRunner(d) {
      d.runnerPosition; // 0-1, 1-2, 2-3, 3-4
      const bases = [
        { angle: 90, dist: 0 },
        { angle: 45, dist: 90 },
        { angle: 0, dist: Math.sqrt(2 * 90 ** 2) },
        { angle: -45, dist: 90 },
      ];
      const coords = bases.map((b) => {
        return {
          x: this.x(this.dePolarise(b.angle, b.dist).x),
          y: this.y(this.dePolarise(b.angle, b.dist).y),
        };
      });
      const runnerFloor = Math.max(0, Math.floor(d.runnerPosition));
      const runnerCeil = Math.min(4, Math.ceil(d.runnerPosition));
      const runnerFrac = d.runnerPosition % 1;

      const runnerX =
        coords[runnerFloor].x * (1 - runnerFrac) +
        coords[runnerCeil].x * runnerFrac;
      const runnerY =
        coords[runnerFloor].y * (1 - runnerFrac) +
        coords[runnerCeil].y * runnerFrac;
      return `translate(${runnerX} ${runnerY})`;
    },

    // take 'baseball' coordinates (x = degrees from centre line, y = distance from home plate towards CF) and convert to cartesian coordinates (home plate: 0, 0)
    dePolarise(angle, dist) {
      const cartX = dist * Math.sin((angle * Math.PI) / 180);
      const cartY = dist * Math.cos((angle * Math.PI) / 180);
      return { x: cartX, y: cartY };
    },

    // takes mouse coordinates? relative coordinates on the svg?
    // outputs polar coordinates
    polarise(inputX, inputY) {
      // remove d3 scale from the inputs
      const fieldX = this.x.invert(inputX);
      const fieldY = this.y.invert(inputY);
      // convert to polar coordinates
      const angle = Math.round(Math.atan(fieldX / fieldY) / (Math.PI / 180));
      const dist = Math.round(Math.sqrt(fieldX ** 2 + fieldY ** 2));
      return { angle, dist };
    },

    d3Update(data) {
      // d3 playing field setup
      const t = d3.transition().duration(750).ease(d3.easeLinear);
      const svgBG = document.querySelector("#fieldBackground");
      const width = svgBG.width ? svgBG.width.baseVal.value : 400;
      const height = svgBG.height ? svgBG.height.baseVal.value : 400;
      const svg = d3
        .select("#playerOverlay")
        .attr("width", width)
        .attr("height", height);
      const g = svg.append("g");

      // click and drag handlers
      function clicked(event, d) {
        if (event.defaultPrevented) return; // dragged

        d3.select(this)
          .transition()
          .attr("fill", "black")
          .transition()
          .attr("fill", "red");
      }
      function dragstarted() {
        // d3.select(this).attr("stroke", null);
      }
      function dragged(event, d) {
        // handle ball
        if (d.type === "ball") {
          d3.selectAll(".ball").raise().attr("cx", event.x).attr("cy", event.y);
          d3.selectAll(".ball-line").attr("x1", event.x).attr("y1", event.y);
        } else {
          // handle player, runner, target, anything that doesn't have multiple components
          d3.select(this)
            .raise()
            .attr("transform", (d) => {
              return `translate(${event.x} ${event.y})`;
            });
        }
      }
      const dragended = (event, d) => {
        const { angle, dist } = this.polarise(event.x, event.y);
        let target;
        switch (d.type) {
          case "ball":
            target = data.balls[0];
            break;
          case "target":
            target = data.targets[0];
            break;
          case "runner":
            target = data.runners.find(
              (r) => r.positionNumber === d.positionNumber
            );
            break;
          case "player":
            target = data.players.find(
              (p) => p.positionNumber === d.positionNumber
            );
            break;
          default:
            console.log("unknown object type");
        }

        target.angle = angle;
        target.dist = dist;
        const scenario = this.scenarios[this.currentScenarioIndex];
        scenario.balls = data.balls;
        scenario.players = data.players;
        scenario.runners = data.runners;
        scenario.targets = data.targets;
        // d3.select(d).attr("stroke", "black");
      };
      const drag = d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);

      // d3 scales
      // x is conceptually rotation from 3rd around to 1st, with 2nd = 0
      // it ends up being x coordinate on the svg

      this.x = d3.scaleLinear().domain([-250, 250]).range([0, width]);
      // y is conceptually distance in ft from home plate, towards CF
      // it ends up being y coordinate on the svg
      this.y = d3
        .scaleLinear()
        .domain([0, 350])
        .range([height - 115, 0]);

      // d3 drawing

      // players
      this.playerData = svg
        .selectAll(".player-g")
        .data(data.players, (d) => d.positionName);
      this.playerData.join(
        (enter) => {
          const playerDataEnter = enter
            .append("g")
            .attr("class", "player-g")
            .call(drag)
            .on("click", clicked)
            .attr("transform", (d) => this.translatePoint(d));
          this.glovePaths.forEach((path) => {
            playerDataEnter
              .append("path")
              .attr("class", "svg-glove")
              .attr("d", path)
              .attr("transform", "translate(-14, -18) scale(0.12)");
          });
          // playerDataEnter
          //   .append("circle")
          //   .attr("fill", "red")
          //   .attr("stroke", "black")
          //   .attr("cx", 0)
          //   .attr("cy", 0)
          //   .attr("r", 5);
          playerDataEnter
            .append("text")
            .attr("x", 0)
            .attr("y", 10)
            .attr("class", "text")
            // .attr("text-anchor", "middle")
            .text((d) => d.positionName);
        },
        (update) => {
          update
            .transition(t)
            .duration(500)
            .attr("transform", (d) => this.translatePoint(d));
        },
        (exit) => exit.remove()
      );

      // runners
      const runnerData = svg
        .selectAll(".runner-g")
        .data(data.runners, (d) => d.positionName);
      runnerData.join(
        (enter) => {
          const runnerDataEnter = enter
            .append("g")
            .attr("class", "runner-g")
            .attr("transform", (d) => this.translateRunner(d))
            .call(drag)
            .on("click", clicked);
          this.helmetPaths.forEach((path) => {
            runnerDataEnter
              .append("path")
              .attr("class", "svg-helmet")
              .attr("d", path)
              .attr("transform", "translate(15, 5) scale(0.004) rotate(180)");
          });
          // runnerDataEnter
          //   .append("circle")
          //   .attr("fill", "blue")
          //   .attr("stroke", "black")
          //   .attr("cx", 0)
          //   .attr("cy", 0)
          //   .attr("r", 5);
          runnerDataEnter
            .append("text")
            .attr("x", 0)
            .attr("y", 6)
            .attr("class", "text")
            .text((d) => d.positionName);
        },
        (update) => {
          update
            .transition(t)
            .duration(this.playerDuration)
            .attr("transform", (d) => this.translateRunner(d));
        },
        (exit) => {
          exit.remove();
        }
      );

      // ball
      const ballData = svg
        .selectAll(".ball")
        .data(data.balls, (d) => d.positionName);
      ballData.join(
        (enter) => {
          enter
            .append("circle")
            .attr("class", "ball")
            .attr("r", 5)
            .on("click", clicked)
            .attr("cx", (d) => this.x(this.dePolarise(d.angle, d.dist).x))
            .attr("cy", (d) => this.y(this.dePolarise(d.angle, d.dist).y))
            .call(drag);
        },
        (update) => {
          update
            .transition(t)
            .duration(this.ballDuration)
            .attr("cx", (d) => this.x(this.dePolarise(d.angle, d.dist).x))
            .attr("cy", (d) => this.y(this.dePolarise(d.angle, d.dist).y));
        },
        (exit) => {
          exit.remove();
        }
      );

      // ball-line
      const ballLineData = svg
        .selectAll(".ball-line")
        .data(data.balls, (d) => d.positionName);
      ballLineData.join(
        (enter) => {
          enter
            .append("line")
            .attr("class", "ball-line")
            .attr("x1", (d) => this.x(this.dePolarise(d.angle, d.dist).x))
            .attr("y1", (d) => this.y(this.dePolarise(d.angle, d.dist).y))
            .attr("x2", (d) => this.x(this.dePolarise(0, 0).x))
            .attr("y2", (d) => this.y(this.dePolarise(0, 0).y))
            .attr("stroke", "black")
            .attr("stroke-dasharay", "5");
        },
        (update) => {
          update
            .transition(t)
            .duration(2000)
            .attr("x1", (d) => this.x(this.dePolarise(d.angle, d.dist).x))
            .attr("y1", (d) => this.y(this.dePolarise(d.angle, d.dist).y))
            .attr("x2", (d) => this.x(this.dePolarise(0, 0).x))
            .attr("y2", (d) => this.y(this.dePolarise(0, 0).y));
        },
        (exit) => {
          exit.remove();
        }
      );

      // targets
      const targetData = svg
        .selectAll(".target")
        .data(data.targets, (d) => d.positionName);
      targetData.join(
        (enter) => {
          const targetDataEnter = enter
            .append("g")
            .attr("transform", (d) => this.translatePoint(d))
            .call(drag);
          targetDataEnter
            .append("circle")
            .attr("class", "target circle")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", "20");
          targetDataEnter
            .append("line")
            .attr("class", "target line")
            .attr("x1", -20)
            .attr("x2", 20);
          targetDataEnter
            .append("line")
            .attr("class", "target line")
            .attr("y1", -20)
            .attr("y2", 20);
        },
        (update) => {
          update
            .transition(t)
            .duration(500)
            .attr("class", (d) => (d.angle || d.distance ? "hidden" : "target"))
            .attr("cx", (d) => this.x(this.dePolarise(d.angle, d.dist).x))
            .attr("cy", (d) => this.y(this.dePolarise(d.angle, d.dist).y));
        },
        (exit) => {
          exit.remove();
        }
      );
    },
  },
};
</script>

<style>
:root {
  --color-team-1: coral;
  --color-team-2: lightblue;
}
*,
html,
body {
  margin: 0;
  padding: 0;
}
.container {
  /* min-height: 100vh; */
  max-width: 100vw;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
}
.aside {
  width: 250px;
  border: 1px grey solid;
  height: 100%;
}
.main {
  flex: 0 0 auto;
}
.summary {
  flex: 1 1 250px;
}
.svg-wrapper {
  width: min(80vh, 80vw);
  aspect-ratio: 1.15;
  overflow: hidden;
  position: relative;
}
.svg {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  margin: 10px auto;
  /* margin: auto; */
}
.players {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  rotate: -45deg;
  translate: 35px -300px;
  scale: 1;
}
.player {
  position: absolute;
  rotate: 45deg;
  color: white;
}
.left {
  text-align: left;
}
.position-info {
  padding: 1em;
}
.hidden {
  display: none;
}
.player-g,
.runner-g,
.ball,
.target {
  cursor: move;
  stroke-width: 0.11px;
  stroke: black;
  fill: rgba(255 255 255 / 0.01);
}
.svg-glove,
.svg-helmet {
}
.ball {
  fill: white;
  stroke: red;
  stroke-width: 1px;
}
.svg-glove {
  stroke-width: 1px;
  stroke: var(--color-team-1);
  fill: var(--color-team-1);
}
.svg-glove:first-of-type {
  fill: black;
}
.svg-glove:nth-of-type(4) {
  fill: var(--color-team-1);
}
.svg-helmet {
  stroke-width: 300px;
  stroke: black;
  fill: var(--color-team-2);
}
.text {
  pointer-events: none;
  /* cursor: none; */
  fill: black;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 12px;
  text-rendering: optimizeLegibility;
  text-anchor: middle;
}
.target {
  stroke: red;
  stroke-width: 1px;
  fill: rgba(255 0 0 / 0.1);
}
.line {
  stroke-dasharray: 5px 30px 5px;
}
</style>
