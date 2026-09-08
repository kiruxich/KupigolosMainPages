# Live Header and Three Hero Variants Implementation Plan

> Required execution mode: subagent-driven development with task-scoped review.

**Goal:** Build the approved live-site header visual, restore the compact rail, and place three full hero concepts before the existing voices section.

**Architecture:** Preserve the static HTML/CSS/JavaScript stack. The header, rail, and hero comparison are the only redesigned surfaces. Existing voice cards and all later page sections remain intact.

**Spec:** `docs/superpowers/specs/2026-09-08-live-header-three-heroes-design.md`

## Global Constraints

- Copy only frontend appearance and interaction from kupigolos.ru. No backend form submission.
- Preserve the exact original hero copy in all three hero sections.
- Keep exactly one H1 and exactly three complete hero sections.
- Keep `#voices` once, after hero three, with its existing cards and data unchanged.
- The left rail never expands and never reveals every label at once.
- Use only existing local hero assets and existing dependencies.
- Preserve keyboard focus, Escape behavior, reduced motion, and 44 px mobile touch targets.
- Do not push unless the user explicitly asks.

## Task 1: Update structural validation

**Files:**
- Modify: `scripts/validate.mjs`

**Requirements:**

- [ ] Require exactly three hero sections through `[data-hero-variant]`.
- [ ] Require exactly one H1.
- [ ] Require the original title, lead, and CTA in all three variants.
- [ ] Require local assets `hero-studio.jpg`, `hero-console.jpg`, and `hero-script.jpg` in the hero comparison.
- [ ] Require `#voices` to occur after the third hero in source order.
- [ ] Reject option labels, a blur controller, rail expansion selectors, and backend form submission.
- [ ] Keep header trigger/panel, drawer, voice, audio, calculator, and motion assertions.
- [ ] Run `node --check scripts/validate.mjs` and demonstrate that validation fails on the pre-change markup for the new contract.

## Task 2: Implement semantic header, compact rail, and three heroes

**Files:**
- Modify: `index.html`

**Requirements:**

- [ ] Match the live header content structure and grouped public links defined by the spec.
- [ ] Keep visual-only callback controls and no submit endpoint.
- [ ] Preserve accessible ARIA hooks used by the existing JavaScript.
- [ ] Restore compact rail markup with all 13 targets but no rail expansion control or all-label panel.
- [ ] Replace the current single hero with three full hero sections using the exact approved copy and local assets.
- [ ] Use H1 in the first hero and H2 in hero two and three.
- [ ] Keep `#voices` and its cards after hero three without changing voice data.
- [ ] Run `node --check script.js` and the validator, noting expected CSS-related failures if any.

## Task 3: Implement final visual system and frontend behavior

**Files:**
- Modify: `refresh.css`
- Modify only if necessary: `script.js`

**Requirements:**

- [ ] Recreate the live coral header geometry, logo treatment, active AI capsule, menu spacing, icon actions, mega-menu surfaces, mobile drawer, and sticky behavior.
- [ ] Keep the header within 80 px and one line at desktop widths.
- [ ] Remove all rail expansion CSS. Keep the rail narrow with individual marker hover/focus feedback only.
- [ ] Style all three heroes as full viewport sections with distinct approved compositions and restrained neutral image masks.
- [ ] Ensure the voices section cannot enter the first hero viewport.
- [ ] Add explicit responsive layouts for tablet and mobile.
- [ ] Preserve current menu/drawer logic; adjust JavaScript only where the new semantic markup requires it.
- [ ] Run validation, `node --check script.js`, and motion scheduler tests.

## Task 4: Visual verification and polish

**Files:**
- Modify only files needed to fix verified defects.

**Requirements:**

- [ ] Inspect 1440x900, 1024x768, and 390x844 renders.
- [ ] Exercise header menus, outside click, Escape, callback drawer, mobile menu, rail anchors, hero CTA, and voice audio.
- [ ] Confirm one H1, three unlabeled heroes, narrow rail, voices after hero three, and no horizontal overflow.
- [ ] Run the full local verification suite after polish.

