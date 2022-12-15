<template>
  <div class="page">
    <nav>
      <h1>Diamond Training</h1>
    </nav>
    <div class="container">
      <div class="aside">
        <h2>Select a scenario:</h2>
        <div v-for="(scen, i) in scenarios">
          <input
            type="radio"
            :id="scen.title"
            name="scenario"
            class="hidden"
            :value="i"
            v-model="currentScenarioIndex"
          />
          <label :for="scen.title">{{ scen.title }}</label>
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
        <p>{{ currentScenario.description }}</p>
        <div class="position-info">
          <ul class="left">
            <li>
              Ball: Angle: {{ currentScenario.balls[0].angle }}; Depth:
              {{ currentScenario.balls[0].dist }}
            </li>
            <br />
            <li v-for="p in currentScenario.players">
              {{ p.positionName }}: Angle: {{ p.angle }}; Depth: {{ p.dist }}
            </li>
            <br />
            <li v-for="p in currentScenario.runners">
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
import SVGGlove from "~/components/svg-glove.vue";
import * as d3 from "d3";

import scenarios from "~/assets/scenarios/_all";

export default {
  name: "Diamond Training",
  components: {
    SVGDiamond,
  },
  beforeMount() {
    // console.log("before mount");
    // console.log("this.currentScenario", this.currentScenario);
    // this.d3Update(this.currentScenario);
  },
  mounted() {
    this.d3Update(this.currentScenario);
    // console.log("mounted");
  },
  data() {
    return {
      scale: 2.5,
      scenarios,
      currentScenarioIndex: 0,
      currentScenario: scenarios[0],
      // d3 references
      svg: null, // the parent svg
      playerData: null, // players
      x: null, // x scale
      y: null, // y scale
    };
  },
  watch: {
    currentScenarioIndex(n, o) {
      if (n !== o) {
        this.currentScenario = this.scenarios[this.currentScenarioIndex];
        this.d3Update(this.currentScenario);
      }
    },
  },
  methods: {
    //
    translatePoint(d) {
      return `translate(${this.x(this.dePolarise(d.angle, d.dist).x)} ${this.y(
        this.dePolarise(d.angle, d.dist).y
      )})`;
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
    // d3Update() {
    //   const t = d3.transition().duration(750).ease(d3.easeLinear);
    //   const playerG = this.svg
    //     .selectAll("players")
    //     // .data(this.currentScenario.players, (d) => {
    //     //   return d.positionName;
    //     // })
    //     .transition(t)
    //     .attr("transform", (d) => {
    //       console.log("d: ", d);
    //       console.log(this.playerG);
    //       return `translate(${this.x(
    //         this.dePolarise(d.angle, d.dist).x
    //       )} ${this.y(this.dePolarise(d.angle, d.dist).y)})`;
    //     });
    //   const runnerG = this.svg
    //     .selectAll("runners")
    //     // .data(this.currentScenario.runners, (d) => d.positionName)
    //     .transition(t)
    //     .attr("transform", (d) => {
    //       return `translate(${this.x(
    //         this.dePolarise(d.angle, d.dist).x
    //       )} ${this.y(this.dePolarise(d.angle, d.dist).y)})`;
    //     });
    // },
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
          .attr("r", radius * 2)
          .transition()
          .attr("r", radius)
          .attr("fill", "red");
      }
      function dragstarted() {
        // d3.select(this).attr("stroke", null);
      }
      function dragged(event, d) {
        // handle ball
        if (d.type === "ball") {
          ball.raise().attr("cx", event.x).attr("cy", event.y);
          ballLine.attr("x1", event.x).attr("y1", event.y);
        } else {
          // handle player
          d3.select(this)
            .raise()
            .attr("transform", (d) => {
              return `translate(${event.x} ${event.y})`;
            });
        }
      }
      const dragended = (event, d) => {
        const { angle, dist } = this.polarise(event.x, event.y);
        let player;
        switch (d.type) {
          case "ball":
            player = data.balls[0];
            break;
          case "runner":
            player = data.runners.find(
              (r) => r.positionNumber === d.positionNumber
            );
            break;
          case "player":
            player = data.players.find(
              (p) => p.positionNumber === d.positionNumber
            );
            break;
          default:
            console.log("unknown object type");
        }

        player.angle = angle;
        player.dist = dist;
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
          playerDataEnter
            .append("circle")
            .attr("fill", "red")
            .attr("stroke", "black")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", 5);
          playerDataEnter
            .append("text")
            .attr("x", 8)
            .attr("y", 4)
            .text((d) => d.positionName)
            .attr("font-size", "16px")
            .attr("font", "sans-serif")
            .attr("fill", "white");
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
            .attr("transform", (d) => this.translatePoint(d))
            .call(drag)
            .on("click", clicked);
          runnerDataEnter
            .append("circle")
            .attr("fill", "blue")
            .attr("stroke", "black")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", 5);
          runnerDataEnter
            .append("text")
            .attr("x", 8)
            .attr("y", 4)
            .text((d) => d.positionName)
            .attr("font-size", "16px")
            .attr("font", "sans-serif")
            .attr("fill", "white")
            .attr("cursor", "none");
        },
        (update) => {
          update
            .transition(t)
            .duration(500)
            .attr("transform", (d) => this.translatePoint(d));
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
            .attr("fill", "white")
            .attr("stroke", "red")
            .attr("r", 5)
            .on("click", clicked)
            .call(drag);
        },
        (update) => {
          update
            .transition(t)
            .duration(500)
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
            .attr("x2", (d) => this.x(this.dePolarise(0, 0).x))
            .attr("y2", (d) => this.y(this.dePolarise(0, 0).y))
            .attr("stroke", "black")
            .attr("stroke-dasharay", "5");
        },
        (update) => {
          update
            .transition(t)
            .duration(500)
            .attr("x1", (d) => this.x(this.dePolarise(d.angle, d.dist).x))
            .attr("y1", (d) => this.y(this.dePolarise(d.angle, d.dist).y));
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
  width: 200px;
  border: 1px grey solid;
  height: 100%;
}
.main {
  flex: 0 0 auto;
}
.summary {
  flex: 1 1 auto;
}
.svg-wrapper {
  width: min(80vh, 80vw);
  aspect-ratio: 1.15;
  overflow: hidden;
  border: 1px red solid;
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
/* .hidden {
  display: none;
} */
</style>
