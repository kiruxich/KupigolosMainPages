# AI Signal Desk Implementation Plan

> **For Codex:** REQUIRED SUB-SKILL: Use `executing-plans` to implement this plan task by task.

**Goal:** Replace the homepage AI card grid with a data-informed interactive signal desk.

**Architecture:** Convert the isolated `AiServices` component into a Client Component with local tab state and static service configuration. Keep the surrounding homepage as Server Components. Add section-scoped styles to the existing refresh stylesheet and preserve every AI destination route.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, global CSS.

**Verification constraint:** Do not run tests, lint, typecheck, builds, browser checks, screenshots, or HTTP requests in this task. The repository requires separate explicit user authorization for verification.

---

### Task 1: Build the interactive section

**Files:**
- Modify: `components/home/ai-services.tsx`

1. Replace parsed generated markup with a local Client Component.
2. Define the four metric-informed task modes and their preserved routes.
3. Render accessible tabs, one changing signal stage, and compact secondary destinations.
4. Keep `id="ai-services"` and the existing hub destination.

### Task 2: Create the visual system

**Files:**
- Modify: `styles/refresh.css`

1. Add section-scoped signal-desk layout and typography.
2. Style the task selector, dark production stage, signal graph, output action, and status row.
3. Add tablet and mobile layouts.
4. Add focus-visible and reduced-motion behavior.

### Task 3: Document and commit

**Files:**
- Add: `docs/superpowers/specs/2026-09-10-ai-signal-desk-design.md`
- Add: `docs/superpowers/plans/2026-09-10-ai-signal-desk.md`

1. Review only the targeted diff for accidental unrelated edits.
2. Stage only the AI component, stylesheet, and these two documents.
3. Commit as `feat: redesign AI tools as signal desk`.
