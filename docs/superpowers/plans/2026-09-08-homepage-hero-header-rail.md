# Homepage Hero, Header, and Rail Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build one compact product-style first screen, a live-site-inspired functional header, and an expandable section rail without protruding labels.

**Architecture:** Keep the existing static HTML/CSS/JavaScript stack and enhance the current semantic page in place. Replace only the header, hero experiment, rail presentation, and their controllers; preserve the approved Figma voice shelf and all later page sections.

**Tech Stack:** Semantic HTML5, vanilla CSS, vanilla JavaScript, Node.js validation scripts, existing browser-based responsive checks.

**Spec:** `docs/superpowers/specs/2026-09-08-homepage-hero-header-rail-design.md`

## Global Constraints

- Preserve all existing non-hero copy unless the spec defines the replacement string.
- Keep exactly one H1 and exactly one hero section.
- Keep the five approved Figma voice cards, portraits, links, and audio sources unchanged.
- Do not add protruding rail labels, instructional rail copy, a hero blur control, or multiple hero variants.
- Use existing local studio imagery; do not add a new dependency or remote UI library.
- Maintain keyboard focus, Escape handling, reduced-motion support, and 44 px mobile touch targets.
- Do not push changes unless the user explicitly asks.

---

## File Responsibilities

- `index.html`: semantic header menus/drawers, the section-rail links, the single hero, and the existing speaker shelf.
- `refresh.css`: final visual system for header, mega menus, callback drawer, expandable rail, hero, and first-viewport voice transition.
- `script.js`: shared overlay/menu state, pointer and keyboard behavior, body scroll locking, and existing rail synchronization.
- `scripts/validate.mjs`: static regression contract for the approved structure and interaction hooks.

### Task 1: Lock the approved structure into validation

**Files:**
- Modify: `scripts/validate.mjs:35-180`
- Test: `scripts/validate.mjs`

**Interfaces:**
- Consumes: HTML/CSS/JS source strings already loaded by the validator.
- Produces: assertions for `data-header-trigger`, `data-header-panel`, `data-callback-drawer`, `.hero-product`, `.hero-proof`, `.hero-studio-visual`, and the existing rail/voice hooks.

- [ ] **Step 1: Replace the temporary hero assertions with the approved contract**

Use these structural expectations in the validator:

```js
check((html.match(/class="hero-product"/g) || []).length === 1, 'html: expected one product hero');
check(!/data-hero-option|hero-option-backdrop|data-hero-blur-input/.test(html), 'html: obsolete hero comparison controls remain');
check((html.match(/class="hero-proof"/g) || []).length === 3, 'html: expected three hero proof items');
check(/class="hero-studio-visual"/.test(html), 'html: informative studio visual is missing');
check(/href="#voices"[\s\S]*Выбрать диктора/.test(html), 'html: primary hero action is missing');
check(/href="#calculator"[\s\S]*Рассчитать стоимость/.test(html), 'html: secondary hero action is missing');
check((html.match(/data-header-trigger=/g) || []).length === 3, 'html: expected three desktop mega-menu triggers');
check((html.match(/data-header-panel=/g) || []).length === 3, 'html: expected three desktop mega menus');
check(/data-callback-drawer/.test(html), 'html: callback drawer is missing');
check(/data-mobile-menu/.test(html), 'html: mobile navigation drawer is missing');
check(/\.studio-rail:is\(:hover, :focus-within\)/.test(refresh), 'refresh: expandable rail state is missing');
check(/function openHeaderPanel\(/.test(js) && /function closeHeaderPanels\(/.test(js), 'js: header panel controller is missing');
check(!/updateHeroBackgroundBlur|--hero-blur-fill/.test(js), 'js: obsolete hero blur controller remains');
```

- [ ] **Step 2: Remove assertions that require five hero assets, five CTAs, option classes, or the blur slider**

Delete checks for `hero-option-director`, `hero-option-night`, five `hero-option-backdrop` nodes, five `data-hero-option` nodes, `hero-blur-control`, `updateHeroBackgroundBlur`, and `--hero-background-blur`.

- [ ] **Step 3: Run validation and verify the new contract fails against the old markup**

Run: `node scripts/validate.mjs`

