<template>
  <div class="container">
    <div class="svg-wrapper">
      <SVGDiamond class="svg" width="100%" :players="players" />
    </div>
    <p>{{ players }}</p>
  </div>
</template>

<script>
import SVGDiamond from "@/components/svg-diamond.vue";

const baseballPositions = [
  null,
  "P",
  "C",
  "1B",
  "2B",
  "3B",
  "SS",
  "LF",
  "CF",
  "RF",
];
class Player {
  positionName;
  positionNumber;
  x;
  y;
  constructor(number, x, y) {
    this.positionNumber = number;
    this.positionName = baseballPositions[number];
    this.x = x;
    this.y = y;
  }
}
export default {
  components: {
    SVGDiamond,
  },
  data() {
    return {
      scale: 1.5,
      players: [
        new Player(1, 40, -40),
        new Player(2, -4, 4),
        new Player(3, 100, -20),
        new Player(4, 110, -60),
        new Player(5, 20, -100),
        new Player(6, 60, -110),
        new Player(7, 60, -200),
        new Player(8, 150, -150),
        new Player(9, 200, -60),
      ],
    };
  },
};
</script>

<style>
.container {
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  overflow-x: hidden;
  overflow-y: hidden;
}
.svg-wrapper {
  width: min(80vh, 80vw);
  aspect-ratio: 1.15;
  overflow: hidden;
  border: 1px red solid;
  position: relative;
}
.svg {
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
</style>
