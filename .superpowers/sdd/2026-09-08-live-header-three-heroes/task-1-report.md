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

## Round 1/5 fix

Updated `scripts/validate.mjs` to close the three review gaps:
- replaced the single global hero CTA check with a per-hero CTA count, so each `[data-hero-variant]` must carry exactly one `hero-cta`
- required exactly one `#voices` section and kept the source-order check against the third hero
- broadened rail-expansion rejection across both `styles.css` and `refresh.css` by checking for standalone `studio-rail` expansion selectors instead of one exact string

Commands:
- `node --check scripts/validate.mjs`
- `node scripts/validate.mjs`

Output:
- `node --check scripts/validate.mjs` ✅
- `node scripts/validate.mjs` ❌ `Validation failed (4):`
  - `html: expected exactly three hero sections via [data-hero-variant], found 0`
  - `html: proof statistics remain`
  - `css: rail expansion selectors remain`
  - `refresh: hero blur controls remain`
