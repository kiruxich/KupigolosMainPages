# Compact AI Track List Implementation Plan

> **For Codex:** REQUIRED SUB-SKILL: Use `executing-plans` to implement this plan task by task.

**Goal:** Replace the homepage AI card grid and oversized console with a compact data-informed track list.

**Architecture:** Keep `AiServices` as a static Server Component with four semantic service rows. Use a CSS Module for the section and the existing global `studio-cta` component for the primary voice action. Preserve every AI destination route without adding client-side state.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, global CSS.

**Verification constraint:** Do not run tests, lint, typecheck, builds, browser checks, screenshots, or HTTP requests in this task. The repository requires separate explicit user authorization for verification.

---

### Task 1: Build the compact section

**Files:**
- Modify: `components/home/ai-services.tsx`

1. Replace the interactive console with a static Server Component.
2. Define four metric-informed rows and their preserved routes.
3. Render direct links, compact secondary destinations, and the existing site CTA.
4. Keep `id="ai-services"` and the existing hub destination.

### Task 2: Create the visual system

**Files:**
- Add: `components/home/ai-services.module.css`
- Modify: `styles/refresh.css`

1. Remove the obsolete signal-desk styles.
2. Add a section-scoped light track-list layout and typography.
3. Style the highlighted Voice row, compact audio cues, direct links, and existing site button.
4. Add tablet, mobile, and focus-visible behavior.

### Task 3: Document and commit

**Files:**
- Add: `docs/superpowers/specs/2026-09-10-ai-signal-desk-design.md`
- Add: `docs/superpowers/plans/2026-09-10-ai-signal-desk.md`

1. Review only the targeted diff for accidental unrelated edits.
2. Stage only the AI component, CSS Module, stylesheet cleanup, and these two documents.
3. Commit as `refine: simplify AI tools section`.
