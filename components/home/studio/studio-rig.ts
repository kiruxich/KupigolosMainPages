export type StudioPose = {
  x: number;
  y: number;
  lean: number;
  stretch: number;
  facing: number;
  headTilt: number;
  frontFootX: number;
  frontFootY: number;
  backFootX: number;
  backFootY: number;
  frontToe: number;
  backToe: number;
  frontHandX: number;
  frontHandY: number;
  backHandX: number;
  backHandY: number;
  frontWrist: number;
  backWrist: number;
  mouth: number;
  headphonesX: number;
  headphonesY: number;
  headphonesAngle: number;
  wearing: number;
  pointing: number;
};

export const SEATED: StudioPose = {
  x: 632, y: 684, lean: 5, stretch: 1.36, facing: -1, headTilt: 2,
  frontFootX: 452, frontFootY: 828, backFootX: 550, backFootY: 824,
  frontToe: 0, backToe: 0,
  frontHandX: 480, frontHandY: 578, backHandX: 420, backHandY: 571,
  frontWrist: -95, backWrist: -85, mouth: 0,
  headphonesX: 1287, headphonesY: 499, headphonesAngle: 0, wearing: 0, pointing: 0,
};

export const STANDING: Partial<StudioPose> = {
  x: 1060, y: 550, lean: 3, stretch: 1, facing: 1, headTilt: 0,
  frontFootX: 1024, frontFootY: 834, backFootX: 1100, backFootY: 832,
  frontToe: 0, backToe: 0,
  frontHandX: 1125, frontHandY: 574, backHandX: 1050, backHandY: 574,
  frontWrist: -10, backWrist: 12,
};

export const FINAL: StudioPose = {
  ...SEATED, ...STANDING,
  lean: 0, headTilt: -12,
  frontHandX: 1200, frontHandY: 294, frontWrist: -141,
  backHandX: 1050, backHandY: 553, backWrist: -18,
  mouth: 0, wearing: 1, pointing: 1,
};

type Point = { x: number; y: number };
const deg = 180 / Math.PI;
const rad = Math.PI / 180;
const n = (value: number) => value.toFixed(3);
const point = (x: number, y: number): Point => ({ x, y });
const translate = (p: Point) => `translate(${n(p.x)} ${n(p.y)})`;
const segment = (a: Point, b: Point) => `${translate(a)} rotate(${n(Math.atan2(b.y - a.y, b.x - a.x) * deg - 90)})`;
const limb = (a: Point, b: Point, artworkLength: number) => `${segment(a, b)} scale(1 ${n(Math.hypot(b.x - a.x, b.y - a.y) / artworkLength)})`;

const torsoLength = 185;
const headLift = 61;

/** Two-bone IK keeps feet planted and hands attached while GSAP interpolates targets. */
function joint(a: Point, b: Point, upper: number, lower: number, bend: number): Point {
  const distance = Math.max(0.001, Math.hypot(b.x - a.x, b.y - a.y));
  const cosine = Math.max(-1, Math.min(1, (upper * upper + distance * distance - lower * lower) / (2 * upper * distance)));
  const angle = Math.atan2(b.y - a.y, b.x - a.x) + Math.acos(cosine) * bend;
  return point(a.x + Math.cos(angle) * upper, a.y + Math.sin(angle) * upper);
}

