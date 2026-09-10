import { Container, MeshSimple, Sprite, type Texture } from "pixi.js";
import { createSandDissolveMask } from "./sand-dissolve";

type Region = { x: number; y: number; width: number; height: number };
const smooth = (from: number, to: number, value: number) => {
  const t = Math.max(0, Math.min(1, (value - from) / (to - from)));
  return t * t * (3 - 2 * t);
};

/** Keep the illustrated arm/earcup contact intact; move the existing ink only. */
function speakingFigure(texture: Texture, bounds: Region) {
  const columns = Math.ceil(bounds.width / 4) + 1;
  const rows = Math.ceil(bounds.height / 4) + 1;
  const vertices = new Float32Array(columns * rows * 2);
  const source = new Float32Array(vertices.length);
  const uvs = new Float32Array(vertices.length);
  const weights = new Float32Array(columns * rows * 3);
  const indices = new Uint32Array((columns - 1) * (rows - 1) * 6);
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const vertex = row * columns + column, offset = vertex * 2;
      const u = column / (columns - 1), v = row / (rows - 1);
      const x = bounds.x + bounds.width * u, y = bounds.y + bounds.height * v;
      source[offset] = vertices[offset] = x;
      source[offset + 1] = vertices[offset + 1] = y;
      uvs[offset] = u; uvs[offset + 1] = v;
      weights[vertex * 3] = 1 - smooth(365, 455, y);
      weights[vertex * 3 + 1] = 1 - smooth(545, 760, y);
      weights[vertex * 3 + 2] = smooth(322, 328, y) * (1 - smooth(346, 360, y))
        * (1 - smooth(4, 26, Math.abs(x - 1142)));
      if (column < columns - 1 && row < rows - 1) {
        const index = (row * (columns - 1) + column) * 6;
        indices.set([vertex, vertex + 1, vertex + columns, vertex + 1, vertex + columns + 1, vertex + columns], index);
      }
    }
  }
  const mesh = new MeshSimple({ texture, vertices, uvs, indices, topology: "triangle-list" });
  const geometry = mesh.geometry;
  return {
    mesh,
    update(time: number, speaking: number) {
      const tilt = Math.sin(time * 3.4) * .007 * speaking;
      const cosine = Math.cos(tilt), sine = Math.sin(tilt);
      const breath = Math.sin(time * 2.2) * .65 * speaking;
      const jaw = (1 + Math.sin(time * 17.3 + Math.sin(time * 7) * .25)) * 1.5 * speaking;
      for (let vertex = 0; vertex < columns * rows; vertex++) {
        const offset = vertex * 2, weight = vertex * 3;
        const x = source[offset], y = source[offset + 1];
        const dx = x - 1095, dy = y - 360;
        // The head and the hand resting on its earcup share the same small turn.
        vertices[offset] = x + (dx * cosine - dy * sine - dx) * weights[weight];
        vertices[offset + 1] = y + (dx * sine + dy * cosine - dy) * weights[weight]
          + breath * weights[weight + 1] - jaw * weights[weight + 2];
      }
    },
    destroy() { mesh.removeFromParent(); mesh.destroy(); geometry.destroy(true); },
  };
}

/** Authored recording/rest poses replace the over-rotated pointing-arm rig. */
export function createRecordingPerformance(parent: Container, rig: Container,
  atlas: Record<string, Region>, textures: Map<string, Texture>) {
  const recording = new Container(); parent.addChild(recording);
  const resting = new Container(); parent.addChild(resting);
  const figure = speakingFigure(textures.get("recording-figure")!, atlas["recording-figure"]);
  recording.addChild(figure.mesh);
  const restBounds = atlas["resting-figure"];
  const rest = new Sprite(textures.get("resting-figure")!);
  rest.position.set(restBounds.x, restBounds.y);
  rest.width = restBounds.width; rest.height = restBounds.height;
  resting.addChild(rest);
  const bounds = { x: 940, y: 230, width: 320, height: 680 };
  const outgoing = createSandDissolveMask(parent, bounds);
  const incoming = createSandDissolveMask(parent, bounds);

  function swap(from: Container, to: Container, amount: number) {
    from.visible = amount < 1; to.visible = amount > 0;
    if (amount > 0 && amount < 1) {
      // Complementary masks replace pixels, without translucent duplicate arms.
      outgoing.update(amount, true); incoming.update(amount);
      from.mask = outgoing.mask; to.mask = incoming.mask;
    }
  }
  return {
    update(time: number, speaking: number, reading: number, pointing: number) {
      recording.mask = null; resting.mask = null; rig.mask = null;
      recording.visible = false; resting.visible = false; rig.visible = false;
      figure.update(time, speaking);
      if (reading > 0) swap(recording, resting, 1 - reading);
      else swap(resting, rig, smooth(.55, .9, pointing));
    },
    destroy() {
      recording.mask = null; resting.mask = null; rig.mask = null;
      outgoing.destroy(); incoming.destroy(); figure.destroy();
      recording.removeFromParent(); recording.destroy();
      resting.removeFromParent(); resting.destroy({ children: true });
    },
  };
}
