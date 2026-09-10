import { CanvasSource, Container, Sprite, Texture } from "pixi.js";

type Bounds = { x: number; y: number; width: number; height: number };

/**
 * Reveals the drawing from its feet upward through an irregular band of grains.
 * Decreasing the amount erodes the head first, so the same field works at both
 * ends of the transfer. The mask lives beside its subject in world coordinates.
 */
export function createSandDissolveMask(parent: Container, bounds: Bounds) {
  const grainSize = Math.max(1.5, Math.sqrt(bounds.width * bounds.height / 80_000));
  const width = Math.max(1, Math.floor(bounds.width / grainSize));
  const height = Math.max(1, Math.floor(bounds.height / grainSize));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Studio sand mask needs a 2D canvas context");

  const pixels = context.createImageData(width, height);
  const thresholds = new Float32Array(width * height);
  let seed = (Math.imul(Math.round(bounds.x), 73856093) ^ Math.imul(Math.round(bounds.y), 19349663)) >>> 0;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  for (let y = 0; y < height; y++) {
    const rise = 1 - (y + .5) / height;
    for (let x = 0; x < width; x++) {
      const index = y * width + x;
      // Broad ripples break up the horizontal edge; independent fine grains
      // provide the erosion, without a visible grid of rectangular fragments.
      const ripple = Math.sin(x / width * 11 + rise * 5) * .014
        + Math.sin(x / width * 23 - rise * 9) * .007;
      thresholds[index] = Math.max(.004, Math.min(.996, rise * .85 + random() * .13 + ripple + .01));
      pixels.data[index * 4] = 255;
      pixels.data[index * 4 + 1] = 255;
      pixels.data[index * 4 + 2] = 255;
    }
  }

  const source = new CanvasSource({
    resource: canvas, width, height, resolution: 1,
    scaleMode: "linear", autoGenerateMipmaps: false,
  });
  const texture = new Texture({ source });
  const mask = new Sprite(texture);
  mask.position.set(bounds.x, bounds.y);
  mask.width = bounds.width;
  mask.height = bounds.height;
  mask.eventMode = "none";
  // Keep transforms live, but never draw the white mask as scene artwork.
  // Assigning it to subject.mask also preserves renderable=false in Pixi.
  mask.renderable = false;
  parent.addChild(mask);

  let previous = -1;
  let destroyed = false;
  return {
    mask,
    update(amount: number) {
      if (destroyed) return;
      const value = Number.isFinite(amount) ? Math.max(0, Math.min(1, amount)) : 0;
      if (value === previous) return;
      previous = value;
      const endpointAlpha = value === 0 ? 0 : value === 1 ? 255 : -1;
      for (let index = 0; index < thresholds.length; index++) {
        // A narrow alpha fringe softens each subpixel grain while the body
        // behind the erosion band remains fully opaque.
        pixels.data[index * 4 + 3] = endpointAlpha >= 0 ? endpointAlpha
          : Math.round(Math.max(0, Math.min(1, (value - thresholds[index]) / .009 + .5)) * 255);
      }
      context.putImageData(pixels, 0, 0);
      source.update();
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      mask.removeFromParent();
      mask.destroy();
      texture.destroy(true);
      canvas.width = 0;
      canvas.height = 0;
    },
  };
}
