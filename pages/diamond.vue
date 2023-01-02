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
import * as d3du from "~/assets/scripts/d3DiamondUtils";
import { glovePaths } from "~/components/pathGlove";
import { helmetPaths } from "~/components/pathHelmet";
import { ballPaths } from "~/components/pathBall";
import scenarios from "~/assets/scenarios/_all";

export default {
  name: "Diamond Training",
  components: {
    SVGDiamond,
  },
  mounted() {
    this.d3Update(this.currentStep);
    // Access public variables
    const config = useRuntimeConfig();
  },
  data() {
    return {
      scale: 2.5,
      scenarios,
      currentScenarioIndex: 0,
      currentStepIndex: 0,
      //durations
      ballDuration: 350,
      playerDuration: 350,
      //paths
      glovePaths,
      helmetPaths,
      ballPaths,
      // d3 references
      svg: null, // the parent svg
      playerData: null, // players

      zones: [
        {
          angle: 35,
          dist: 100,
          rx: 25,
          ry: 10,
          rotate: 45,
        },
        {
          angle: 12.5,
          dist: 125,
          rx: 40,
          ry: 15,
          rotate: 20,
        },
        {
          angle: -12.5,
          dist: 125,
          rx: 40,
          ry: 15,
          rotate: -20,
        },
        {
          angle: -35,
          dist: 100,
          rx: 25,
          ry: 10,
          rotate: -45,
        },
      ],
      infieldSectors: [
        { a1: -45, a2: -25, dist: 325, flag1: 0, flag2: 1 },
        { a1: -25, a2: 0, dist: 325, flag1: 0, flag2: 1 },
        { a1: 0, a2: 25, dist: 325, flag1: 0, flag2: 1 },
        { a1: 25, a2: 45, dist: 325, flag1: 0, flag2: 1 },
      ],
      outfieldSectors: [
        { a1: -45, a2: -15, dist: 325, flag1: 0, flag2: 1 },
        { a1: -15, a2: 15, dist: 325, flag1: 0, flag2: 1 },
        { a1: 15, a2: 45, dist: 325, flag1: 0, flag2: 1 },
      ],
      sectors: [
        { a1: -45, a2: -15, dist: 325, flag1: 0, flag2: 1 },
        { a1: -15, a2: 15, dist: 325, flag1: 0, flag2: 1 },
        { a1: 15, a2: 45, dist: 325, flag1: 0, flag2: 1 },
      ],
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
    d3Update(data) {
      // d3 playing field setup
      const t = d3.transition().duration(350).ease(d3.easeLinear);

      // get the dimensions of the svg to setup up coordinate system
      const svgBG = document.querySelector("#fieldBackground");
      const width = svgBG.width ? svgBG.width.baseVal.value : 400;
      const height = svgBG.height ? svgBG.height.baseVal.value : 400;

      // set up the d3 scales to convert between values and coordinates

      // x is conceptually rotation from 3rd around to 1st, with 2nd = 0deg
      // it ends up being x coordinate on the svg
      const x = d3.scaleLinear().domain([-250, 250]).range([0, width]);

      // y is conceptually distance in ft from home plate, towards CF
      // it ends up being y coordinate on the svg
      const y = d3
        .scaleLinear()
        .domain([0, 350])
        .range([height - 115, 0]);

      // group them as they get passed around together
      const scales = { x, y };

      // set up drag functionality, passing the current scenario for updating values
      const drag = d3
        .drag()
        .on("start", d3du.dragstarted)
        .on("drag", d3du.dragged)
        .on("end", (event, d) => d3du.dragended(event, d, scales));

      // d3 drawing
      // create the svg
      const svg = d3
        .select("#playerOverlay")
        .attr("width", width)
        .attr("height", height);
      const g = svg.append("g");

      // zones
      const zoneData = svg
        .selectAll("zone")
        .data(this.zones)
        .enter()
        .append("g")
        .attr("transform", (d) => d3du.translatePoint(d, scales))
        .append("ellipse")
        .attr("class", "zone")
        .attr("cx", (d) => 0)
        .attr("cy", (d) => 0)
        .attr("rx", (d) => d.rx)
        .attr("ry", (d) => d.ry)
        .attr("transform", (d) => `rotate(${d.rotate})`);

      // sectors
      const sectorData = svg
        .selectAll("sector")
        .data(this.sectors)
        .enter()
        .append("g")
        // .attr("transform", (d) => d3du.translatePoint(d, scales))
        .append("path")
        .attr("class", "sector")
        .attr("d", (d) => {
          return `M  ${d3du.dePolarise(d.a1, d.dist, scales).x} ${
            d3du.dePolarise(d.a1, d.dist, scales).y
          }
          A 520 520, 0, ${d.flag1}, ${d.flag2}, ${
            d3du.dePolarise(d.a2, d.dist, scales).x
          } ${d3du.dePolarise(d.a2, d.dist, scales).y}
          L ${d3du.dePolarise(210, 3, scales).x} ${
            d3du.dePolarise(210, 3, scales).y
          } Z`;
        });

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
            .on("click", d3du.clicked)
            .attr("transform", (d) => d3du.translatePoint(d, scales));
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
            .duration(350)
            .attr("transform", (d) => d3du.translatePoint(d, scales));
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
            .attr("transform", (d) => d3du.translateRunner(d, scales))
            .call(drag)
            .on("click", d3du.clicked);
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
            .attr("transform", (d) => d3du.translateRunner(d, scales));
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
            .attr("x1", (d) => d3du.dePolarise(d.angle, d.dist, scales).x)
            .attr("y1", (d) => d3du.dePolarise(d.angle, d.dist, scales).y)
            .attr("x2", (d) => d3du.dePolarise(d.angle, d.dist, scales).x)
            .attr("y2", (d) => d3du.dePolarise(d.angle, d.dist, scales).y)
            .attr("stroke", "black")
            .attr("stroke-dasharay", "5");
        },
        (update) => {
          update
            .transition(t)
            .duration(350)
            .attr("x1", (d) => d3du.dePolarise(d.angle, d.dist, scales).x)
            .attr("y1", (d) => d3du.dePolarise(d.angle, d.dist, scales).y)
            .attr("x2", (d) => d3du.dePolarise(d.angle, d.dist, scales).x)
            .attr("y2", (d) => d3du.dePolarise(d.angle, d.dist, scales).y);
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
          const ballDataEnter = enter
            .append("g")
            .attr("class", "ball")
            .attr("transform", (d) => d3du.translatePoint(d, scales))
            .call(drag)
            .on("click", d3du.clicked);
          this.ballPaths.forEach((path) => {
            ballDataEnter
              .append("path")
              .attr("class", "svg-ball")
              .attr("transform", "translate(-10, 0) scale(0.0025)")
              .attr("d", path);
          });
        },
        (update) => {
          update
            .transition(t)
            .duration(this.ballDuration)
            .attr("transform", (d) => d3du.translatePoint(d, scales));
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
            .attr("class", (d) => {
              if (d.angle === undefined || d.dist === undefined) {
                return "hidden";
              }
              return "target";
            })
            .attr("transform", (d) => d3du.translatePoint(d, scales))
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
            .duration(350)
            .attr("class", (d) => (d.angle || d.distance ? "hidden" : "target"))
            .attr("cx", (d) => d3du.dePolarise(d.angle, d.dist, scales).x)
            .attr("cy", (d) => d3du.dePolarise(d.angle, d.dist, scales).y);
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
  transform-origin: center;
  fill: white;
  /* stroke: red;
  stroke-width: 1px; */
}

.ball > path:first-of-type {
  fill: red;
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
.zone {
  fill: none;
  stroke-width: 1px;
  stroke: red;
  stroke-dasharray: 5;
}
.sector {
  fill: rgba(0 0 0 / 0.2);
  stroke-width: 1px;
  stroke: black;
}
</style>
