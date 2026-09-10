# Character redraw

Reference sources: `frame-01-desk.png`, `frame-06c-recording-finish.png`, `frame-07-cta.png`.

The character is drawn in SVG. The reference files are not embedded into the live section.

## Reference details transferred

- Dark curly hair with separate ink shadows, curved strands and narrow highlights. A rear hair layer covers more of the face in the seated view.
- A smaller profile with a defined brow, eyelid, nose, lips, jaw and ear; the face is not covered with diagonal stripes.
- A loose light sweatshirt with shoulder seams, layered folds, ribbed collar, cuffs and waistband.
- Darker straight jeans with directional short strokes, seams, creases, pockets and rolled hems.
- Low canvas sneakers with eyelets, laces, toe caps, heel patches and rubber soles.
- Separate relaxed and pointing hands with smaller fingers and joint details.
- Detailed headphones with headband, cushions and earcup highlights.

The character has its own tonal fills and seeded short-stroke texture in `character-ink.tsx`. Rough.js supplies the slightly irregular outer contours. Equipment keeps its existing rendering.

The rig uses a higher standing hip, shorter effective legs, revised shoulder anchors and a reference-specific final elbow. Limb artwork scales to the distance between joints so the wrists and ankles stay connected to their targets. The final pose brings the far arm up toward the button and leaves the near hand beside the hip. The headphone cable origin follows the revised earcup position.

No tests, type checks, lint, builds, browser checks or rendered comparison were run for this redraw. Exact visual fidelity remains unverified.
