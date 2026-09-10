import { gsap } from "gsap";
import type { Vec } from "./skin-mesh";

export type ScenePose = {
  x: number; y: number; lean: number; seated: number; rear: number; headTilt: number;
  frontFootX: number; frontFootY: number; backFootX: number; backFootY: number;
  frontToe: number; backToe: number;
  frontHandX: number; frontHandY: number; backHandX: number; backHandY: number;
  transfer: number;
  wearing: number; pointing: number; speaking: number;
  phonesX: number; phonesY: number; phonesAngle: number; chairX: number; time: number;
};
export type Chain = [Vec, Vec, Vec];
const p = (x: number, y: number): Vec => ({ x, y });
export const BIND = {
  side: {
    hip: p(1060, 550), neck: p(1044, 356),
    frontArm: [p(1089, 382), p(1148, 347), p(1189, 295)] as Chain,
    backArm: [p(1007, 412), p(1000, 491), p(1040, 539)] as Chain,
    frontLeg: [p(1046, 598), p(1038, 703), p(1024, 824)] as Chain,
    backLeg: [p(1101, 602), p(1094, 695), p(1094, 817)] as Chain,
  },
  rear: {
    hip: p(632, 684), neck: p(670, 436),
    frontArm: [p(590, 504), p(545, 560), p(464, 568)] as Chain,
    backArm: [p(616, 500), p(565, 587), p(484, 574)] as Chain,
    frontLeg: [p(583, 668), p(465, 677), p(442, 807)] as Chain,
    backLeg: [p(610, 689), p(562, 714), p(548, 802)] as Chain,
  },
};
export const START: ScenePose = {
  x: 632, y: 684, lean: 0, seated: 1, rear: 1, headTilt: 0,
  frontFootX: 442, frontFootY: 807, backFootX: 548, backFootY: 802, frontToe: 0, backToe: 0,
  frontHandX: 464, frontHandY: 568, backHandX: 484, backHandY: 574, transfer: 0, wearing: 0, pointing: 0, speaking: 0,
  phonesX: 1327, phonesY: 522, phonesAngle: 0, chairX: 0, time: 0,
};
export const END: ScenePose = {
  ...START, x: 1060, y: 550, lean: 0, seated: 0, rear: 0,
  frontFootX: 1024, frontFootY: 824, backFootX: 1094, backFootY: 817,
  frontHandX: 1189, frontHandY: 295, backHandX: 1040, backHandY: 539, wearing: 1, pointing: 1, transfer: 1, chairX: 0, time: 6.9,
};
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const distance = (a: Vec, b: Vec) => Math.hypot(b.x - a.x, b.y - a.y);

function joint(a: Vec, b: Vec, upper: number, lower: number, bend: number) {
  const span = Math.max(.001, distance(a, b));
  const reach = Math.max(1, span / (upper + lower));
  upper *= reach; lower *= reach;
  const cosine = Math.max(-1, Math.min(1, (upper * upper + span * span - lower * lower) / (2 * upper * span)));
  const angle = Math.atan2(b.y - a.y, b.x - a.x) + bend * Math.acos(cosine);
  return p(a.x + Math.cos(angle) * upper, a.y + Math.sin(angle) * upper);
}
export function skeleton(pose: ScenePose) {
  const angle = pose.lean * Math.PI / 180;
  const body = (side: Vec, rear: Vec) => {
    const x = mix(side.x - BIND.side.hip.x, rear.x - BIND.rear.hip.x, pose.seated);
    const y = mix(side.y - BIND.side.hip.y, rear.y - BIND.rear.hip.y, pose.seated);
    return p(pose.x + x * Math.cos(angle) - y * Math.sin(angle), pose.y + x * Math.sin(angle) + y * Math.cos(angle));
  };
  const hip = p(pose.x, pose.y), neck = body(BIND.side.neck, BIND.rear.neck);
  const chains = {} as Record<"frontArm" | "backArm" | "frontLeg" | "backLeg", Chain>;
  for (const key of ["frontArm", "backArm", "frontLeg", "backLeg"] as const) {
    const side = key.startsWith("front") ? "front" : "back";
    const arm = key.endsWith("Arm");
    const standing = BIND.side[key]; const seated = BIND.rear[key];
    const start = body(standing[0], seated[0]);
    const end = arm ? p(pose[`${side}HandX`], pose[`${side}HandY`]) : p(pose[`${side}FootX`], pose[`${side}FootY`]);
    const upper = mix(distance(standing[0], standing[1]), distance(seated[0], seated[1]), pose.seated);
    const lower = mix(distance(standing[1], standing[2]), distance(seated[1], seated[2]), pose.seated);
    const bend = arm ? (pose.seated > .5 ? -1 : 1) : (pose.seated > .5 || side === "back" ? 1 : -1);
    chains[key] = [start, joint(start, end, upper, lower, bend), end];
  }
  return { ...chains, hip, neck, spine: [hip, p((hip.x + neck.x) / 2, (hip.y + neck.y) / 2), neck] as Chain };
}

/** Visibility windows leave the actual pose change entirely inside the dust. */
export function characterVisibility(transfer: number, rear: boolean) {
  const amount = rear ? 1 - Math.min(1, transfer / .32) : Math.max(0, (transfer - .63) / .37);
  return amount * amount * (3 - 2 * amount);
}

export function makeTimeline(pose: ScenePose, cta: HTMLAnchorElement, draw: () => void, complete: () => void) {
  const timeline = gsap.timeline({ paused: true, defaults: { ease: "sine.inOut" }, onUpdate: draw, onComplete: complete });
  timeline.to(pose, { time: END.time, duration: END.time, ease: "none" }, 0);
  timeline.to(pose, { frontHandY: 565, backHandY: 570, duration: .14, repeat: 5, yoyo: true }, 0);

  // No intermediate body poses: dissolve at the desk, then form at the mic.
  timeline.to(pose, { transfer: 1, duration: .95, ease: "none" }, .9);
  timeline.set(pose, {
    x: END.x, y: END.y, seated: 0, rear: 0, lean: 0, headTilt: 0,
    frontFootX: END.frontFootX, frontFootY: END.frontFootY,
    backFootX: END.backFootX, backFootY: END.backFootY,
    frontHandX: 1115, frontHandY: 512, backHandX: 1040, backHandY: 539,
    wearing: 1,
  }, 1.34);

  // Hands remain at rest while reading; only the head makes a small nod.
  // The far wrist stays within the sleeve's reach, without stretching its mesh.
  timeline.to(pose, { speaking: 1, duration: .12 }, 1.9);
  timeline.to(pose, { headTilt: 1, duration: .55 }, 2.05);
  timeline.to(pose, { headTilt: 2, duration: .55 }, 2.65);
  timeline.to(pose, { headTilt: 1, duration: .55 }, 3.25);
  timeline.to(pose, {
    speaking: 0, lean: 0, headTilt: 0,
    frontHandX: 1115, frontHandY: 512, backHandX: 1040, backHandY: 539,
    duration: .45,
  }, 4.05);
  timeline.to(pose, {
    frontHandX: END.frontHandX, frontHandY: END.frontHandY,
    pointing: 1, duration: .85, ease: "power2.inOut",
  }, 5.0);
  timeline.to(cta, { scale: 1.035, duration: .3, yoyo: true, repeat: 1 }, 6.05);
  return timeline;
}
