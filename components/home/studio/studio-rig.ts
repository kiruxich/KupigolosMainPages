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
  x: 654, y: 692, lean: -9, stretch: 1.13, facing: -1, headTilt: 2,
  frontFootX: 452, frontFootY: 840, backFootX: 550, backFootY: 836,
  frontToe: 0, backToe: 0,
  frontHandX: 480, frontHandY: 578, backHandX: 420, backHandY: 571,
  frontWrist: -95, backWrist: -85, mouth: 0,
  headphonesX: 1287, headphonesY: 499, headphonesAngle: 0, wearing: 0, pointing: 0,
};

export const STANDING: Partial<StudioPose> = {
  x: 1070, y: 590, lean: 3, stretch: 1, facing: 1, headTilt: 0,
  frontFootX: 1115, frontFootY: 844, backFootX: 1028, backFootY: 842,
  frontToe: 0, backToe: 0,
  frontHandX: 1120, frontHandY: 629, backHandX: 1032, backHandY: 637,
  frontWrist: -10, backWrist: 12,
};

export const FINAL: StudioPose = {
  ...SEATED, ...STANDING,
  lean: 0, headTilt: -21,
  frontHandX: 1200, frontHandY: 294, frontWrist: -141,
  backHandX: 1040, backHandY: 637, backWrist: 0,
  mouth: 0, wearing: 1, pointing: 1,
};

type Point = { x: number; y: number };
const deg = 180 / Math.PI;
const rad = Math.PI / 180;
const n = (value: number) => value.toFixed(3);
const point = (x: number, y: number): Point => ({ x, y });
const translate = (p: Point) => `translate(${n(p.x)} ${n(p.y)})`;
const segment = (a: Point, b: Point) => `${translate(a)} rotate(${n(Math.atan2(b.y - a.y, b.x - a.x) * deg - 90)})`;

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
  const shoulder = point(hip.x + Math.sin(angle) * 198 * pose.stretch, hip.y - Math.cos(angle) * 198 * pose.stretch);
  const head = point(shoulder.x + Math.sin(angle) * 72, shoulder.y - Math.cos(angle) * 72);
  const result: Record<string, string> = {
    torso: `${translate(hip)} rotate(${n(pose.lean)}) scale(1 ${n(pose.stretch)})`,
    pelvis: `${translate(hip)} scale(${facing} 1)`,
    head: `${translate(head)} rotate(${n(pose.lean + pose.headTilt)}) scale(${facing} 1)`,
    wornPhones: `${translate(head)} rotate(${n(pose.lean + pose.headTilt)}) scale(${facing} 1)`,
    loosePhones: `translate(${n(pose.headphonesX)} ${n(pose.headphonesY)}) rotate(${n(pose.headphonesAngle)})`,
    mouth: `translate(40 22) scale(1 ${n(Math.max(0.08, pose.mouth))})`,
  };
  for (const side of ["back", "front"] as const) {
    const offset = side === "front" ? -13 : 18;
    const legStart = point(hip.x + offset, hip.y + 6);
    const foot = point(pose[`${side}FootX`], pose[`${side}FootY`] - 17);
    const knee = joint(legStart, foot, 140, 140, -facing);
    result[`${side}Thigh`] = segment(legStart, knee);
    result[`${side}Shin`] = segment(knee, foot);
    result[`${side}Shoe`] = `${translate(foot)} rotate(${n(pose[`${side}Toe`])}) scale(${facing} 1)`;
    const armStart = point(shoulder.x + (side === "front" ? -18 : 20), shoulder.y + 14);
    const hand = point(pose[`${side}HandX`], pose[`${side}HandY`]);
    const elbow = joint(armStart, hand, 125, 122, facing);
    result[`${side}UpperArm`] = segment(armStart, elbow);
    result[`${side}Forearm`] = segment(elbow, hand);
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
  return (pose: StudioPose) => {
    const values = transforms(pose);
    for (const [key, value] of Object.entries(values)) nodes.get(key)?.setAttribute("transform", value);
    loose?.setAttribute("opacity", pose.wearing >= 0.5 ? "0" : "1");
    worn?.setAttribute("opacity", pose.wearing >= 0.5 ? "1" : "0");
    fingers?.setAttribute("opacity", pose.pointing >= 0.5 ? "0" : "1");
    pointer?.setAttribute("opacity", pose.pointing >= 0.5 ? "1" : "0");
    if (cable) {
      const angle = pose.lean * rad;
      const x = pose.wearing >= 0.5 ? pose.x + Math.sin(angle) * 198 * pose.stretch : pose.headphonesX;
      const y = pose.wearing >= 0.5 ? pose.y - Math.cos(angle) * 198 * pose.stretch - 35 : pose.headphonesY + 65;
      cable.setAttribute("d", `M${n(x)} ${n(y)} C${n(x + 20)} ${n(y + 120)} ${n(x + 60)} 814 1190 849 Q1240 863 1290 848`);
    }
  };
}
