import type { ReactNode } from "react";
import { INK, Pen } from "./pen";

const f = (n: number) => n.toFixed(2);

/** Short, seeded pen marks follow the cloth instead of spanning the whole silhouette. */
function clothMarks(seed: number, box: [number, number, number, number], dark: boolean) {
  let state = seed;
  const random = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
  const [left, top, width, height] = box;
  const strokes: string[] = [];
  const flecks: string[] = [];
  const count = Math.ceil(width * height / (dark ? 32 : 48));
  for (let i = 0; i < count; i++) {
    const x = left + random() * width;
    const y = top + random() * height;
    const length = 2 + random() * (dark ? 10 : 6);
    const bend = random() * 2 - 1;
    strokes.push(`M${f(x)} ${f(y)}q${f(bend)} ${f(length * .45)} ${f(1.3 + bend)} ${f(length)}`);
    if (i % 3 === 0) flecks.push(`M${f(x + 2)} ${f(y + 3)}l.35 .65`);
    if (dark && i % 2 === 0) strokes.push(`M${f(x - 1)} ${f(y + 4)}l${f(length * .7)} ${f(-length * .45)}`);
  }
  return { strokes: strokes.join(""), flecks: flecks.join("") };
}

export function Cloth({ id, d, seed, box, denim = false, children }: {
  id: string;
  d: string;
  seed: number;
  box: [number, number, number, number];
  denim?: boolean;
  children?: ReactNode;
}) {
  const clip = `${id}-cut-${seed}`;
  const marks = clothMarks(seed, box, denim);
  return (
    <g>
      <defs><clipPath id={clip}><path d={d} /></clipPath></defs>
      <Pen d={d} seed={seed} weight={.9} fill={`url(#${id.split("--")[0]}-${denim ? "denim" : "cotton"})`} />
      <g clipPath={`url(#${clip})`}>
        <path d={marks.strokes} fill="none" stroke={denim ? "#293b50" : "#67717e"} strokeWidth={denim ? .5 : .38} opacity={denim ? .55 : .42} />
        <path d={marks.flecks} fill="none" stroke={INK} strokeWidth=".65" opacity=".45" />
        {children}
      </g>
    </g>
  );
}

export function CharacterInk({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-cotton`} x1="0" y1=".1" x2="1" y2=".4" gradientUnits="objectBoundingBox">
        <stop stopColor="#8b95a0" />
        <stop offset=".2" stopColor="#c0c5c8" />
        <stop offset=".48" stopColor="#efeee8" />
        <stop offset=".74" stopColor="#d9dcd9" />
        <stop offset="1" stopColor="#929da6" />
      </linearGradient>
      <linearGradient id={`${id}-denim`}>
        <stop stopColor="#394c60" />
        <stop offset=".28" stopColor="#697988" />
        <stop offset=".53" stopColor="#909ba4" />
        <stop offset=".78" stopColor="#657687" />
        <stop offset="1" stopColor="#35495d" />
      </linearGradient>
      <linearGradient id={`${id}-skin`} x1="0" x2="1" y1=".2" y2=".45">
        <stop stopColor="#8f9aa4" />
        <stop offset=".35" stopColor="#e0e1da" />
        <stop offset=".7" stopColor="#faf8ee" />
        <stop offset="1" stopColor="#d4d8d6" />
      </linearGradient>
      <linearGradient id={`${id}-phones`}>
        <stop stopColor="#263a50" />
        <stop offset=".34" stopColor="#71808e" />
        <stop offset=".55" stopColor="#b3bbc0" />
        <stop offset=".72" stopColor="#586b7c" />
        <stop offset="1" stopColor="#293d51" />
      </linearGradient>
      <pattern id={`${id}-knit`} width="3" height="7" patternUnits="userSpaceOnUse">
        <path d="M.7 0 .2 7M2 0l-.3 7" fill="none" stroke={INK} strokeWidth=".4" opacity=".65" />
      </pattern>
    </defs>
  );
}
