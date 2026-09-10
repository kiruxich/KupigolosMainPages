# SVG studio section

The generated PNGs are composition and pose references only. The live About section now renders editable SVG geometry, with seeded Rough.js pen outlines/hatching, a two-bone inverse-kinematics character, and a GSAP timeline. It does not display the storyboard PNGs or WebP frame copies.

Files:
- components/home/about.tsx — semantic HTML headline, description, contact CTA, and SVG stage.
- components/home/about.module.css — desktop composition and mobile typography.
- components/home/studio/pen.tsx — stable seeded Rough.js paths and SVG texture patterns.
- components/home/studio/equipment.tsx — desk, audio equipment, plants, chair, microphone.
- components/home/studio/character.tsx — separate clothing, face, hair, hands, headphones and limbs.
- components/home/studio/studio-rig.ts — poses, joints and SVG transforms.
- components/home/studio/animate-studio.ts — one-shot timeline, visibility pause/resume and final pose.

Sequence: typing → rise → three steps → take headphones → put them on → 2.5-second recording performance → lower both hands → pause → point at CTA → one CTA pulse → hold.

Text and CTA are HTML, not paths or bitmap text. The CTA keeps the approved old label «Обсудить проект» and links to #contacts. The exact per-stroke appearance of the generated raster illustrations is not reproduced; the artwork is redrawn in vector form.

No tests, type checks, lint, builds, HTTP checks, browser checks or visual verification were run for this implementation, per the user's explicit project rule.
