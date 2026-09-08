# Homepage Hero, Header, and Rail Redesign

## Status

Approved in chat on 2026-09-08. The user selected the first, light product-style hero concept, approved rebuilding the header around the live Kupigolos behavior, and rejected protruding labels on the left navigation rail.

## Goal

Replace the stacked hero experiments with one compact, informative first screen. Make the section rail discoverably interactive without instructional copy, and rebuild the header close to the current live Kupigolos structure and behavior while preserving the existing page content and voice-card implementation.

## Scope

This iteration changes only the global header, left section rail, first screen, and the transition into the existing `#voices` section. The approved Figma-style voice cards remain the source of truth for the speaker catalog. Later sections keep their current text, order, and functionality.

## Visual Direction

The page uses a light, warm-neutral surface with navy typography and the existing restrained coral accent. The first screen should resemble a polished product landing page rather than a full-bleed photographic cover: useful information on the left, a focused studio object on the right, and the voice catalog already entering the viewport below.

The layout must avoid giant display type, decorative background scenes, Atomic Heart references, AI-purple gradients, excessive pills, and empty areas that make the first screen feel unfinished.

## Header

### Desktop composition

- Replace the large floating rounded header with a compact full-width bar approximately 68–76 px high.
- Keep the Kupigolos logo at the left and the main navigation in the center: «Услуги», «Дикторы», «ИИ-сервисы», «Инфопортал», «Статьи».
- Keep the phone number, favorites/action icon, and callback action accessible on the right.
- Use a quiet warm-coral header surface inspired by the live site. The active navigation item may use a small light rounded state, but the entire header must not be a floating capsule.
- Keep the header sticky. On scroll, add a restrained border/shadow rather than changing to a different visual theme.

### Desktop behavior

- «Услуги», «Дикторы», and «Инфопортал» open structured mega menus based on the categories exposed by the live site.
- A mega menu opens on click and may preview on hover for pointer devices. Only one menu can be open at a time.
- Clicking outside, pressing Escape, or choosing a menu link closes it. Keyboard focus remains visible and returns to the trigger after Escape.
- The callback action opens a right-side drawer with the studio phone, callback form/CTA, and close control, matching the live site's interaction pattern.
- The existing direct links and external destinations remain real links; no dead `href="#"` controls are introduced.

### Mobile behavior

- The desktop navigation collapses into one menu button.
- Navigation groups become accessible accordions inside a single slide-over panel.
- The menu and callback drawer lock body scrolling, close on Escape and backdrop click, and expose at least 44 px touch targets.

## Left Section Rail

### Resting state

- Keep a slim audio-meter-inspired rail and its progress/counter identity.
- Do not add protruding labels, tooltip-like tabs, or instructional text such as «нажмите».
- In the collapsed state, section markers remain visibly interactive through consistent button rows, pointer cursor, hover/focus feedback, and a clearly distinct active marker.

### Expanded state

- On hover or keyboard focus within the rail, expand it inward over the page without shifting page content.
- Reveal all section names inside the expanded rail, aligned with their markers. The labels remain part of the rail rather than protruding outside it.
- Make the entire marker-and-label row clickable. Hover shifts the row subtly and increases contrast; the active row uses the coral accent, stronger text, and `aria-current="location"`.
- Keep scroll-position synchronization, smooth anchor navigation, the progress line, and the `01/13` counter.
- Respect `prefers-reduced-motion`; expansion remains functional without animated movement.

### Responsive behavior

- Hide the rail on narrow screens where it would cover content. The header menu provides the same section links on mobile.

## First Screen

### Content and hierarchy

- Remove all five stacked hero variants and the hero blur control.
- Render exactly one `h1`: «Студия озвучивания в Москве».
- Preserve the original supporting copy exactly: «Подготовим профессиональную озвучку диктором на любом языке мира за один день. Работаем на оборудовании мировых брендов.»
- Use a compact responsive heading scale; at a 1440 px viewport it should feel editorial but not dominate the full screen.
- Keep «Выбрать диктора» as the primary action and add «Рассчитать стоимость» as a restrained secondary link to `#calculator`.
- Add three concise proof items using facts already present on the page: «Более 800 голосов», «60 языков», «Озвучка за один день».

### Composition

- Use a two-column desktop grid. The left column contains the kicker, heading, supporting copy, proof items, and actions.
- The right column contains one informative studio visual built from the existing local microphone/studio asset. Present it as a focused object with soft edge masking and restrained opacity around the perimeter, not as a full-width background image.
- Use a neutral pedestal/surface and a subtle shadow so the image feels integrated into the light page rather than pasted into a card.
- Do not place text over the detailed part of the image.

### Voice-section transition

- Position the existing `#voices` section immediately after the compact hero and visually pull its upper edge into the first-screen composition.
- On a typical desktop viewport, the «Дикторы» heading and the beginning of the first voice-card row should already be visible without a full additional screen of scrolling.
- Do not duplicate speaker data inside the hero. The existing Figma-style voice cards remain the single interactive catalog implementation.

## Content Preservation

- Keep all existing non-hero copy unchanged unless a string is explicitly defined in this specification.
- Keep the current five approved voice cards, portraits, role text, real profile links, and audio sources.
- Remove only labels and controls that belong to the discarded hero-variant experiment.

## Accessibility and Interaction Quality

- Preserve the skip link, semantic landmarks, one-page heading hierarchy, meaningful labels, and visible focus styles.
- Every icon-only control has an accessible name.
- Menus and drawers maintain `aria-expanded`/`aria-hidden` states and predictable focus behavior.
- Audio playback, calculator behavior, rail synchronization, and all later-page interactions must continue working.
- Motion uses transform and opacity where possible and is reduced under `prefers-reduced-motion`.

## Validation

- Run the repository validation script and motion scheduler tests.
- Verify at desktop and mobile widths, including approximately 1440×900 and 390×844.
- Confirm there is one H1, one hero, no hero option labels, no blur slider, and no horizontal overflow.
- Exercise header mega menus, callback drawer, mobile accordions, left-rail expansion, section navigation, voice audio, and keyboard Escape behavior.
- Compare the desktop first screen against the approved direction: dense but calm, informative visual on the right, and the speaker catalog entering the first viewport.
