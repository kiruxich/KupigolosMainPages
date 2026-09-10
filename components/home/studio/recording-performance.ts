import { Container, MeshSimple, type Texture } from "pixi.js";
import { createSandDissolveMask } from "./sand-dissolve";

type Region = { x: number; y: number; width: number; height: number };
const smooth = (from: number, to: number, value: number) => {
  const t = Math.max(0, Math.min(1, (value - from) / (to - from)));
  return t * t * (3 - 2 * t);
};

/** Keep the illustrated arm/earcup contact intact; move the existing ink only. */
function performanceFigure(texture: Texture, bounds: Region, listening = false) {
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
      weights[vertex * 3] = 1 - smooth(listening ? 345 : 365, listening ? 435 : 455, y);
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
    update(time: number, activity: number) {
      const tilt = (listening ? .023 + Math.sin((time - 4.35) * 8.98) * .023 : Math.sin(time * 3.4) * .007) * activity;
      const cosine = Math.cos(tilt), sine = Math.sin(tilt);
      const breath = Math.sin(time * (listening ? 4.4 : 2.2)) * (listening ? .9 : .65) * activity;
      const jaw = listening ? 0 : (1 + Math.sin(time * 17.3 + Math.sin(time * 7) * .25)) * 1.5 * activity;
      for (let vertex = 0; vertex < columns * rows; vertex++) {
        const offset = vertex * 2, weight = vertex * 3;
        const x = source[offset]!, y = source[offset + 1]!;
        const headWeight = weights[weight]!;
        const bodyWeight = weights[weight + 1]!;
        const jawWeight = weights[weight + 2]!;
        const dx = x - (listening ? 1088 : 1095), dy = y - (listening ? 352 : 360);
        // The head and the hand resting on its earcup share the same small turn.
        vertices[offset] = x + (dx * cosine - dy * sine - dx) * headWeight;
        vertices[offset + 1] = y + (dx * sine + dy * cosine - dy) * headWeight
          + breath * bodyWeight - jaw * jawWeight;
      }
    },
    destroy() { mesh.removeFromParent(); mesh.destroy(); geometry.destroy(true); },
  };
}

/** Authored recording/listening poses keep the headphone contact intact. */
export function createRecordingPerformance(parent: Container, rig: Container,
  atlas: Record<string, Region>, textures: Map<string, Texture>) {
  const recordingBounds = atlas["recording-figure"];
  const listeningBounds = atlas["listening-figure"];
  const recordingTexture = textures.get("recording-figure");
  const listeningTexture = textures.get("listening-figure");
  if (!recordingBounds || !listeningBounds || !recordingTexture || !listeningTexture) {
    throw new Error("Studio recording artwork is missing from the atlas");
  }
  const recording = new Container(); parent.addChild(recording);
  const listenerGroup = new Container(); parent.addChild(listenerGroup);
  const figure = performanceFigure(recordingTexture, recordingBounds);
  recording.addChild(figure.mesh);
  const listener = performanceFigure(listeningTexture, listeningBounds, true);
  listenerGroup.addChild(listener.mesh);
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
    update(time: number, speaking: number, reading: number, cue: number, listeningAmount: number) {
      recording.mask = null; listenerGroup.mask = null; rig.mask = null;
      recording.visible = false; listenerGroup.visible = false; rig.visible = false;
      if (reading > 0) swap(recording, listenerGroup, 1 - reading);
      else swap(listenerGroup, rig, cue);
      if (recording.visible) figure.update(time, speaking);
      if (listenerGroup.visible) listener.update(time, listeningAmount);
    },
    destroy() {
      recording.mask = null; listenerGroup.mask = null; rig.mask = null;
      outgoing.destroy(); incoming.destroy(); figure.destroy(); listener.destroy();
      recording.removeFromParent(); recording.destroy();
      listenerGroup.removeFromParent(); listenerGroup.destroy();
    },
  };
}
