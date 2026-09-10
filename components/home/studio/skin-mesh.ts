import { MeshSimple, type Texture } from "pixi.js";

export type Vec = { x: number; y: number };

type Affine = {
  a: number;
  b: number;
  c: number;
  d: number;
  tx: number;
  ty: number;
};

type Chain = [Vec, Vec, Vec];
type Bounds = { x: number; y: number; width: number; height: number };

const EPSILON = 0.0001;
const JOINT_BLEND = 28;
const ROOT_BLEND = 22;

function smoothstep(from: number, to: number, value: number) {
  const t = Math.max(0, Math.min(1, (value - from) / (to - from)));
  return t * t * (3 - 2 * t);
}

/** Maps a bind bone onto its posed bone while preserving the cloth's width. */
function boneTransform(start: Vec, end: Vec, nextStart: Vec, nextEnd: Vec): Affine {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.hypot(dx, dy);

  if (length < EPSILON) {
    return { a: 1, b: 0, c: 0, d: 1, tx: nextStart.x - start.x, ty: nextStart.y - start.y };
  }

  const ux = dx / length;
  const uy = dy / length;
  const nextDx = nextEnd.x - nextStart.x;
  const nextDy = nextEnd.y - nextStart.y;
  const nextLength = Math.hypot(nextDx, nextDy);
  const nextUx = nextLength > EPSILON ? nextDx / nextLength : ux;
  const nextUy = nextLength > EPSILON ? nextDy / nextLength : uy;
  const alongX = nextDx / length;
  const alongY = nextDy / length;

  const a = alongX * ux + nextUy * uy;
  const b = alongY * ux - nextUx * uy;
  const c = alongX * uy - nextUy * ux;
  const d = alongY * uy + nextUx * ux;

  return {
    a,
    b,
    c,
    d,
    tx: nextStart.x - a * start.x - c * start.y,
    ty: nextStart.y - b * start.x - d * start.y,
  };
}

/**
 * A single textured sleeve or trouser leg, skinned in reference-image coordinates.
 * `root`, when supplied, maps those same bind coordinates into the posed torso.
 * The caller retains ownership of the shared texture.
 */
export function makeSkin(texture: Texture, bounds: Bounds, bind: Chain): {
  mesh: MeshSimple;
  update(chain: Chain, root?: Affine): void;
  destroy(): void;
} {
  const rest: Chain = [{ ...bind[0] }, { ...bind[1] }, { ...bind[2] }];
  const wide = bounds.width > bounds.height;
  const columns = Math.max(2, Math.min(wide ? 60 : 30, Math.ceil(bounds.width / 6) + 1));
  const rows = Math.max(2, Math.min(wide ? 30 : 60, Math.ceil(bounds.height / 6) + 1));
  const count = columns * rows;
  const source = new Float32Array(count * 2);
  const vertices = new Float32Array(count * 2);
  const uvs = new Float32Array(count * 2);
  const lowerWeights = new Float32Array(count);
  const rootWeights = new Float32Array(count);
  const indices = new Uint32Array((columns - 1) * (rows - 1) * 6);

  const upperLength = Math.max(EPSILON, Math.hypot(rest[1].x - rest[0].x, rest[1].y - rest[0].y));
  const lowerLength = Math.max(EPSILON, Math.hypot(rest[2].x - rest[1].x, rest[2].y - rest[1].y));
  const upperX = (rest[1].x - rest[0].x) / upperLength;
  const upperY = (rest[1].y - rest[0].y) / upperLength;
  const lowerX = (rest[2].x - rest[1].x) / lowerLength;
  const lowerY = (rest[2].y - rest[1].y) / lowerLength;
  const bisectorLength = Math.hypot(upperX + lowerX, upperY + lowerY);
  const blendX = bisectorLength > EPSILON ? (upperX + lowerX) / bisectorLength : upperX;
  const blendY = bisectorLength > EPSILON ? (upperY + lowerY) / bisectorLength : upperY;

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const vertex = row * columns + column;
      const offset = vertex * 2;
      const u = column / (columns - 1);
      const v = row / (rows - 1);
      const x = bounds.x + u * bounds.width;
      const y = bounds.y + v * bounds.height;

      source[offset] = vertices[offset] = x;
      source[offset + 1] = vertices[offset + 1] = y;
      uvs[offset] = u;
      uvs[offset + 1] = v;

      // A shared joint band keeps the texture continuous across the elbow/knee.
      const jointDistance = (x - rest[1].x) * blendX + (y - rest[1].y) * blendY;
      lowerWeights[vertex] = smoothstep(-JOINT_BLEND / 2, JOINT_BLEND / 2, jointDistance);
      const rootDistance = (x - rest[0].x) * upperX + (y - rest[0].y) * upperY;
      rootWeights[vertex] = 1 - smoothstep(0, ROOT_BLEND, rootDistance);

      if (column < columns - 1 && row < rows - 1) {
        const index = (row * (columns - 1) + column) * 6;
        indices[index] = vertex;
        indices[index + 1] = vertex + 1;
        indices[index + 2] = vertex + columns;
        indices[index + 3] = vertex + 1;
        indices[index + 4] = vertex + columns + 1;
        indices[index + 5] = vertex + columns;
      }
    }
  }

  const mesh = new MeshSimple({ texture, vertices, uvs, indices, topology: "triangle-list" });
  mesh.autoUpdate = true;
  mesh.eventMode = "none";
  const geometry = mesh.geometry;
  let destroyed = false;

  return {
    mesh,
    update(chain, root) {
      if (destroyed) return;

      const upper = boneTransform(rest[0], rest[1], chain[0], chain[1]);
      const lower = boneTransform(rest[1], rest[2], chain[1], chain[2]);

      for (let vertex = 0; vertex < count; vertex++) {
        const offset = vertex * 2;
        const x = source[offset]!;
        const y = source[offset + 1]!;
        const lowerWeight = lowerWeights[vertex]!;
        const upperWeight = 1 - lowerWeight;
        let nextX = (upper.a * x + upper.c * y + upper.tx) * upperWeight
          + (lower.a * x + lower.c * y + lower.tx) * lowerWeight;
        let nextY = (upper.b * x + upper.d * y + upper.ty) * upperWeight
          + (lower.b * x + lower.d * y + lower.ty) * lowerWeight;

        if (root) {
          const rootWeight = rootWeights[vertex]!;
          nextX += (root.a * x + root.c * y + root.tx - nextX) * rootWeight;
          nextY += (root.b * x + root.d * y + root.ty - nextY) * rootWeight;
        }

        vertices[offset] = nextX;
        vertices[offset + 1] = nextY;
      }
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      mesh.destroy();
      geometry.destroy(true);
    },
  };
}
