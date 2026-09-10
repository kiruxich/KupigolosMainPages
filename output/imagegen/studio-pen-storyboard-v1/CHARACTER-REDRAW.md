# Studio illustration and animation

The live section uses a transparent PixiJS canvas inside the normal page grid. The heading, description, CTA and three stage labels remain HTML. The button keeps its existing text and link and uses the site's shared `studio-cta` style. Headings and stage labels align with the shared page shell, and the transparent section reveals the same page background as its neighbours. Illustration width follows the available viewport height; the section accounts for the page's existing 90px scroll padding when navigating under the fixed menu.

## Artwork

`prepare-studio-textures.py` authors transparent, lossless WebP layers from the approved illustrations, retaining their original RGB detail. Source-space masks isolate the furniture, equipment, plants, character views, shoes, hands and headphones. The manifest keeps the original 1536 × 1024 coordinates and the crop bounds of every texture.

The standing body comes from `frame-07-cta.png`; the seated rear view and loose headphones from `frame-01-desk.png`; the bare profile from `frame-03-walk.png`; the relaxed hand from `frame-06c-recording-finish.png`.

A sleeve is one texture and one mesh spanning shoulder, elbow and wrist. A trouser leg similarly spans hip, knee and ankle. Smooth skin weights blend bone rotations separately from stretch around the shared joint; proximal weights attach the cloth to the body with the same rotation-aware interpolation. This preserves sleeve width during large elbow turns instead of collapsing it by averaging opposing transforms. The renderer moves mesh vertices, rather than separating rigid upper/lower garment pieces. Different head and hand drawings handle changes of view and the final pointing gesture.

The transparent `initial-poster.webp` shows the seated pose during loading; `poster.webp` shows the final pose for reduced motion or unavailable WebGL. Neither contains text or a button, and neither participates in animation playback.

Underpaint restores the jeans hidden by the source hand and the sweater side hidden by its sleeve. The jeans use exposed fabric from `frame-06b-recording-gesture.png`; the sweater uses clean fabric from the standing reference. This prevents a duplicate hand and an empty wedge appearing when the arm moves. Hands follow their forearm angles, and a tighter relaxed-hand mask excludes adjacent denim.

The desk mask includes authored background seeds and an empty-space cutout beneath the tabletop. These remove paper enclosed by furniture and cables, which an edge-only flood cannot reach. The same corrected alpha is used in the animated desk and both fallback posters.

## Motion

The GSAP timeline plays once: type, crumble into fine sand, flow along the floor, reassemble at the mic already wearing headphones, record with small mouth/head/arm gestures, lower the arm, pause, point at the CTA, then hold. The transfer lasts 0.95 seconds; the whole sequence lasts 6.9 seconds. The CTA pulses once after the final gesture.

Standing up, walking and putting headphones on have no intermediate body poses. A fine alpha-noise mask erodes the seated illustration from the head downward, without rectangular tiles or a whole-body fade. 6200 small, soft grains fall into a low stream, flow toward the mic and settle into the standing silhouette from the feet upward. Their departure and arrival times follow the mask's mean erosion edge. The skeleton switches directly to the stable destination pose while both illustrations are hidden. Character shadows and the headphone cable follow the same visibility. Furniture stays still.

The sand uses one textured mesh with preallocated vertices, UVs and indices and a small shared grain atlas, without line streaks or a display object per grain. Each character's dissolve mask uses one reusable canvas texture with at most 80000 pixels; its sprite never renders as visible artwork. Helpers follow the existing scene clock, stop updating at the endpoints and release their textures and geometry on cleanup.

Recording uses a small far-arm gesture with the near arm relaxed, without reaching back to the ears. Finger drawings switch at the shared cuff without overlapping translucent hands.

The monitor playhead, recording light, headphone cable and contact shadows follow the same clock. Rendering pauses outside the visible section or in a hidden tab. After the final pose it stops entirely. Reduced-motion uses the final still pose immediately. Canvas size follows the section width and does not set the text layout.

## Files

- `components/home/about.tsx` — semantic section and deferred renderer lifetime.
- `components/home/studio/pixi-studio.ts` — canvas, scene layers, characters and lifecycle.
- `components/home/studio/studio-motion.ts` — poses, skeleton and GSAP sequence.
- `components/home/studio/ink-transfer.ts` — fine sand fall, floor flow and reassembly on the shared clock.
- `components/home/studio/sand-dissolve.ts` — fine-grain alpha erosion and bottom-up reveal.
- `components/home/studio/skin-mesh.ts` — continuous garment deformation.
- `components/home/studio/reference-*.ts` — source-space illustration masks.
- `scripts/prepare-studio-textures.py` — offline texture authoring; not needed at runtime.

The older Rough.js/SVG scene files remain in repository history/source, but are no longer imported by the section. No runtime tracing, image generation or frame-sequence playback is used.

## Review scope

The sand refinement has not been visually reviewed. Automatic approval review rejected browser navigation during the preceding transfer revision under the project's explicit-checks rule; no new visual-check authorization has been given. No browser checks, tests, lint, type checks or build were run for this refinement. The observations below describe the earlier movement implementation, which the transfer now replaces.

The user explicitly requested Computer Use review. The scene was viewed in the user's Chrome window, including the seated pose, rise, walk, headphone movement, recording gestures and final pointing pose. That review found and drove the garment underpaint, wrist alignment, reduced knee lift, loading-pose and anchor-offset corrections. The compact composition, shared CTA and all three stage labels fit together in the observed desktop viewport. No unit tests, lint, type checks or production build were run.

Follow-up Computer Use review isolated headphone contact, one-hand release, two-hand recording gestures and the pointing transition in Chrome. It exposed a far hand floating behind the head and drove the head-relative wrist targets, release order and rotation-aware skinning changes. The revised poses keep the hands attached to their cuffs and earcup contact follows the head; the previously visible white rectangle beneath the desk is absent. This is a visual review of these poses, not an automated animation test suite.