Expected: non-zero exit with failures including `expected one product hero`, `desktop mega-menu triggers`, and `obsolete hero comparison controls remain`.

- [ ] **Step 4: Check validator syntax**

Run: `node --check scripts/validate.mjs`

Expected: exit 0 with no output.

### Task 2: Replace the header and five hero variants with approved semantic markup

**Files:**
- Modify: `index.html:47-213`
- Test: `scripts/validate.mjs`

**Interfaces:**
- Consumes: existing section IDs, public Kupigolos URLs, phone number, and local `assets/hero-studio.jpg`.
- Produces: three header triggers/panels, mobile menu, callback drawer, and one `.hero-product` section feeding existing anchors and controllers.

- [ ] **Step 1: Update the script cache key and preserve the existing rail links**

Change the script reference to `script.js?v=header-hero-rail-1`. Keep all 13 `data-rail-target` anchors and their current text; add no extra rail instruction or protruding tab markup.

- [ ] **Step 2: Replace the desktop header markup**

Create a compact `.site-header-inner` containing the existing logo, three buttons with `data-header-trigger="services|voices|info"`, direct links to `#ai-services` and the public articles page, the phone link, an icon-only favorites link with an accessible label, a `data-callback-open` button, and the mobile `.nav-toggle`.

Each trigger must include `aria-expanded="false"` and `aria-controls="header-panel-services|voices|info"`. Each corresponding `data-header-panel` uses the same key, starts hidden, and contains real links:

```html
<button type="button" data-header-trigger="services" aria-expanded="false" aria-controls="header-panel-services">Услуги</button>
<section id="header-panel-services" class="header-mega" data-header-panel="services" aria-hidden="true">
  <a href="https://kupigolos.ru/uslugi/ozvuchka-video">Озвучка видео</a>
  <a href="https://kupigolos.ru/uslugi/audio-reklama">Аудиореклама</a>
  <a href="https://kupigolos.ru/uslugi/ivr">IVR и голосовые меню</a>
  <a href="https://kupigolos.ru/uslugi/perevod">Перевод и локализация</a>
</section>
```

The voices and info panels follow the same contract with real speaker-category and information links already used elsewhere on the page.

- [ ] **Step 3: Add the callback and mobile drawers**

Add one shared backdrop, a right-side `data-callback-drawer` with `aria-hidden="true"`, close button, direct phone link, short callback copy, and a link to `#contacts`. Add a separate `data-mobile-menu` drawer whose primary groups use native `<details>`/`<summary>` accordions and repeat the page-section destinations.

- [ ] **Step 4: Replace all five hero sections with one product hero**

Use this semantic structure and exact copy:

```html
<section class="top-stage hero-product" id="start" aria-labelledby="hero-title">
  <div class="shell hero-product-grid">
    <div class="hero-product-copy">
      <p class="top-kicker">Профессиональная</p>
      <h1 id="hero-title">Студия озвучивания<br>в Москве</h1>
      <p class="hero-product-lead">Подготовим профессиональную озвучку диктором на любом языке мира за один день. Работаем на оборудовании мировых брендов.</p>
      <div class="hero-proofs" aria-label="Ключевые преимущества">
        <div class="hero-proof"><strong>800+</strong><span>голосов</span></div>
        <div class="hero-proof"><strong>60</strong><span>языков</span></div>
        <div class="hero-proof"><strong>1 день</strong><span>на озвучку</span></div>
      </div>
      <div class="hero-actions">
        <a class="hero-cta" href="#voices">Выбрать диктора <span aria-hidden="true">→</span></a>
        <a class="hero-secondary" href="#calculator">Рассчитать стоимость <span aria-hidden="true">↗</span></a>
      </div>
    </div>
    <figure class="hero-studio-visual">
      <img src="assets/hero-studio.jpg" alt="Студийный микрофон для профессиональной записи голоса">
      <figcaption><strong>Запись в студии</strong><span>Москва · удалённое подключение</span></figcaption>
    </figure>
  </div>
</section>
```

- [ ] **Step 5: Confirm the existing voice shelf remains unchanged**

Run: `git diff -- index.html` and verify that the five `.figma-voice-card` articles under `#voices` retain the same names, audio URLs, profile URLs, and prices.

