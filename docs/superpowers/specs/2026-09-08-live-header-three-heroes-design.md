# Live Header and Three Hero Variants

## Status

Approved in chat on 2026-09-08.

## Goal

Reproduce the current kupigolos.ru header visually and in frontend behavior, restore the narrow left section rail, and show three full-size homepage hero concepts one after another before the existing voices section.

## Design Read

This is a preservation-oriented redesign for a broad studio audience. Keep the Kupigolos coral accent, navy typography, original hero copy, and light neutral page. The visual language is contemporary editorial/product design without Atomic Heart references.

Design dials: variance 7, motion 3, density 4.

## Header

- Match the live kupigolos.ru desktop header as closely as practical in static HTML, CSS, and JavaScript.
- Copy only frontend appearance and interaction. Do not add backend submission logic.
- Use the coral full-width bar, white logo treatment, centered navigation, active light AI-service capsule, and right-side action icons.
- Keep the live navigation labels: «Услуги», «Дикторы», «ИИ сервисы», «Инфопортал», «Статьи».
- «Услуги», «Дикторы», and «Инфопортал» expose full-width mega menus with the real public links and grouped information found on the live site.
- Menus open on click, close on outside click and Escape, preserve focus behavior, and remain keyboard accessible.
- The callback action may open a visual-only drawer or panel. It must not submit data to a backend.
- On mobile, use a compact menu button and accessible grouped navigation.
- Header height must remain within 80 px on desktop and navigation must stay on one line.

## Left Section Rail

- Restore the compact narrow rail presentation used before the expandable experiment.
- The rail must never expand or reveal all section names at once.
- Keep the waveform markers, current active state, progress meter, `REC` identity, and section counter.
- Individual hover/focus feedback may reveal only the current target label as it did before; no persistent expanded drawer or complete list.
- Hide the rail on narrow screens.

## Hero Comparison

- Render three complete hero sections sequentially with no labels such as «Вариант 1».
- Each hero occupies at least the available initial viewport below the header on desktop.
- The first hero owns the page's only H1. The other two use H2 elements styled as hero titles.
- Preserve the original copy in every hero:
  - Kicker: «Профессиональная»
  - Title: «Студия озвучивания в Москве»
  - Lead: «Подготовим профессиональную озвучку диктором на любом языке мира за один день. Работаем на оборудовании мировых брендов.»
  - CTA: «Выбрать диктора» linking to `#voices`
- Do not add proof statistics, rewritten marketing copy, option labels, or blur controls.

### Hero A: Studio Object

- Left-aligned copy and CTA.
- Right-side isolated microphone/studio object using `assets/hero-studio.jpg`.
- Soft neutral surface, controlled image opacity, and a quiet edge mask.

### Hero B: Recording Session

- Left-aligned copy and CTA.
- Right-side informative recording-session visual using `assets/hero-console.jpg`.
- Present the real image as a restrained photographic panel, not a div-built fake interface.

### Hero C: Behind the Glass

- Left-aligned copy and CTA.
- Right-side nearly transparent studio atmosphere using `assets/hero-script.jpg` or the strongest compatible existing local asset.
- Use a soft mask and preserve text contrast.

## Voices Placement

- Keep one existing `#voices` section after all three hero sections.
- No voices heading or voice-card content may appear in the first hero viewport.
- Preserve existing voice cards, names, portraits, links, audio URLs, roles, and prices.

## Constraints

- Keep all non-hero page content and section IDs unchanged.
- Use one light theme and one coral accent across the page.
- Do not add dependencies or remote UI libraries.
- Preserve reduced-motion behavior, focus visibility, skip-link behavior, audio, calculator, AI picker, and later interactions.
- Avoid horizontal overflow at 1440x900, 1024x768, and 390x844.

## Acceptance

- Exactly three full hero sections and exactly one H1.
- No variant labels and no blur slider.
- Voices start only after hero three.
- Header visually follows the live site and all requested frontend menu states work.
- Left rail remains narrow and never expands.
- Validation, JavaScript syntax checks, and motion scheduler tests pass.

