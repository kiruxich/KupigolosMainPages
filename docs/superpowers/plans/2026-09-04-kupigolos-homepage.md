# Kupigolos Home Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete responsive Kupigolos home page with three switchable visual concepts and preserved SEO content.

**Architecture:** One semantic `index.html` is styled by CSS custom properties selected through `data-theme`. A small progressive-enhancement script manages theme state, mobile navigation, reveals and exclusive audio playback. No build system or third-party frontend dependency is required.

**Tech Stack:** HTML5, CSS custom properties, CSS Grid, native JavaScript, HTMLAudioElement, IntersectionObserver, JSON-LD

**Spec:** `docs/superpowers/specs/2026-09-04-kupigolos-homepage-design.md`

## Global Constraints

- Keep one semantic copy of page content in the DOM.
- Preserve current public SEO title, description, H1, major section headings, factual claims and important links.
- Support desktop, tablet and 390px mobile layouts.
- Honor reduced motion and keyboard navigation.
- Use only real current-site facts, portraits, audio, portfolio, reviews, ratings and clients.
- Avoid generic SaaS cards, purple gradients, decorative glows, section numbers and fake dashboards.

---

### Task 1: Semantic content and SEO

**Files:**
- Create: `index.html`
- Create: `scripts/validate.mjs`

**Interfaces:**
- Produces: stable section IDs, `.theme-switcher`, `[data-audio-src]`, `#site-nav` and all content hooks consumed by later tasks.

- [ ] Write `scripts/validate.mjs` assertions for one H1, required section IDs, six AI service titles, three theme buttons, metadata and no duplicate H1.
- [ ] Run `node scripts/validate.mjs` and confirm it fails because `index.html` does not exist.
- [ ] Build semantic HTML with metadata, JSON-LD, header, complete main sections and footer.
- [ ] Run `node scripts/validate.mjs` and confirm structural assertions pass.

### Task 2: Three-mode design system

**Files:**
- Create: `styles.css`
- Modify: `index.html`

**Interfaces:**
- Consumes: semantic classes and section IDs from Task 1.
- Produces: token sets for `studio`, `signal` and `portrait`; responsive component styling; visible focus, hover and active states.

- [ ] Add a validation assertion that `styles.css` defines all three theme selectors and required breakpoints; confirm failure.
- [ ] Implement shared tokens, layout primitives, all section families and three clearly different visual modes.
- [ ] Implement explicit mobile collapse rules at 1100px, 820px and 560px.
- [ ] Run validation and inspect for horizontal-overflow-prone fixed widths.

### Task 3: Interaction and audio behavior

**Files:**
- Create: `script.js`
- Modify: `index.html`
- Modify: `scripts/validate.mjs`

**Interfaces:**
- Consumes: `.theme-button`, `.nav-toggle`, `[data-audio-src]`, `.reveal`.
- Produces: persisted theme selection, exclusive audio playback, navigation disclosure and reduced-motion-aware reveals.

- [ ] Add script-source and control-attribute assertions; confirm failure.
- [ ] Implement theme switching with `aria-pressed`, `localStorage` and a short transition.
- [ ] Implement exclusive demo playback and UI reset on pause, end and error.
- [ ] Implement mobile navigation and IntersectionObserver reveals with cleanup-free page-lifetime listeners.
- [ ] Run validation and exercise controls in a browser.

### Task 4: Assets, provenance and visual verification

**Files:**
- Create: `assets/hero-studio.png`
- Create: `assets/hero-studio.png.json`
- Create: `.impeccable/review/desktop.png`
- Create: `.impeccable/review/mobile.png`

**Interfaces:**
- Produces: local hero visual and review evidence used by the finish pass.

- [ ] Generate and inspect a subject-specific studio microphone photograph without embedded text.
- [ ] Save it locally with its exact generation prompt.
- [ ] Serve the page locally and capture full-page desktop 1440px and mobile 390px screenshots.
- [ ] Inspect both captures once, batch-fix material layout or readability defects, then capture one confirmation round.
- [ ] Run `node .agents/skills/impeccable/scripts/detect.mjs --json index.html styles.css script.js` once and fix mechanical failures.
- [ ] Run `node scripts/validate.mjs` and report the final result.