- [ ] **Step 6: Run validation to expose only missing behavior/styles**

Run: `node scripts/validate.mjs`

Expected: hero/header markup assertions pass; failures remain for the new CSS and JavaScript hooks.

### Task 3: Implement unified header drawers and preserve rail behavior

**Files:**
- Modify: `script.js:1-82`
- Modify: `script.js:146-184`
- Test: `scripts/validate.mjs`

**Interfaces:**
- Consumes: `[data-header-trigger]`, `[data-header-panel]`, `[data-callback-open]`, `[data-callback-drawer]`, `[data-mobile-menu]`, overlay close controls, and existing `[data-rail-target]` links.
- Produces: `openHeaderPanel(panelName)`, `closeHeaderPanels({ restoreFocus })`, `setDrawer(drawer, isOpen, trigger)`, and synchronized ARIA/body-lock states.

- [ ] **Step 1: Remove the hero blur controller**

Delete the `heroBlurControl`, `heroBlurInput`, `heroBlurOutput`, `updateHeroBackgroundBlur`, and hero-option visibility observer block. Leave reveal, audio, AI, portfolio, calculator, and motion code untouched.

- [ ] **Step 2: Replace the current single-menu controller with a shared header panel controller**

Implement these exact public functions and state rules:

```js
const headerTriggers = [...document.querySelectorAll('[data-header-trigger]')];
const headerPanels = [...document.querySelectorAll('[data-header-panel]')];
let activeHeaderTrigger = null;

function closeHeaderPanels({ restoreFocus = false } = {}) {
  headerTriggers.forEach((trigger) => trigger.setAttribute('aria-expanded', 'false'));
  headerPanels.forEach((panel) => {
    panel.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
  });
  if (restoreFocus) activeHeaderTrigger?.focus();
  activeHeaderTrigger = null;
}

function openHeaderPanel(panelName) {
  const trigger = headerTriggers.find((item) => item.dataset.headerTrigger === panelName);
  const panel = headerPanels.find((item) => item.dataset.headerPanel === panelName);
  closeHeaderPanels();
  if (!trigger || !panel) return;
  activeHeaderTrigger = trigger;
  trigger.setAttribute('aria-expanded', 'true');
  panel.classList.add('is-open');
  panel.setAttribute('aria-hidden', 'false');
}
```

Bind click toggling, pointer hover preview only through `matchMedia('(hover: hover) and (pointer: fine)')`, outside-click close, link-selection close, and Escape with focus restoration.

- [ ] **Step 3: Add one drawer controller for callback and mobile navigation**

`setDrawer(drawer, true, trigger)` closes mega menus and other drawers, sets `aria-hidden="false"`, marks the matching trigger expanded, shows the shared backdrop, adds `overlay-open` to the body, and focuses the drawer close button. Closing reverses those states and restores focus to the opener when requested.

- [ ] **Step 4: Preserve and improve the section rail contract**

Keep `setStudioRailSection(sectionId)` and the IntersectionObserver. Add smooth navigation without changing URLs:

```js
studioRailLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.getElementById(link.dataset.railTarget);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
    history.replaceState(null, '', `#${target.id}`);
    setStudioRailSection(target.id);
  });
});
```

- [ ] **Step 5: Run syntax and static checks**

Run: `node --check script.js && node scripts/validate.mjs`

Expected: JavaScript syntax exits 0; validation may still report CSS selector failures until Task 4.

### Task 4: Build the approved visual system and responsive states

**Files:**
- Modify: `refresh.css:88-390`
- Modify: `refresh.css:1020-1180`
- Test: `scripts/validate.mjs`

**Interfaces:**
- Consumes: the markup and state classes from Tasks 2–3.
- Produces: compact sticky header, overlay mega menus/drawers, hover/focus-expanded rail, two-column product hero, and early `#voices` transition.

- [ ] **Step 1: Replace the floating header with the live-site-inspired bar**

Use a 72 px sticky bar with a warm-coral translucent surface, one bottom rule, no outer capsule radius, and an inner shell. Give desktop trigger buttons visible hover/focus/expanded states and show `.header-mega.is-open` directly beneath the bar. Keep all animation to opacity and transform.

