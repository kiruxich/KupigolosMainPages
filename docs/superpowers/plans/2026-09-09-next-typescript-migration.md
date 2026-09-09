# Next.js and TypeScript Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the current static Vercel site to Next.js, React, strict TypeScript, Tailwind CSS v4 and pnpm while preserving the rendered result and behavior.

**Architecture:** The App Router owns `/`, `/home` and `/six-pages`. Static page composition becomes typed React components; narrowly scoped Client Components own browser state and the existing homepage controllers. Tailwind v4 is the CSS entry point, while the current CSS cascade is imported unchanged as a compatibility layer so the migration has a measurable pixel-parity contract.

**Tech Stack:** Next.js 16, React 19, TypeScript 5, Tailwind CSS 4, pnpm 10, Vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-09-09-next-typescript-migration.md`

## Global Constraints

- Preserve the existing pixels and behavior at 1440x900 and 390x844.
- Preserve `/`, `/home`, `/six-pages`, the supplier DOCX URL and the external Ozvychka URL.
- Keep all current visible copy, SEO metadata, images, links and accessibility attributes.
- Use strict TypeScript without `any` or `@ts-nocheck` in runtime files.
- Keep the legacy CSS cascade intact during this migration; Tailwind is the entry point and styling platform for new React UI.
- Commit after each independently verified task.

---

### Task 1: Capture the visual and DOM baseline

**Files:**
- Create: `tests/visual/baseline.spec.ts`
- Create: `tests/visual/baselines/desktop/`
- Create: `tests/visual/baselines/mobile/`
- Create: `tests/contracts/static-routes.test.mjs`

**Interfaces:**
- Consumes: current `index.html`, `home.html`, `six-pages.html` and static assets.
- Produces: reference screenshots and route/DOM assertions used by every later task.

- [ ] **Step 1: Create a failing route-contract test**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('project index keeps all four destinations', () => {
  const html = readFileSync('index.html', 'utf8');
  for (const href of ['files/afisha-suppliers.docx', 'https://kupigolos-ozvychka-g84p.vercel.app', 'home.html', 'six-pages.html']) {
    assert.match(html, new RegExp(`href="${href.replaceAll('.', '\\\\.')}"`));
  }
});
```

- [ ] **Step 2: Run the contract test and record the passing pre-migration behavior**

Run: `node --test tests/contracts/static-routes.test.mjs`
Expected: PASS against the static source.

- [ ] **Step 3: Capture reference screenshots with Playwright**

```ts
import { test } from '@playwright/test';

for (const viewport of [{ name: 'desktop', width: 1440, height: 900 }, { name: 'mobile', width: 390, height: 844 }]) {
  test(`capture ${viewport.name} references`, async ({ page }) => {
    await page.setViewportSize(viewport);
    for (const route of ['index.html', 'home.html', 'six-pages.html']) {
      await page.goto(`http://127.0.0.1:4173/${route}`);
      await page.screenshot({ path: `tests/visual/baselines/${viewport.name}/${route}.png`, fullPage: true });
    }
  });
}
```

- [ ] **Step 4: Commit the immutable baseline**

Run: `git add tests && git commit -m "test: capture static visual baseline"`

### Task 2: Scaffold Next.js, TypeScript, Tailwind and pnpm

**Files:**
- Create: `package.json`
- Create: `pnpm-lock.yaml`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `postcss.config.mjs`
- Create: `eslint.config.mjs`
- Create: `vitest.config.ts`
- Create: `app/layout.tsx`
- Create: `app/globals.css`
- Test: `tests/contracts/app-router.test.ts`

**Interfaces:**
- Consumes: the baseline from Task 1.
- Produces: a buildable App Router shell and commands `dev`, `build`, `lint`, `typecheck`, `test`, `test:visual`.

- [ ] **Step 1: Write the failing App Router configuration test**

```ts
import { describe, expect, it } from 'vitest';
import packageJson from '../../package.json';

