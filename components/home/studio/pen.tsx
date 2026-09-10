import rough from "roughjs";
import type { ReactNode } from "react";

export const INK = "#28364c";
export const PAPER = "#f8f7f3";
export const RUST = "#bd4d34";
const generator = rough.generator();

type PenProps = {
  d: string;
  seed: number;
  shade?: boolean;
  fill?: string;
  weight?: number;
  gap?: number;
  children?: ReactNode;
};

/** Seeded, generated once per shape. The resulting ordinary SVG paths move intact. */
export function Pen({ d, seed, shade = false, fill = PAPER, weight = 1.15, gap = 4.2, children }: PenProps) {
  const drawing = generator.path(d, {
    seed,
    stroke: INK,
    strokeWidth: weight,
    roughness: 0.48,
    bowing: 0.28,
    fill: shade ? "#465569" : undefined,
    fillStyle: "hachure",
    fillWeight: 0.52,
    hachureGap: gap,
    hachureAngle: -34,
    disableMultiStroke: true,
  });
  return (
    <g>
      <path d={d} fill={fill} stroke="none" />
      {generator.toPaths(drawing).map((path, i) => (
        <path key={i} d={path.d} fill={path.fill} stroke={path.stroke} strokeWidth={path.strokeWidth} />
      ))}
      {children}
    </g>
  );
}

export function PenDefs({ id }: { id: string }) {
  return (
    <defs>
      <pattern id={`${id}-weave`} width="5" height="5" patternUnits="userSpaceOnUse">
        <path d="M0 0 5 5M-1 4 4-1M4 6 6 4" fill="none" stroke={INK} strokeWidth=".5" opacity=".5" />
      </pattern>
      <pattern id={`${id}-cloth`} width="11" height="13" patternUnits="userSpaceOnUse">
        <path d="m1 11 6-9m0 10 3-4M1 5l2-3" fill="none" stroke={INK} strokeWidth=".55" opacity=".45" />
      </pattern>
      <pattern id={`${id}-rib`} width="4" height="6" patternUnits="userSpaceOnUse">
        <path d="M1 0v6" fill="none" stroke={INK} strokeWidth=".6" />
      </pattern>
    </defs>
  );
}
