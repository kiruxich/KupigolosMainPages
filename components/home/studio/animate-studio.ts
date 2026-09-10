import { gsap } from "gsap";
import { attachRig, FINAL, SEATED, type StudioPose } from "./studio-rig";

export function animateStudio(svg: SVGSVGElement, scene: HTMLDivElement, cta: HTMLAnchorElement) {
  const pose: StudioPose = { ...SEATED };
  const draw = attachRig(svg);
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let visible = false;
  let complete = false;
  let disposed = false;
  const timeline = gsap.timeline({
    paused: true,
    defaults: { ease: "sine.inOut" },
    onUpdate: () => draw(pose),
    onComplete: () => {
      complete = true;
      scene.dataset.state = "complete";
    },
  });

  // A short typing beat, then weight shifts from the chair onto both feet.
  timeline.to(pose, { frontHandY: 572, backHandY: 567, duration: .16, repeat: 3, yoyo: true }, 0);
  timeline.to(pose, {
    x: 705, y: 640, lean: -13, stretch: 1.04,
    frontHandX: 610, frontHandY: 628, backHandX: 677, backHandY: 622,
    frontFootX: 670, frontFootY: 842, backFootX: 602, backFootY: 840,
    frontWrist: -70, backWrist: 35, duration: .45,
  }, .7);
  timeline.to(pose, {
    x: 746, y: 590, lean: 5, stretch: 1,
    frontHandX: 798, frontHandY: 620, backHandX: 711, backHandY: 623,
    frontFootX: 735, frontFootY: 842, backFootX: 704, backFootY: 840,
    frontWrist: -8, backWrist: 10, duration: .4,
  }, 1.15);
  timeline.set(pose, { facing: 1, headTilt: 0 }, 1.2);

  // Each stride has a planted supporting foot and a lifted, travelling foot.
  const steps = [
    { at: 1.6, x: 850, foot: "front", from: 735, to: 890 },
    { at: 2.15, x: 965, foot: "back", from: 704, to: 1010 },
    { at: 2.7, x: 1070, foot: "front", from: 890, to: 1115 },
  ] as const;
  for (const step of steps) {
    timeline.to(pose, { x: step.x, duration: .55, ease: "none" }, step.at);
    timeline.to(pose, { y: 582, lean: 6, duration: .26 }, step.at);
    timeline.to(pose, { y: 590, lean: 3, duration: .29 }, step.at + .26);
    timeline.to(pose, {
      [`${step.foot}FootX`]: (step.from + step.to) / 2,
      [`${step.foot}FootY`]: 798,
      [`${step.foot}Toe`]: -12,
      duration: .27,
    }, step.at);
    timeline.to(pose, {
      [`${step.foot}FootX`]: step.to,
      [`${step.foot}FootY`]: 844,
      [`${step.foot}Toe`]: 0,
      duration: .28,
    }, step.at + .27);
    const forward = step.foot === "front" ? -32 : 62;
    timeline.to(pose, {
      frontHandX: step.x + forward, frontHandY: 625,
      backHandX: step.x - forward, backHandY: 621,
      headTilt: step.foot === "front" ? 2 : -2,
      duration: .55,
    }, step.at);
  }
  timeline.to(pose, { backFootX: 1028, backFootY: 842, headTilt: 0, duration: .22 }, 3.25);

  // Reach, take the headphones off the hook, lift, then settle them over the ears.
  timeline.to(pose, {
    frontHandX: 1252, frontHandY: 525, frontWrist: -85,
    backHandX: 1030, backHandY: 632, backWrist: 0,
    lean: 6, duration: .45,
  }, 3.4);
  timeline.to(pose, {
    headphonesX: 1180, headphonesY: 450, headphonesAngle: -12,
    frontHandX: 1148, frontHandY: 480, frontWrist: 170,
    backHandX: 1215, backHandY: 468, backWrist: -160,
    duration: .35,
  }, 3.85);
  timeline.to(pose, {
    headphonesX: 1080, headphonesY: 317, headphonesAngle: 0,
    frontHandX: 1042, frontHandY: 340, frontWrist: 175,
    backHandX: 1110, backHandY: 336, backWrist: -175,
    lean: 3, duration: .45,
  }, 4.2);
  timeline.set(pose, { wearing: 1 }, 4.65);

  // Recording occupies 2.5 seconds, with changing mouth shapes and three gestures.
  timeline.to(pose, { mouth: .9, duration: .12, repeat: 15, yoyo: true, ease: "sine.inOut" }, 4.8);
  timeline.to(pose, { backHandX: 1170, backHandY: 512, backWrist: -105, headTilt: 2, duration: .45 }, 4.8);
  timeline.to(pose, {
    lean: 8, headTilt: 3,
    frontHandX: 1063, frontHandY: 340,
    backHandX: 1160, backHandY: 477, backWrist: -40,
    duration: .55,
  }, 5.3);
  timeline.to(pose, {
    lean: 2, headTilt: -1,
    frontHandX: 1175, frontHandY: 518, frontWrist: -88,
    backHandX: 1118, backHandY: 456, backWrist: 162,
    duration: .6,
  }, 5.9);
  timeline.to(pose, {
    lean: 4, headTilt: 1, frontHandY: 497, backHandY: 469,
    frontWrist: -102, duration: .4,
  }, 6.5);
  timeline.to(pose, { mouth: .6, duration: .13, repeat: 1, yoyo: true }, 6.82);

  // Penultimate pose: finish the phrase and fully lower both hands.
  timeline.to(pose, {
    mouth: 0, lean: 0, headTilt: -4,
    frontHandX: 1100, frontHandY: 638, frontWrist: 0,
    backHandX: 1040, backHandY: 637, backWrist: 0,
    duration: .5,
  }, 7.3);
  // Hold, then follow the rising hand with the eyes. No repeat or return to the desk.
  timeline.to(pose, {
    frontHandX: FINAL.frontHandX, frontHandY: FINAL.frontHandY,
    frontWrist: FINAL.frontWrist, headTilt: FINAL.headTilt,
    duration: .8, ease: "power2.inOut",
  }, 8.1);
  timeline.set(pose, { pointing: 1 }, 8.45);
  timeline.to(cta, { scale: 1.035, duration: .3, repeat: 1, yoyo: true, ease: "sine.inOut" }, 9.05);

  function still() {
    timeline.pause();
    Object.assign(pose, FINAL);
    draw(pose);
    gsap.set(cta, { clearProps: "transform" });
    complete = true;
    scene.dataset.state = "complete";
  }
  function resume() {
    if (disposed || complete || !visible || document.hidden) return;
    if (motion.matches) still();
    else {
      scene.dataset.state = "playing";
      timeline.play();
    }
  }
  function visibilityChange() {
    if (document.hidden) timeline.pause();
    else resume();
  }
  function motionChange() {
    if (motion.matches) still();
  }

  draw(pose);
  const observer = new IntersectionObserver(([entry]) => {
    visible = Boolean(entry?.isIntersecting && entry.intersectionRatio >= .45);
    if (visible) resume();
    else timeline.pause();
  }, { threshold: [0, .45], rootMargin: "-90px 0px -20px 0px" });
  observer.observe(scene);
  document.addEventListener("visibilitychange", visibilityChange);
  motion.addEventListener("change", motionChange);
  if (motion.matches) still();

  return () => {
    disposed = true;
    observer.disconnect();
    timeline.kill();
    document.removeEventListener("visibilitychange", visibilityChange);
    motion.removeEventListener("change", motionChange);
    gsap.set(cta, { clearProps: "transform" });
  };
}
