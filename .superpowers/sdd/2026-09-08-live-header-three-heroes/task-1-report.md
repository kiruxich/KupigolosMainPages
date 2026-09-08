# Task 1 report

Status: DONE

Changed `scripts/validate.mjs` to enforce the new three-hero structural contract:
- exactly three `[data-hero-variant]` hero sections
- exactly one H1
- original kicker, title, lead, and `#voices` CTA in every hero variant
- local `hero-studio.jpg`, `hero-console.jpg`, and `hero-script.jpg` inside the hero comparison
- `#voices` appearing after the third hero in source order
- rejection of option labels, blur controls, rail expansion selectors, and backend form submission patterns

Kept the existing header trigger/panel, drawer, voice, audio, calculator, and motion assertions.

Verification:
- `node --check scripts/validate.mjs` ✅
- `node scripts/validate.mjs` ✅ fails on the pre-change markup with 4 expected contract violations

Concerns:
- The current markup still reflects the old single-hero/expanded-rail structure, so the validator remains intentionally red until later tasks update the HTML/CSS.
