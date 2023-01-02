<template>
  <!-- :style="svgDiamond" -->
  <svg
    ref="diamondSVG"
    class="svg-diamond drop-zone"
    viewBox="0 0 500 420"
    cy-data="diamond"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <!-- define a base, origin = center -->
      <rect
        id="base"
        class="base"
        width="1.5"
        height="1.5"
        x="-0.75"
        y="-0.75"
      />
      <!-- shift origin to right for first-->
      <g
        id="first-base"
        transform-origin="0.75 0.75"
        :transform="`translate(-0.75 -0.75) scale(${baseScale})`"
      >
        <use href="#base"></use>
      </g>
      <!-- origin remains for second -->
      <g id="second-base" :transform="`scale(${baseScale})`">
        <use href="#base"></use>
      </g>
      <!-- shift origin to left for third-->
      <g
        id="third-base"
        transform-origin="-0.75 -0.75"
        :transform="`translate(0.75 0.75) scale(${baseScale})`"
      >
        <use href="#base"></use>
      </g>
      <!-- home plate defs -->
      <clipPath id="home-plate-clip-path">
        <rect width="30" height="30" transform="rotate(45)"></rect>
      </clipPath>
      <rect
        id="home-plate-base"
        class="base"
        :width="17"
        :height="17"
        :x="-8.5"
        :y="0"
      />
      <!-- home plate -->
      <g
        :transform="`rotate(225) scale(${baseScale})`"
        transform-origin="0 0"
        id="home-plate"
      >
        <!-- convert inches to feet -->
        <g transform="scale(0.08333)">
          <use
            clip-path="url(#home-plate-clip-path)"
            href="#home-plate-base"
            fill="blue"
          />
        </g>
      </g>
      <!-- pitcher mound -->
      <!-- dirt -->
      <circle id="pitcher-mound" class="dirt" cx="0" cy="0" r="9" />
      <!-- rubber -->
      <rect
        id="pitcher-rubber"
        class="base"
        width="2"
        height="0.5"
        x="-1"
        y="-0.25"
      />
      <g id="pitcher">
        <use href="#pitcher-mound"></use>
        <use
          href="#pitcher-rubber"
          transform-origin="(0, 0)"
          :transform="`rotate(45) scale(${baseScale})`"
        ></use>
      </g>
      <!-- <circle id="player" class="player" cx="0" cy="0" r="5"></circle> -->
    </defs>

    <title>Baseball Diamond</title>
    <g transform="translate(185,280) scale(1.0) rotate(315)">
      <!-- outfield and deadball -->
      <path
        id="outfield-arc"
        class="grass"
        d="M -60, 90
        a 60 60 1 0 0 60 60
        l120, 0
        l205,-60
        a 325 325 60 0 0 -325 -325
        l-60,205
        l0,120
        "
      />
      <!-- infield dirt -->
      <path
        id="infield-arc"
        class="dirt"
        d="M-3,93 
          l0,-128 
          a95,95 0 0 1 128 128
          "
      />
      <!-- infield grass -->
      <path
        id="infield"
        class="grass"
        d="M0,0 
        l90,0
        l0,90
        l-90,0
        l0,-90
      "
      />
      <!-- home plate dirt -->
      <circle id="home-circle" class="dirt" cx="0" cy="90" r="13" />
      <!-- bases dirt -->
      <path
        id="base-arcs"
        class="dirt"
        d="M 90,90
          l -13,0
          a 13 13 0 0 1 13 -13
          M 90 0
          l 0 13
          a 13 13 0 0 1 -13 -13
          M 0 0
          l 13 0
          a 13 13 0 0 1 -13 13
          "
      />
      <!-- base path -->
      <rect
        id="diamond-dirt"
        class="dirt"
        transform="translate(1.5, 1.5)"
        width="87.5px"
        height="87.5px"
      />
      <!-- foul ball lines -->
      <path
        id="foul-lines"
        d="M 0,-235
          l 0,325
          l 325,0"
        class="paint"
        data-cy="foul-lines"
      />
      <!-- base lines -->
      <rect id="diamond-line" class="paint" width="90px" height="90px" />
      <!-- home base coordinates -->
      <!-- home: 0,0; first: 0,90; second: 90,90; third: 90,0-->
      <g transform="translate(0,90) rotate(0)">
        <!-- bases -->
        <use href="#first-base" :x="90" :y="0" />
        <use href="#second-base" :x="90" :y="-90" />
        <use href="#third-base" :x="0" :y="-90" />
        <use href="#home-plate" :x="0" :y="0" />
        <use href="#pitcher" :x="42.6665" :y="-42.6665" />

        <!-- Players -->
        <!-- <g>
          <g v-for="player in players" :key="player.positionNumber">
            <use
              :id="player.positionName"
              href="#player"
              :x="player.x"
              :y="player.y"
              class="draggable"
              @mousedown="startDrag($event, player)"
              @mousemove="drag($event, player)"
              @mouseup="endDrag($event, player)"
              @mouseleave="endDrag($event, player)"
            ></use>
          </g>
        </g> -->
      </g>
    </g>
  </svg>
