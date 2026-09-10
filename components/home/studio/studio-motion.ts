import { gsap } from "gsap";
import type { Vec } from "./skin-mesh";

export type ScenePose = {
  x: number; y: number; lean: number; seated: number; rear: number; headTilt: number;
  frontFootX: number; frontFootY: number; backFootX: number; backFootY: number;
  frontToe: number; backToe: number;
  frontHandX: number; frontHandY: number; backHandX: number; backHandY: number;
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
  frontHandX: 464, frontHandY: 568, backHandX: 484, backHandY: 574, wearing: 0, pointing: 0, speaking: 0,
  phonesX: 1327, phonesY: 522, phonesAngle: 0, chairX: 0, time: 0,
};
export const END: ScenePose = {
  ...START, x: 1060, y: 550, lean: 0, seated: 0, rear: 0,
  frontFootX: 1024, frontFootY: 824, backFootX: 1094, backFootY: 817,
  frontHandX: 1189, frontHandY: 295, backHandX: 1040, backHandY: 539, wearing: 1, pointing: 1, chairX: 0, time: 11.1,
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
  const hip = p(pose.x, pose.y), neck = body(BIND.side.neck, BIND.rear.neck);
  return { ...chains, hip, neck, spine: [hip, p((hip.x + neck.x) / 2, (hip.y + neck.y) / 2), neck] as Chain };
}

export function makeTimeline(pose: ScenePose, cta: HTMLAnchorElement, draw: () => void, complete: () => void) {
  const timeline = gsap.timeline({ paused: true, defaults: { ease: "sine.inOut" }, onUpdate: draw, onComplete: complete });
  timeline.to(pose, { time: 11.1, duration: 11.1, ease: "none" }, 0);
  timeline.to(pose, { frontHandY: 565, backHandY: 570, duration: .14, repeat: 5, yoyo: true }, 0);
  timeline.to(pose, { chairX: 24, x: 657, duration: .45 }, .65);
  timeline.to(pose, {
    x: 710, y: 623, seated: .55, lean: -8,
    frontHandX: 634, frontHandY: 628, backHandX: 646, backHandY: 632,
    frontFootX: 668, frontFootY: 824, backFootX: 604, backFootY: 817, duration: .45,
  }, 1.0);
  timeline.to(pose, {
    x: 752, y: 550, seated: 0, lean: 2,
    frontHandX: 787, frontHandY: 555, backHandX: 724, backHandY: 550,
    frontFootX: 738, frontFootY: 824, backFootX: 704, backFootY: 817, duration: .4,
  }, 1.45);
  timeline.to(pose, { rear: 0, duration: .12 }, 1.52);
  timeline.to(pose, { chairX: 0, duration: .45 }, 1.8);
  const steps = [
    { at: 1.9, x: 814, foot: "front", from: 738, to: 866 },
    { at: 2.36, x: 897, foot: "back", from: 704, to: 949 },
    { at: 2.82, x: 980, foot: "front", from: 866, to: 1024 },
    { at: 3.28, x: 1060, foot: "back", from: 949, to: 1094 },
  ] as const;
  for (const step of steps) {
    timeline.to(pose, { x: step.x, duration: .46, ease: "none" }, step.at);
    timeline.to(pose, { y: 546, lean: 3, duration: .23 }, step.at);
    timeline.to(pose, { y: 550, lean: 2, duration: .23 }, step.at + .23);
    timeline.to(pose, { [`${step.foot}FootX`]: (step.from + step.to) / 2, [`${step.foot}FootY`]: 802, [`${step.foot}Toe`]: -5, duration: .23 }, step.at);
    timeline.to(pose, { [`${step.foot}FootX`]: step.to, [`${step.foot}FootY`]: step.foot === "front" ? 824 : 817, [`${step.foot}Toe`]: 0, duration: .23 }, step.at + .23);
    timeline.to(pose, {
      frontHandX: step.x + (step.foot === "front" ? 6 : 65), frontHandY: 552,
      backHandX: step.x + (step.foot === "front" ? 15 : -35), backHandY: 550,
      duration: .46,
    }, step.at);
  }
  timeline.to(pose, {
    x: 1165, lean: 10, frontFootX: 1154, backFootX: 1100,
    frontHandX: 1302, frontHandY: 527, backHandX: 1176, backHandY: 550,
    duration: .42,
  }, 3.85);
  timeline.to(pose, {
    phonesX: 1233, phonesY: 422, phonesAngle: -8,
    frontHandX: 1206, frontHandY: 434, backHandX: 1260, backHandY: 433, duration: .36,
  }, 4.27);
  timeline.to(pose, {
    x: 1095, lean: 2, frontFootX: 1060, backFootX: 1118,
    phonesX: 1075, phonesY: 309, phonesAngle: -10,
    frontHandX: 1040, frontHandY: 321, backHandX: 1106, backHandY: 311,
    duration: .48,
  }, 4.63);
  timeline.set(pose, { wearing: 1, headTilt: 10 }, 5.11);
  timeline.to(pose, { x: 1060, frontFootX: 1024, backFootX: 1094, lean: 3, duration: .35 }, 5.11);
  timeline.to(pose, { speaking: 1, duration: .12 }, 5.35);
  timeline.to(pose, { backHandX: 1168, backHandY: 476, duration: .5 }, 5.4);
  timeline.to(pose, { lean: 6, headTilt: 12, frontHandX: 1050, frontHandY: 322, backHandX: 1172, backHandY: 507, duration: .6 }, 5.95);
  timeline.to(pose, { lean: 2, headTilt: 9, frontHandX: 1167, frontHandY: 503, backHandX: 1112, backHandY: 453, duration: .55 }, 6.6);
  timeline.to(pose, { lean: 4, frontHandY: 488, backHandY: 471, headTilt: 11, duration: .42 }, 7.2);
  timeline.to(pose, { frontHandY: 514, backHandY: 484, lean: 1, duration: .38 }, 7.7);
  timeline.to(pose, {
    speaking: 0, lean: 0, headTilt: 9,
    frontHandX: 1123, frontHandY: 557, backHandX: 1040, backHandY: 555,
    duration: .5,
  }, 8.25);
  timeline.to(pose, {
    frontHandX: END.frontHandX, frontHandY: END.frontHandY,
    backHandY: END.backHandY, headTilt: 0, pointing: 1, duration: .9, ease: "power2.inOut",
  }, 9.35);
  timeline.to(cta, { scale: 1.035, duration: .3, yoyo: true, repeat: 1 }, 10.4);
  return timeline;
}