- [ ] **Step 2: Style mega menus and right-side drawers**

Mega menus use a readable multi-column grid, warm-white surface, restrained navy/coral hierarchy, and links with at least 44 px interactive height. Drawers enter from the right using `transform: translateX(100%)` to `translateX(0)`; the shared backdrop fades with opacity. Apply one z-index scale for rail, sticky header, mega menus, backdrop, and drawers.

- [ ] **Step 3: Make the rail expand internally**

Keep an 86 px collapsed width and expand to approximately 224 px using this state contract:

```css
.studio-rail { width: 86px; transition: width .26s cubic-bezier(.2, .8, .2, 1), background-color .2s ease; }
.studio-rail:is(:hover, :focus-within) { width: 224px; }
.studio-rail-track nav a span { opacity: 0; transform: translateX(-8px); pointer-events: none; }
.studio-rail:is(:hover, :focus-within) .studio-rail-track nav a span { opacity: 1; transform: translateX(0); }
```

Expand over content, never change the main content margin, and keep labels within the rail surface. Style whole rows for pointer/focus/active states and retain `aria-current` visibility.

- [ ] **Step 4: Replace all hero-option styling with the product hero**

Create a compact min-height around `clamp(560px, 70vh, 680px)`, a `minmax(0, 1.08fr) minmax(360px, .92fr)` grid, a controlled H1 scale around `clamp(3.2rem, 5.6vw, 6.4rem)`, three aligned proof blocks, primary and secondary actions, and a right visual with CSS masking/fades. Do not use the image as a section background.

- [ ] **Step 5: Pull the approved voices panel into the first-view transition**

Reduce top padding on `.talent-stage-figma`, apply a small negative top margin or translated overlap that does not cover hero controls, and keep the panel above the hero surface with a restrained shadow. At 1440×900, the «Дикторы» heading and top portion of the cards must be visible.

- [ ] **Step 6: Add mobile and reduced-motion states**

At `max-width: 820px`, hide the rail, collapse the hero to one column, keep the image after the copy, switch to the mobile drawer, and prevent horizontal overflow. At `max-width: 560px`, stack proof items and actions only when needed, keep all controls at least 44 px, and avoid an orphaned heading line. Under `prefers-reduced-motion`, remove transitions while preserving open/closed states.

- [ ] **Step 7: Run the complete static and unit test suite**

Run: `node scripts/validate.mjs && node --test scripts/motion-scheduler.test.mjs`

Expected: validation passes and all motion-scheduler tests pass with zero failures.

### Task 5: Browser verification and final review

**Files:**
- Verify: `index.html`
- Verify: `refresh.css`
- Verify: `script.js`
- Verify: `scripts/validate.mjs`

**Interfaces:**
- Consumes: the completed static page served locally.
- Produces: visual and interaction evidence at desktop and mobile sizes.

- [ ] **Step 1: Start the local server**

Run: `python3 -m http.server 4173 --bind 127.0.0.1`

Expected: the homepage is available at `http://127.0.0.1:4173/`.

- [ ] **Step 2: Verify the desktop viewport at 1440×900**

Confirm one compact header, one hero, no blur control, no variant labels, a visible right-side studio object, three proof items, and the «Дикторы» heading plus the start of the card shelf within the first viewport. Confirm no horizontal overflow.

- [ ] **Step 3: Exercise desktop interactions**

Open each mega menu, close it through outside click and Escape, open/close the callback drawer, hover and keyboard-focus the rail to reveal internal labels, navigate to at least two sections, and play/stop one voice demo.

- [ ] **Step 4: Verify the mobile viewport at 390×844**

Confirm the rail is hidden, header controls remain reachable, the mobile menu accordions work, drawers do not allow background scrolling, the hero stacks cleanly, and the Figma voice shelf does not overflow the page.

- [ ] **Step 5: Run fresh completion checks and inspect the diff**

Run: `node scripts/validate.mjs && node --test scripts/motion-scheduler.test.mjs && git diff --check && git status --short`

Expected: both test commands exit 0, `git diff --check` emits no errors, and status lists only the intended implementation files plus the plan document.