export function transforms(pose: StudioPose): Record<string, string> {
  const hip = point(pose.x, pose.y);
  const angle = pose.lean * rad;
  const facing = pose.facing < 0 ? -1 : 1;
  const shoulder = point(hip.x + Math.sin(angle) * torsoLength * pose.stretch, hip.y - Math.cos(angle) * torsoLength * pose.stretch);
  const head = point(shoulder.x + Math.sin(angle) * headLift, shoulder.y - Math.cos(angle) * headLift);
  const result: Record<string, string> = {
    torso: `${translate(hip)} rotate(${n(pose.lean)}) scale(1 ${n(pose.stretch)})`,
    pelvis: `${translate(hip)} scale(${facing} 1)`,
    head: `${translate(head)} rotate(${n(pose.lean + pose.headTilt)}) scale(${facing} 1)`,
    wornPhones: `${translate(head)} rotate(${n(pose.lean + pose.headTilt)}) scale(${facing} 1)`,
    loosePhones: `translate(${n(pose.headphonesX)} ${n(pose.headphonesY)}) rotate(${n(pose.headphonesAngle)})`,
    mouth: `translate(33 24) scale(1 ${n(Math.max(0.08, pose.mouth))})`,
  };
  for (const side of ["back", "front"] as const) {
    const offset = side === "front" ? -13 : 18;
    const legStart = point(hip.x + offset, hip.y + 6);
    const foot = point(pose[`${side}FootX`], pose[`${side}FootY`] - 17);
    const knee = joint(legStart, foot, 132, 132, -facing);
    result[`${side}Thigh`] = limb(legStart, knee, 140);
    result[`${side}Shin`] = limb(knee, foot, 140);
    result[`${side}Shoe`] = `${translate(foot)} rotate(${n(pose[`${side}Toe`])}) scale(${facing} 1)`;
    const armStart = point(shoulder.x + (side === "front" ? -30 : -47), shoulder.y + (side === "front" ? 14 : 25));
    const hand = point(pose[`${side}HandX`], pose[`${side}HandY`]);
    const elbow = joint(armStart, hand, 110, 110, facing);
    if (side === "front") {
      // The last reference has a gently bent, raised far arm, with the elbow above the shoulder.
      elbow.x += (hip.x + 78 - elbow.x) * pose.pointing;
      elbow.y += (hip.y - 204 - elbow.y) * pose.pointing;
    }
    result[`${side}UpperArm`] = limb(armStart, elbow, 125);
    result[`${side}Forearm`] = limb(elbow, hand, 122);
    result[`${side}Hand`] = `${translate(hand)} rotate(${n(pose[`${side}Wrist`])})`;
  }
  return result;
}

export function attachRig(svg: SVGSVGElement) {
  const nodes = new Map<string, SVGElement>();
  svg.querySelectorAll<SVGElement>("[data-part]").forEach((element) => {
    nodes.set(element.dataset.part!, element);
  });
  const loose = nodes.get("loosePhones");
  const worn = nodes.get("wornPhones");
  const fingers = svg.querySelector<SVGElement>("[data-fingers]");
  const pointer = svg.querySelector<SVGElement>("[data-pointer]");
  const cable = svg.querySelector<SVGPathElement>("[data-headphone-cable]");
  const rearHair = svg.querySelector<SVGElement>("[data-rear-hair]");
  const backSeam = svg.querySelector<SVGElement>("[data-back-seam]");
  return (pose: StudioPose) => {
    const values = transforms(pose);
    for (const [key, value] of Object.entries(values)) nodes.get(key)?.setAttribute("transform", value);
    loose?.setAttribute("opacity", pose.wearing >= 0.5 ? "0" : "1");
    worn?.setAttribute("opacity", pose.wearing >= 0.5 ? "1" : "0");
    fingers?.setAttribute("opacity", pose.pointing >= 0.5 ? "0" : "1");
    pointer?.setAttribute("opacity", pose.pointing >= 0.5 ? "1" : "0");
    rearHair?.setAttribute("opacity", pose.facing < 0 ? "1" : "0");
    backSeam?.setAttribute("opacity", pose.facing < 0 ? "1" : "0");
    if (cable) {
      const angle = pose.lean * rad;
      const headAngle = (pose.lean + pose.headTilt) * rad;
      const headX = pose.x + Math.sin(angle) * (torsoLength * pose.stretch + headLift);
      const headY = pose.y - Math.cos(angle) * (torsoLength * pose.stretch + headLift);
      const x = pose.wearing >= 0.5 ? headX - Math.cos(headAngle) * 25 - Math.sin(headAngle) * 36 : pose.headphonesX;
      const y = pose.wearing >= 0.5 ? headY - Math.sin(headAngle) * 25 + Math.cos(headAngle) * 36 : pose.headphonesY + 65;
      cable.setAttribute("d", `M${n(x)} ${n(y)} C${n(x + 20)} ${n(y + 120)} ${n(x + 60)} 814 1190 849 Q1240 863 1290 848`);
    }
  };
}
