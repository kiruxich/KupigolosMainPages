# Next.js and TypeScript Migration Specification

## Goal

Migrate the current Vercel-hosted static project to Next.js App Router, React, strict TypeScript, Tailwind CSS v4 and pnpm without changing the rendered design or user-visible behavior.

## Required routes

- `/` keeps the four-card project index and editable, locally persisted statuses.
- `/home` keeps the complete Kupigolos home page.
- `/six-pages` keeps the current empty placeholder page.
- `/files/afisha-suppliers.docx` keeps serving the supplier document.
- The `Озвучка` card keeps opening `https://kupigolos-ozvychka-g84p.vercel.app`.

## Visual contract

- Existing typography, colors, spacing, breakpoints, images, card geometry, overlays, carousels and responsive behavior are immutable.
- Capture reference screenshots before migration at 1440x900 and 390x844.
- Migrated pages must pass image comparison against those references with no unexplained pixel differences.
- Existing CSS remains as an imported compatibility layer during the framework migration. Tailwind v4 is installed and becomes the styling entry point. Rewriting the legacy cascade into utilities is a separate visual-regression project.

## Technical contract

- Use the Next.js App Router and React Server Components by default.
- Use Client Components only for status editing and homepage interaction controllers.
- Use strict TypeScript without `any` or `@ts-nocheck` in migrated runtime code.
- Use pnpm and commit `pnpm-lock.yaml`.
- Preserve SEO metadata, structured data, canonical URLs and all existing links.
- Preserve the current disabled Figma alternatives for the voices and services sections in source-controlled components rather than HTML comments.
- `pnpm test`, `pnpm typecheck`, `pnpm lint` and `pnpm build` must pass before completion.

## Deployment contract

- Vercel builds the project with `pnpm build`.
- Public assets and the DOCX file are served from `public/` with stable paths.
- No dependency on files outside this repository is allowed at build or runtime.
