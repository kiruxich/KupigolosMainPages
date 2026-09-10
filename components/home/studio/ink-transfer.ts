import { Container, Graphics } from "pixi.js";

type Ellipse = [x: number, y: number, rx: number, ry: number, angle: number];
type Point = { x: number; y: number };

// Paired head, sweater, hips and limbs keep the grains inside the two silhouettes.
const regions: [weight: number, source: Ellipse, target: Ellipse][] = [
  [.16, [655, 405, 31, 42, .1], [1045, 303, 35, 49, -.1]],
  [.30, [622, 545, 47, 110, .15], [1060, 448, 49, 91, -.06]],
  [.10, [632, 675, 42, 36, 0], [1060, 561, 45, 38, 0]],
  [.09, [556, 554, 71, 18, -.3], [1026, 495, 18, 66, -.18]],
  [.07, [578, 530, 51, 17, -.6], [1113, 491, 17, 63, -.12]],
  [.11, [482, 741, 23, 72, .15], [1040, 713, 24, 110, .03]],
  [.11, [558, 746, 23, 60, -.15], [1097, 711, 23, 108, -.02]],
  [.06, [491, 817, 68, 16, 0], [1070, 839, 75, 15, 0]],
];
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => { const t = clamp(value); return t * t * (3 - 2 * t); };
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

function ellipsePoint([x, y, rx, ry, angle]: Ellipse, radius: number, turn: number): Point {
  const dx = Math.cos(turn) * radius * rx, dy = Math.sin(turn) * radius * ry;
  return { x: x + dx * Math.cos(angle) - dy * Math.sin(angle), y: y + dx * Math.sin(angle) + dy * Math.cos(angle) };
}

/** A short, seekable ink transfer in source coordinates; the scene owns its clock. */
export function createInkTransfer(parent: Container) {
  const ink = new Graphics();
  ink.eventMode = "none";
  ink.visible = false;
  parent.addChild(ink);
  let seed = 72943, destroyed = false;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  const grains = Array.from({ length: 352 }, (_, index) => {
    let choice = random();
    const region = regions.find(([weight]) => (choice -= weight) <= 0) ?? regions[regions.length - 1];
    const radius = Math.sqrt(random()), turn = random() * Math.PI * 2;
    return {
      source: ellipsePoint(region[1], radius, turn), target: ellipsePoint(region[2], radius, turn + .18),
      delay: random() * .13, phase: random() * Math.PI * 2,
      size: .55 + random() * .65, length: 1.4 + random() * 2.3,
      bucket: index % 6, dot: index % 5 === 0, x: 0, y: 0, tilt: 0,
    };
  });

  return {
    update(progress: number) {
      if (destroyed) return;
      ink.clear();
      ink.visible = Number.isFinite(progress) && progress > 0 && progress < 1;
      if (!ink.visible) return;
      ink.alpha = smooth(progress / .14) * smooth((1 - progress) / .2);
      for (const grain of grains) {
        const travel = smooth((progress - grain.delay) / (1 - grain.delay - .04));
        const flow = Math.sin(Math.PI * travel);
        const gather = flow * flow;
        const centerY = mix(604, 567, travel) - 48 * flow;
        // The whole silhouette gathers into a narrow wisp, then opens at the mic.
        grain.x = mix(grain.source.x, grain.target.x, travel) + Math.sin(grain.phase + travel * 8) * 7 * gather;
        grain.y = mix(mix(grain.source.y, grain.target.y, travel), centerY, gather * .88)
          + Math.sin(grain.phase + travel * 11) * 9 * gather;
        grain.tilt = -.22 + Math.cos(grain.phase + travel * 5) * .24;
      }
      // A few batched paths keep hundreds of stipples in one display object.
      for (let bucket = 0; bucket < 6; bucket++) {
        const alpha = .36 + bucket * .075;
        ink.beginPath();
        for (const grain of grains) {
          if (grain.bucket !== bucket || !grain.dot) continue;
          ink.circle(grain.x, grain.y, grain.size);
        }
        ink.fill({ color: 0x28364c, alpha });
        ink.beginPath();
        for (const grain of grains) {
          if (grain.bucket !== bucket || grain.dot) continue;
          const dx = Math.cos(grain.tilt) * grain.length, dy = Math.sin(grain.tilt) * grain.length;
          ink.moveTo(grain.x - dx / 2, grain.y - dy / 2).lineTo(grain.x + dx / 2, grain.y + dy / 2);
        }
        ink.stroke({ color: 0x28364c, alpha, width: .85 + bucket * .07, cap: "round" });
      }
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      ink.removeFromParent();
      ink.destroy();
    },
  };
}
