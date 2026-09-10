import { Application, Assets, Container, Graphics, Matrix, Sprite, type Texture } from "pixi.js";
import { gsap } from "gsap";
import { makeSkin, type Vec } from "./skin-mesh";
import { createInkTransfer } from "./ink-transfer";
import { createSandDissolveMask } from "./sand-dissolve";
import { createRecordingPerformance } from "./recording-performance";
import { BIND, END, START, characterVisibility, makeTimeline, skeleton, type Chain } from "./studio-motion";

type Region = { file: string; x: number; y: number; width: number; height: number };
type Atlas = Record<string, Region>;
const WIDTH = 1536, TOP = 230, HEIGHT = 680;
const ink = 0x28364c, rust = 0xc44729;
const radians = (angle: number) => angle * Math.PI / 180;
const forearmAngle = (chain: Chain) => Math.atan2(chain[2].y - chain[1].y, chain[2].x - chain[1].x);

/** Source-space affine, shared by the garment root and its attached skin. */
function between(a: Vec, b: Vec, nextA: Vec, nextB: Vec) {
  const dx = b.x - a.x, dy = b.y - a.y, length = Math.max(.001, Math.hypot(dx, dy));
  const ux = dx / length, uy = dy / length;
  const nx = nextB.x - nextA.x, ny = nextB.y - nextA.y, nextLength = Math.max(.001, Math.hypot(nx, ny));
  const vx = nx / nextLength, vy = ny / nextLength;
  const aa = nx / length * ux + vy * uy, bb = ny / length * ux - vx * uy;
  const cc = nx / length * uy - vy * ux, dd = ny / length * uy + vx * ux;
  return new Matrix(aa, bb, cc, dd, nextA.x - aa * a.x - cc * a.y, nextA.y - bb * a.x - dd * a.y);
}
function rigid(source: Vec, target: Vec, angle = 0) {
  const c = Math.cos(angle), s = Math.sin(angle);
  return new Matrix(c, s, -s, c, target.x - c * source.x + s * source.y, target.y - s * source.x - c * source.y);
}

