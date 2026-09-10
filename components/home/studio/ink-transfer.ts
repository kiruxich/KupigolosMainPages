import { MeshSimple, Texture, type Container } from "pixi.js";

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
const inverseSmooth = (value: number) => .5 - Math.sin(Math.asin(1 - 2 * clamp(value)) / 3);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
// Match the mean vertical erosion threshold in sand-dissolve.ts and its
// smooth visibility windows, so grains leave/arrive at the drawing's edge.
const revealThreshold = (y: number) => clamp(.85 * (1 - (y - 230) / 680) + .075);

function ellipsePoint([x, y, rx, ry, angle]: Ellipse, radius: number, turn: number): Point {
  const dx = Math.cos(turn) * radius * rx, dy = Math.sin(turn) * radius * ry;
  return { x: x + dx * Math.cos(angle) - dy * Math.sin(angle), y: y + dx * Math.sin(angle) + dy * Math.cos(angle) };
}

/** Soft, subpixel grains share one small texture and one mesh. */
function grainTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128; canvas.height = 16;
  const context = canvas.getContext("2d")!;
  for (let shade = 0; shade < 8; shade++) {
    const x = shade * 16 + 8;
    const gradient = context.createRadialGradient(x, 8, 2, x, 8, 6.5);
    const opacity = .38 + shade * .065;
    gradient.addColorStop(0, `rgba(40,54,76,${opacity})`);
    gradient.addColorStop(.6, `rgba(40,54,76,${opacity * .85})`);
    gradient.addColorStop(1, "rgba(40,54,76,0)");
    context.fillStyle = gradient;
    context.fillRect(shade * 16, 0, 16, 16);
  }
  return Texture.from(canvas);
}

/** Sand falls out of the drawing, flows along the floor, then builds it upward. */
export function createInkTransfer(parent: Container) {
  const count = 6200;
  const vertices = new Float32Array(count * 8);
  const uvs = new Float32Array(count * 8);
  const indices = new Uint32Array(count * 6);
  let seed = 72943, destroyed = false;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  const grains = Array.from({ length: count }, (_, index) => {
    let choice = random();
    const region = regions.find(([weight]) => (choice -= weight) <= 0) ?? regions[regions.length - 1];
    const radius = Math.sqrt(random()), turn = random() * Math.PI * 2;
    const source = ellipsePoint(region[1], radius, turn);
    const target = ellipsePoint(region[2], radius, turn + .18);
    const shade = Math.floor(random() * 8);
    const u = shade / 8, nextU = (shade + 1) / 8;
    uvs.set([u, 0, nextU, 0, nextU, 1, u, 1], index * 8);
    const vertex = index * 4;
    indices.set([vertex, vertex + 1, vertex + 2, vertex, vertex + 2, vertex + 3], index * 6);
    return {
      source, target,
      release: .32 * inverseSmooth(1 - revealThreshold(source.y)) + random() * .012,
      gather: .37 + random() * .045,
      lift: .55 + random() * .07,
      arrive: .63 + .37 * inverseSmooth(revealThreshold(target.y)) + (random() - .5) * .018,
      radius: .4 + random() * .55, lane: (random() + random() - 1) * 13,
      phase: random() * Math.PI * 2,
    };
  });
  const texture = grainTexture();
  const sand = new MeshSimple({ texture, vertices, uvs, indices, topology: "triangle-list" });
  const geometry = sand.geometry;
  sand.eventMode = "none";
  sand.visible = false;
  parent.addChild(sand);

  return {
    update(progress: number) {
      if (destroyed) return;
      sand.visible = Number.isFinite(progress) && progress > 0 && progress < 1;
      if (!sand.visible) return;
      for (let index = 0; index < grains.length; index++) {
        const grain = grains[index];
        const floorY = 853 + grain.lane;
        const entryX = 650 + (grain.source.x - 620) * .3;
        const exitX = 1070 + (grain.target.x - 1060) * .55;
        let x: number, y: number;
        if (progress < grain.gather) {
          const fall = clamp((progress - grain.release) / (grain.gather - grain.release));
          x = mix(grain.source.x, entryX, smooth(fall));
          y = mix(grain.source.y, floorY, fall * fall);
          x += Math.sin(grain.phase + fall * 6) * 4 * Math.sin(Math.PI * fall);
        } else if (progress < grain.lift) {
          const flow = clamp((progress - grain.gather) / (grain.lift - grain.gather));
          x = mix(entryX, exitX, smooth(flow));
          y = floorY - Math.sin(Math.PI * flow) * (5 + Math.abs(grain.lane) * .45)
            + Math.sin(grain.phase + flow * 9) * 2.5 * Math.sin(Math.PI * flow);
        } else {
          const assemble = smooth((progress - grain.lift) / (grain.arrive - grain.lift));
          x = mix(exitX, grain.target.x, assemble)
            + Math.sin(grain.phase + assemble * 7) * 5 * Math.sin(Math.PI * assemble);
          y = mix(floorY, grain.target.y, assemble);
        }
        // Individual grains emerge at the erosion edge and settle into the new drawing.
        const presence = smooth((progress - grain.release) / .035)
          * (1 - smooth((progress - grain.arrive + .025) / .05));
        const r = grain.radius * Math.sqrt(presence);
        const offset = index * 8;
        vertices[offset] = x - r; vertices[offset + 1] = y - r;
        vertices[offset + 2] = x + r; vertices[offset + 3] = y - r;
        vertices[offset + 4] = x + r; vertices[offset + 5] = y + r;
        vertices[offset + 6] = x - r; vertices[offset + 7] = y + r;
      }
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      sand.removeFromParent();
      sand.destroy();
      geometry.destroy(true);
      texture.destroy(true);
    },
  };
}