describe('framework contract', () => {
  it('uses Next, React and pnpm commands', () => {
    expect(packageJson.scripts).toMatchObject({ dev: 'next dev', build: 'next build', typecheck: 'tsc --noEmit' });
    expect(packageJson.dependencies).toHaveProperty('next');
    expect(packageJson.dependencies).toHaveProperty('react');
    expect(packageJson.devDependencies).toHaveProperty('tailwindcss');
  });
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `pnpm vitest run tests/contracts/app-router.test.ts`
Expected: FAIL because the package and configuration do not exist.

- [ ] **Step 3: Add the strict framework configuration**

`app/globals.css` begins with:

```css
@import "tailwindcss";
@import "../styles/legacy.css";
```

`tsconfig.json` sets `strict: true`, `noUncheckedIndexedAccess: true`, `jsx: preserve`, `moduleResolution: bundler` and the `@/*` alias.

- [ ] **Step 4: Install with pnpm and generate the lockfile**

Run: `corepack pnpm install`
Expected: `pnpm-lock.yaml` is created without npm or yarn lockfiles.

- [ ] **Step 5: Run the framework contract and build**

Run: `pnpm vitest run tests/contracts/app-router.test.ts && pnpm typecheck && pnpm build`
Expected: PASS and a successful production build.

- [ ] **Step 6: Commit the scaffold**

Run: `git add package.json pnpm-lock.yaml next.config.ts tsconfig.json postcss.config.mjs eslint.config.mjs vitest.config.ts app && git commit -m "build: scaffold Next TypeScript and Tailwind"`

### Task 3: Move public assets without changing their URLs

**Files:**
- Move: `assets/` to `public/assets/`
- Move: `files/afisha-suppliers.docx` to `public/files/afisha-suppliers.docx`
- Move: `styles.css`, `refresh.css`, `voices-refinement.css`, `figma-sections.css`, `founder-refinement.css` to `styles/`
- Test: `tests/contracts/public-assets.test.ts`

**Interfaces:**
- Consumes: all current images, audio metadata, CSS and the DOCX file.
- Produces: stable browser URLs under `/assets/*` and `/files/*`, plus `styles/legacy.css` as the ordered compatibility entry point.

- [ ] **Step 1: Write failing existence and URL tests**

```ts
import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('public asset contract', () => {
  it.each(['public/assets/kupigolos-logo-white.svg', 'public/assets/hero-studio-session-v1.png', 'public/files/afisha-suppliers.docx'])('%s exists', (path) => {
    expect(existsSync(path)).toBe(true);
  });
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `pnpm vitest run tests/contracts/public-assets.test.ts`
Expected: FAIL because files still use the static-project layout.

- [ ] **Step 3: Move assets and preserve CSS cascade order**

```css
@import "./founder-refinement.css";
@import "./styles.css";
@import "./refresh.css";
@import "./voices-refinement.css";
```

Keep `figma-sections.css` available but unimported because that alternative is currently disabled.

- [ ] **Step 4: Run asset tests and build**

Run: `pnpm vitest run tests/contracts/public-assets.test.ts && pnpm build`
Expected: PASS.

- [ ] **Step 5: Commit the asset migration**

Run: `git add public styles app/globals.css && git commit -m "refactor: move static assets into Next public tree"`

### Task 4: Migrate the project index and status persistence

**Files:**
- Create: `app/page.tsx`
- Create: `components/projects/project-card.tsx`
- Create: `components/projects/status-select.tsx`
- Create: `components/projects/project-data.ts`
- Test: `components/projects/status-select.test.tsx`
- Test: `tests/contracts/project-index.test.tsx`

**Interfaces:**
- Produces: `ProjectDefinition`, `ProjectStatus`, `ProjectCard` and `StatusSelect`.
- `ProjectDefinition` is `{ id: string; order: number; title: string; description: string; date: string; href: string; external?: boolean; defaultStatus: ProjectStatus }`.
- `StatusSelect` consumes `{ projectId: string; defaultStatus: ProjectStatus }` and persists to `kupigolos-project-status:${projectId}`.

- [ ] **Step 1: Write failing status persistence tests**

```tsx
it('restores and saves a project status', async () => {
  localStorage.setItem('kupigolos-project-status:homepage', 'deferred');
  render(<StatusSelect projectId="homepage" defaultStatus="completed" />);
  expect(screen.getByRole('combobox')).toHaveValue('deferred');
  await userEvent.selectOptions(screen.getByRole('combobox'), 'in-progress');
  expect(localStorage.getItem('kupigolos-project-status:homepage')).toBe('in-progress');
});
```

- [ ] **Step 2: Run and verify RED**

Run: `pnpm vitest run components/projects/status-select.test.tsx tests/contracts/project-index.test.tsx`
Expected: FAIL because the React components do not exist.

- [ ] **Step 3: Implement typed Server and Client Components**

Use `'use client'` only in `status-select.tsx`. Preserve the current class names so the compatibility CSS renders the same pixels. Render external links with `target="_blank" rel="noopener"` and internal routes with `next/link`.

- [ ] **Step 4: Run component tests and screenshot comparison for `/`**

Run: `pnpm vitest run components/projects/status-select.test.tsx tests/contracts/project-index.test.tsx && pnpm playwright test tests/visual/index.spec.ts`
Expected: PASS with no screenshot difference.

- [ ] **Step 5: Commit the project index**

Run: `git add app/page.tsx components/projects tests && git commit -m "refactor: migrate project index to React"`

### Task 5: Migrate the placeholder route

**Files:**
- Create: `app/six-pages/page.tsx`
- Test: `tests/contracts/six-pages.test.tsx`

**Interfaces:**
- Produces: the `/six-pages` route with the same heading, copy and back navigation.

- [ ] **Step 1: Write the failing route test**

```tsx
it('renders the six pages placeholder', () => {
  render(<SixPagesPage />);
  expect(screen.getByRole('heading', { name: '6 страниц' })).toBeVisible();
  expect(screen.getByRole('link', { name: /К проектам/ })).toHaveAttribute('href', '/');
});
```

- [ ] **Step 2: Run and verify RED**

Run: `pnpm vitest run tests/contracts/six-pages.test.tsx`
Expected: FAIL because the route component does not exist.

- [ ] **Step 3: Implement the Server Component and preserve route-specific styles**

Move the current inline styles to `app/six-pages/six-pages.css` without changing declarations.

- [ ] **Step 4: Verify behavior and pixels**

Run: `pnpm vitest run tests/contracts/six-pages.test.tsx && pnpm playwright test tests/visual/six-pages.spec.ts`
Expected: PASS with no screenshot difference.

- [ ] **Step 5: Commit the placeholder route**

Run: `git add app/six-pages tests && git commit -m "refactor: migrate placeholder route to React"`

### Task 6: Convert the complete homepage document to typed React composition

**Files:**
- Create: `app/home/page.tsx`
- Create: `app/home/home-metadata.ts`
- Create: `components/home/home-page.tsx`
- Create: `components/home/header.tsx`
- Create: `components/home/hero.tsx`
- Create: `components/home/voices.tsx`
- Create: `components/home/ai-services.tsx`
- Create: `components/home/about.tsx`
- Create: `components/home/services.tsx`
- Create: `components/home/portfolio.tsx`
- Create: `components/home/calculator.tsx`
- Create: `components/home/proof-sections.tsx`
- Create: `components/home/contact.tsx`
- Create: `components/home/figma-alternatives.tsx`
- Test: `tests/contracts/home-structure.test.tsx`

**Interfaces:**
- Consumes: the exact active DOM from `home.html` after stripping HTML comments.
- Produces: semantic React components with unchanged element order, IDs, class names, attributes, text and structured data.

- [ ] **Step 1: Write a failing structural parity test**

```tsx
it('preserves required homepage sections in order', () => {
  const html = renderToStaticMarkup(<HomePage />);
  const ids = ['start', 'voices', 'ai-services', 'about', 'services', 'portfolio', 'calculator', 'advantages', 'guarantees', 'process', 'reviews', 'clients', 'contacts'];
  expect(ids.map((id) => html.indexOf(`id="${id}"`))).toEqual([...ids.map((_, index) => index)].map((_, index, all) => expect.any(Number)));
  expect(ids.every((id, index) => index === 0 || html.indexOf(`id="${id}"`) > html.indexOf(`id="${ids[index - 1]}"`))).toBe(true);
});
```

- [ ] **Step 2: Run and verify RED**

Run: `pnpm vitest run tests/contracts/home-structure.test.tsx`
Expected: FAIL because React homepage components do not exist.

- [ ] **Step 3: Convert one semantic section at a time**

Translate HTML attributes mechanically (`class` to `className`, `for` to `htmlFor`, SVG attributes to JSX casing) without changing the DOM hierarchy. Store repeated voice, service and portfolio card data as readonly TypeScript arrays and render with stable keys.

- [ ] **Step 4: Preserve SEO and JSON-LD**

Return the current title, description, canonical, Open Graph fields and JSON-LD from typed Next metadata and a serialized `<script type="application/ld+json">`.

- [ ] **Step 5: Run structural and server-render tests**

Run: `pnpm vitest run tests/contracts/home-structure.test.tsx && pnpm typecheck`
Expected: PASS with no hydration warnings.

- [ ] **Step 6: Commit the React document conversion**

Run: `git add app/home components/home tests && git commit -m "refactor: convert homepage markup to React"`

### Task 7: Convert browser interactions to strict TypeScript

**Files:**
- Create: `components/home/home-runtime.tsx`
- Create: `lib/home/header-controller.ts`
- Create: `lib/home/drawer-controller.ts`
- Create: `lib/home/audio-controller.ts`
- Create: `lib/home/portfolio-controller.ts`
- Create: `lib/home/calculator-controller.ts`
- Create: `lib/home/studio-rail-controller.ts`
- Create: `lib/home/voices-carousel.ts`
- Create: `lib/home/motion-scheduler.ts`
- Create: `lib/home/voice-waveforms.ts`
- Test: `lib/home/*.test.ts`

**Interfaces:**
- Each controller exports `mount(root: ParentNode): () => void`.
- The return value removes every listener, observer, media-query listener and audio resource created by the controller.
- `HomeRuntime` calls the controllers in one `useEffect` and runs all cleanup functions on unmount.

- [ ] **Step 1: Write failing lifecycle tests for each controller**

```ts
it('mounts and removes drawer listeners', () => {
  const removeSpy = vi.spyOn(HTMLElement.prototype, 'removeEventListener');
  const cleanup = mountDrawerController(document);
  cleanup();
  expect(removeSpy).toHaveBeenCalled();
});
```

- [ ] **Step 2: Run and verify RED**

Run: `pnpm vitest run lib/home`
Expected: FAIL because the typed controllers do not exist.

- [ ] **Step 3: Port controllers without changing selectors or behavior**

Use type guards such as `element instanceof HTMLButtonElement` and explicit interfaces for catalogue, waveform and calculator data. Do not use `any`, `@ts-ignore` or `@ts-nocheck`.

- [ ] **Step 4: Run controller, carousel and type tests**

Run: `pnpm vitest run lib/home && pnpm typecheck`
Expected: PASS.

- [ ] **Step 5: Verify interactive flows in Playwright**

Run: `pnpm playwright test tests/e2e/home-interactions.spec.ts`
Expected: keyboard menus, drawers, audio buttons, carousel, tabs, calculator and rail tests all pass.

- [ ] **Step 6: Commit the TypeScript runtime**

Run: `git add components/home/home-runtime.tsx lib/home tests && git commit -m "refactor: migrate homepage interactions to TypeScript"`

### Task 8: Remove legacy entry files and prove pixel parity

**Files:**
- Delete: `index.html`
- Delete: `home.html`
- Delete: `six-pages.html`
- Delete: `script.js`
- Delete: `motion-scheduler.js`
- Delete: `voice-waveforms.js`
- Delete: `voices-carousel.js`
- Delete: `voices-carousel-figma.js`
- Modify: `scripts/validate.mjs`
- Create: `tests/visual/migrated.spec.ts`

**Interfaces:**
- Consumes: all migrated routes and baseline images.
- Produces: a Next-only production source tree with the same rendered pages.

- [ ] **Step 1: Update validation to inspect React source and rendered routes**

Assert one H1 per route, the 13 homepage sections, metadata, accessible controls, 20 voice records, six AI tools, six services and all portfolio panels.

- [ ] **Step 2: Run the complete verification suite**

Run: `pnpm test && pnpm typecheck && pnpm lint && pnpm build`
Expected: all commands exit 0 with no TypeScript, ESLint, hydration or build errors.

- [ ] **Step 3: Run visual regression against both viewports**

Run: `pnpm playwright test tests/visual/migrated.spec.ts`
Expected: `/`, `/home` and `/six-pages` match the stored desktop and mobile baselines with no unexplained pixel differences.

- [ ] **Step 4: Run a production-server smoke test**

Run: `pnpm start` and then `pnpm playwright test tests/e2e/routes.spec.ts`
Expected: all routes and the DOCX respond successfully; the Ozvychka card retains its external URL.

- [ ] **Step 5: Update the knowledge graph**

Run: `graphify . --update --code-only`
Expected: the graph includes App Router components and typed controllers.

- [ ] **Step 6: Commit the completed migration**

Run: `git add -A && git commit -m "refactor: complete Next TypeScript migration"`

## Self-review

- Spec coverage: every required route, asset, interaction, SEO field and visual comparison is assigned to a task.
- Placeholder scan: every implementation and verification step names exact files and commands.
- Type consistency: project status types and controller lifecycle signatures are defined once and consumed consistently.