export async function mountStudio(host: HTMLDivElement, scene: HTMLDivElement, cta: HTMLAnchorElement, signal: AbortSignal) {
  const response = await fetch("/assets/studio/textures/manifest.json", { signal });
  if (!response.ok) throw new Error("Studio artwork could not load");
  const atlas = await response.json() as Atlas;
  const textures = new Map<string, Texture>();
  await Promise.all(Object.entries(atlas).filter(([name]) => !name.endsWith("poster")).map(async ([name, region]) => {
    const url = region.file.startsWith("/") ? region.file : `/assets/studio/textures/${region.file}`;
    textures.set(name, await Assets.load<Texture>(url));
  }));
  if (signal.aborted) return () => {};
  const app = new Application();
  await app.init({ width: 1, height: 1, backgroundAlpha: 0, antialias: true, autoStart: false,
    resolution: Math.min(window.devicePixelRatio || 1, 2), autoDensity: true, preference: "webgl", powerPreference: "low-power" });
  if (signal.aborted) { app.destroy(true, { children: true }); return () => {}; }
  const world = new Container();
  world.eventMode = "none";
  app.stage.addChild(world);
  app.canvas.setAttribute("aria-hidden", "true");
  host.appendChild(app.canvas);
  const pose = { ...START };
  const skins: ReturnType<typeof makeSkin>[] = [];

  function sprite(name: string, parent: Container) {
    const region = atlas[name], texture = textures.get(name);
    if (!region || !texture) return undefined;
    const wrap = new Container();
    const image = new Sprite(texture);
    image.position.set(region.x, region.y);
    image.width = region.width; image.height = region.height;
    wrap.addChild(image); parent.addChild(wrap);
    return wrap;
  }
  function skin(name: string, parent: Container, bind: Chain) {
    const region = atlas[name], texture = textures.get(name);
    if (!region || !texture) return undefined;
    const item = makeSkin(texture, region, bind);
    skins.push(item); parent.addChild(item.mesh);
    return item;
  }
  const shadows = new Graphics();
  world.addChild(shadows);
  sprite("desk", world);
  const playhead = new Graphics();
  world.addChild(playhead);

  function character(view: "side" | "rear") {
    const group = new Container(); world.addChild(group);
    const left = view === "rear" ? 400 : 940, right = view === "rear" ? 770 : 1260;
    const dissolve = createSandDissolveMask(world, { x: left, y: TOP, width: right - left, height: HEIGHT });
    let masked = false;
    const rig = new Container(); group.addChild(rig);
    const prefix = view === "rear" ? "seated-" : "";
    const bind = BIND[view];
    const backLeg = skin(`${prefix}back-leg`, rig, bind.backLeg);
    const backShoe = sprite(`${prefix}back-shoe`, rig);
    const frontLeg = skin(`${prefix}front-leg`, rig, bind.frontLeg);
    const frontShoe = sprite(`${prefix}front-shoe`, rig);
    const pelvis = sprite(`${prefix}pelvis`, rig);
    const frontArm = skin(`${prefix}front-arm`, rig, bind.frontArm);
    const relaxed = sprite(view === "rear" ? "seated-front-hand" : "relaxed-hand", rig);
    const pointer = view === "side" ? sprite("front-hand", rig) : undefined;
    const torso = sprite(`${prefix}torso`, rig);
    if (view === "side" && torso) {
      // Restore the sweater's edge where the reference sleeve used to cover it.
      const sideSeam = new Graphics().moveTo(993.8, 374.5)
        .bezierCurveTo(996.4, 409, 998.3, 438, 1000, 463)
        .bezierCurveTo(1001.5, 487, 1003.8, 513, 1006.1, 537.8)
        .bezierCurveTo(1018.2, 540.1, 1030.1, 540.3, 1048, 540.1)
        .stroke({ color: ink, width: 1.35, alpha: .7 });
      torso.addChild(sideSeam);
    }
    const bareHead = sprite(view === "rear" ? "seated-head" : "walking-head", rig);
    const recordingHead = view === "side" ? sprite("head", rig) : undefined;
    const backArm = skin(`${prefix}back-arm`, rig, bind.backArm);
    const backHand = sprite(`${prefix}back-hand`, rig);
    const performance = view === "side" ? createRecordingPerformance(group, rig, atlas, textures) : undefined;
    return {
      update(state: ReturnType<typeof skeleton>) {
        const amount = characterVisibility(pose.transfer, view === "rear");
        const active = view === "rear" ? pose.rear : 1 - pose.rear;
        group.visible = active > .5 && amount > .001;
        if (!group.visible || amount >= .999) {
          if (masked) { group.mask = null; masked = false; }
        }
        if (!group.visible) return;
        if (amount < .999) {
          dissolve.update(amount);
          if (!masked) { group.mask = dissolve.mask; masked = true; }
        }
        performance?.update(pose.time, pose.speaking, pose.reading, pose.pointing);
        const root = between(bind.hip, bind.neck, state.hip, state.neck);
        const hips = rigid(bind.hip, state.hip);
        torso?.setFromMatrix(root); pelvis?.setFromMatrix(hips);
        frontArm?.update(state.frontArm, root); backArm?.update(state.backArm, root);
        frontLeg?.update(state.frontLeg, hips); backLeg?.update(state.backLeg, hips);
        frontShoe?.setFromMatrix(rigid(bind.frontLeg[2], state.frontLeg[2], radians(pose.frontToe)));
        backShoe?.setFromMatrix(rigid(bind.backLeg[2], state.backLeg[2], radians(pose.backToe)));
        const handAnchor = view === "rear" ? bind.frontArm[2] : { x: 1053, y: 563 };
        const frontAngle = forearmAngle(state.frontArm);
        relaxed?.setFromMatrix(rigid(handAnchor, state.frontArm[2], frontAngle - (view === "rear" ? forearmAngle(bind.frontArm) : radians(74))));
        // Swap finger drawings at a shared cuff instead of ghosting two hands.
        if (relaxed) relaxed.visible = pose.pointing < .55;
        pointer?.setFromMatrix(rigid(bind.frontArm[2], state.frontArm[2], frontAngle - forearmAngle(bind.frontArm)));
        if (pointer) pointer.visible = pose.pointing >= .55;
        backHand?.setFromMatrix(rigid(bind.backArm[2], state.backArm[2], forearmAngle(state.backArm) - forearmAngle(bind.backArm)));
        const tilt = radians(pose.lean + pose.headTilt);
        const bareAnchor = view === "rear" ? { x: 670, y: 436 } : { x: 982, y: 351 };
        bareHead?.setFromMatrix(rigid(bareAnchor, state.neck, radians(pose.lean)));
        if (bareHead) bareHead.visible = view === "rear" || pose.wearing < .5;
        recordingHead?.setFromMatrix(rigid(bind.neck, state.neck, tilt));
        if (recordingHead) recordingHead.visible = pose.wearing >= .5;
      },
      destroy() {
        group.mask = null;
        performance?.destroy();
        dissolve.destroy();
      },
    };
  }
  const side = character("side"), rear = character("rear");
  const transfer = createInkTransfer(world);
  const chair = sprite("chair", world);
  sprite("plant", world);
  sprite("mic", world);
  const phones = sprite("headphones", world);
  const cable = new Graphics();
  const recordingLight = new Graphics();
  world.addChild(cable, recordingLight);
  let disposed = false, complete = false, visible = false;
  let renderWidth = 1;

  function draw() {
    if (disposed) return;
    const recording = pose.speaking > .15;
    if ((scene.dataset.recording === "true") !== recording) scene.dataset.recording = String(recording);
    const state = skeleton(pose);
    side.update(state); rear.update(state);
    transfer.update(pose.transfer);
    const bodyAmount = characterVisibility(pose.transfer, pose.rear > .5);
    if (chair) chair.x = pose.chairX;
    phones?.setFromMatrix(rigid({ x: 1327, y: 522 }, { x: pose.phonesX, y: pose.phonesY }, radians(pose.phonesAngle)));
    if (phones) {
      phones.visible = pose.wearing < .5;
      phones.alpha = characterVisibility(pose.transfer, true);
    }
    shadows.clear();
    for (let ring = 4; ring >= 0; ring--) {
      shadows.ellipse(330, 858, 295 + ring * 4, 7 + ring * 2).fill({ color: ink, alpha: .014 });
      shadows.ellipse(650 + pose.chairX, 878, 139 + ring * 3, 5 + ring * 1.5).fill({ color: ink, alpha: .018 });
      shadows.ellipse(1320, 875, 117 + ring * 3, 4 + ring).fill({ color: ink, alpha: .012 });
      const frontLift = Math.max(0, 824 - pose.frontFootY);
      const backLift = Math.max(0, 817 - pose.backFootY);
      shadows.ellipse(pose.frontFootX + 26, 865, 50 + ring * 3 - frontLift * .15, 3 + ring)
        .fill({ color: ink, alpha: .025 * bodyAmount / (1 + frontLift / 24) });
      shadows.ellipse(pose.backFootX + 28, 852 - pose.seated * 12, 43 + ring * 3 - backLift * .15, 3 + ring)
        .fill({ color: ink, alpha: .02 * bodyAmount / (1 + backLift / 24) });
    }
    playhead.clear();
    const scan = 244 + (pose.time * 26) % 212;
    playhead.moveTo(scan, 405).lineTo(scan, 524).stroke({ color: rust, width: 1.6, alpha: .62 });
    playhead.circle(scan, 405, 2.5).fill({ color: rust, alpha: .72 });
    recordingLight.clear();
    if (pose.speaking > .01) {
      recordingLight.circle(1282, 285, 3).fill({ color: rust, alpha: .5 + .5 * Math.sin(pose.time * 5) ** 2 });
    }
    cable.clear();
    cable.alpha = bodyAmount;
    const sway = complete ? 0 : Math.sin(pose.time * 3.3) * (pose.wearing ? 4 : 2);
    if (pose.wearing >= .5) {
      const bodyMatrix = between(BIND.side.hip, BIND.side.neck, state.hip, state.neck);
      const outlet = bodyMatrix.apply({ x: 1116, y: 536 });
      cable.moveTo(outlet.x, outlet.y).bezierCurveTo(outlet.x + 30 + sway, outlet.y + 140, 1155 + sway, 824, 1190, 850)
        .bezierCurveTo(1252, 878, 1300, 843, 1316, 858).stroke({ color: ink, width: 1.45, alpha: .8 });
    } else {
      cable.moveTo(pose.phonesX + 4, pose.phonesY + 44).bezierCurveTo(pose.phonesX - 4 + sway, 720, 1274, 843, 1195, 852)
        .bezierCurveTo(1150, 860, 1206, 870, 1276, 853).stroke({ color: ink, width: 1.4, alpha: .65 });
    }
    app.render();
  }
  const timeline = makeTimeline(pose, cta, draw, () => {
    complete = true;
    Object.assign(pose, END);
    scene.dataset.state = "complete";
    draw();
  });
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  function still() {
    timeline.pause(); complete = true; Object.assign(pose, END);
    gsap.set(cta, { clearProps: "transform" }); scene.dataset.state = "complete"; draw();
  }
  function resume() {
    if (disposed || complete || !visible || document.hidden) return;
    if (motion.matches) still();
    else { scene.dataset.state = "playing"; timeline.play(); }
  }
  function resize() {
    if (disposed) return;
    renderWidth = Math.max(1, host.clientWidth);
    app.renderer.resize(renderWidth, renderWidth * HEIGHT / WIDTH);
    world.scale.set(renderWidth / WIDTH);
    world.position.set(0, -TOP * renderWidth / WIDTH);
    draw();
  }
  const size = new ResizeObserver(resize); size.observe(host); resize();
  scene.dataset.renderer = "pixi";
  scene.dataset.state = "ready";
  let pendingVisibility = 0;
  function updateVisibility() {
    pendingVisibility = 0;
    if (disposed || complete) return;
    const bounds = host.getBoundingClientRect();
    const exposed = Math.min(bounds.bottom, window.innerHeight - 10) - Math.max(bounds.top, 80);
    visible = exposed >= Math.min(bounds.height, window.innerHeight - 90) * .25;
    if (visible) resume(); else timeline.pause();
  }
  function scrollVisibility() {
    if (!pendingVisibility && !complete) pendingVisibility = requestAnimationFrame(updateVisibility);
  }
  window.addEventListener("scroll", scrollVisibility, { passive: true });
  window.addEventListener("resize", scrollVisibility, { passive: true });
  updateVisibility();
  const pageVisibility = () => { if (document.hidden) timeline.pause(); else updateVisibility(); };
  const preference = () => { if (motion.matches) still(); };
  document.addEventListener("visibilitychange", pageVisibility);
  motion.addEventListener("change", preference);
  if (motion.matches) still();
  return () => {
    disposed = true; timeline.kill(); size.disconnect();
    cancelAnimationFrame(pendingVisibility);
    window.removeEventListener("scroll", scrollVisibility);
    window.removeEventListener("resize", scrollVisibility);
    document.removeEventListener("visibilitychange", pageVisibility);
    motion.removeEventListener("change", preference);
    gsap.set(cta, { clearProps: "transform" });
    side.destroy(); rear.destroy();
    transfer.destroy();
    for (const item of skins) item.destroy();
    app.destroy(true, { children: true });
    delete scene.dataset.renderer;
    delete scene.dataset.recording;
  };
}