</template>

<script>
export default {
  props: {
    players: {
      required: false,
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      baseScale: 3,
      selectedPlayer: null,
      initialLocation: null,
    };
  },
  methods: {
    setInitialLocation(evt) {
      this.initialLocation = {
        playerX: evt.target.x,
        playerY: evt.target.y,
        clientX: evt.clientX,
        clientY: evt.clientY,
      };
    },
    startDrag(evt, player) {
      if (evt.target.classList.contains("draggable")) {
        this.selectedPlayer = evt.target;
        evt.target.classList.add("red");
        this.setInitialLocation(evt);
      }
    },
    drag(evt, player) {
      evt.preventDefault;
      const svg = this.$refs.diamondSVG;
      function deltaPosition(evt, initial) {
        var CTM = svg.getScreenCTM();
        const deltaX = (evt.clientX - initial.clientX) / CTM.a;
        const deltaY = (evt.clientY - initial.clientY) / CTM.d;
        return {
          x: ((deltaX - deltaY) * 1) / Math.sqrt(2),
          y: ((deltaX + deltaY) * 1) / Math.sqrt(2),
        };
      }

      if (this.selectedPlayer) {
        const delta = deltaPosition(evt, this.initialLocation);

        this.selectedPlayer.setAttributeNS(
          null,
          "x",
          parseFloat(this.initialLocation.playerX.baseVal.value + delta.x)
        );
        this.selectedPlayer.setAttributeNS(
          null,
          "y",
          parseFloat(this.initialLocation.playerY.baseVal.value + delta.y)
        );
        this.setInitialLocation(evt);
      }
    },
    endDrag(evt, player) {
      evt.target.classList.remove("red");
      this.selectedPlayer = null;
    },
  },
};
</script>

<style>
#new {
  stroke: #442200;
  stroke-width: 0px;
  display: auto;
  fill: none;
}
#diamond-dirt {
  stroke-width: 3px;
  stroke: #442200;
  fill: none;
}
.paint {
  stroke-width: 0.33px;
  stroke: #fdb;
  fill: none;
}
#home-circle {
  stroke-width: none;
}
#base-arcs {
  stroke-width: 2px;
}
#pitcher-mound {
  stroke-width: 1px;
  fill: #442200;
}
#infield-arc {
  stroke-width: 1px;
}
.dirt {
  fill: #442200;
}
.grass {
  fill: rgba(0, 102, 0, 0.8);
}
.base {
  fill: rgb(255 255 255 / 0.5);
}
.red {
  fill: red;
}
/* .player {
  stroke: black;
  stroke-width: 1px;
  fill: white;
  cursor: move;
} */
.playerText {
  font: 16px sans-serif;
  fill: white;
  stroke: black;
  stroke-width: 0.5px;
}
</style>
