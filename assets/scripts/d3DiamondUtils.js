import * as d3 from "d3";

// pull d3 routine out of vue scope

// functions
export function translatePoint(d, scales) {
  if (d.angle === undefined || d.dist === undefined) return `translate(0 0)`;
  return `translate(${dePolarise(d.angle, d.dist, scales).x} ${
    dePolarise(d.angle, d.dist, scales).y
  })`;
}
// take a runner distance around the bases as a float, where [0-1] is on the home-first base path, etc.
export function translateRunner(d, scales) {
  d.runnerPosition; // 0-1, 1-2, 2-3, 3-4
  const bases = [
    { angle: 90, dist: 0 },
    { angle: 45, dist: 90 },
    { angle: 0, dist: Math.sqrt(2 * 90 ** 2) },
    { angle: -45, dist: 90 },
  ];
  const coords = bases.map((b) => {
    return {
      x: dePolarise(b.angle, b.dist, scales).x,
      y: dePolarise(b.angle, b.dist, scales).y,
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
}

// take 'baseball' coordinates (x = degrees from centre line, y = distance from home plate towards CF) and convert to cartesian coordinates (home plate: 0, 0)
export function dePolarise(angle, dist, scales) {
  const cartX = scales.x(dist * Math.sin((angle * Math.PI) / 180));
  const cartY = scales.y(dist * Math.cos((angle * Math.PI) / 180));
  return { x: cartX, y: cartY };
}

// takes mouse coordinates? relative coordinates on the svg?
// outputs polar coordinates
export function polarise(inputX, inputY, scales) {
  // remove d3 scale from the inputs
  const fieldX = scales.x.invert(inputX);
  const fieldY = scales.y.invert(inputY);
  // convert to polar coordinates
  const angle = Math.round(Math.atan(fieldX / fieldY) / (Math.PI / 180));
  const dist = Math.round(Math.sqrt(fieldX ** 2 + fieldY ** 2));
  return { angle, dist };
}

// drag handlers
// click and drag handlers
export function clicked(event, d) {
  if (event.defaultPrevented) return; // dragged

  d3.select(this)
    .transition()
    .attr("fill", "black")
    .transition()
    .attr("fill", "red");
}
export function dragstarted() {
  // d3.select(this).attr("stroke", null);
}
export function dragged(event, d) {
  // handle ball
  if (d.type === "ball") {
    d3.selectAll(".ball")
      .raise()
      .attr("transform", (d) => {
        return `translate(${event.x} ${event.y})`;
      });
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
export const dragended = (event, d, scales) => {
  const { angle, dist } = polarise(event.x, event.y, scales);
  d.angle = angle;
  d.dist = dist;
};
