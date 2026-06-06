# Locked stack version matrix and shadcn/Tailwind/Turborepo integration

## Status

accepted

## Context

The Phase 0 "spine" must prove the toolchain coheres before any feature work, because shadcn/ui + Tailwind + Turborepo is a notorious source of fragile, time-consuming setup (path aliasing, cross-package content detection, per-package shadcn config). The platform also needs version coherence — "latest very stable, well-documented, known-to-work-together" versions, deliberately **not** bleeding edge — to avoid drift and incompatibility between React, Tailwind, and the rest. Versions were researched against official sources (mid-2026) rather than assumed.

## Decision

### Locked version matrix (use latest stable minor of each major below)

| Tool | Version | Notes |
|---|---|---|
| Node.js | 22 LTS | Engine baseline |
| pnpm | 10.x | Workspace package manager |
| Turborepo | 2.x | Build orchestration |
| TypeScript | 5.8+ | Zod 4 requires ≥5.5 |
| React | 19.x | Stable; shadcn new projects default to it |
| Vite | 7.x | App bundler/dev server |
| Tailwind CSS | 4.x | CSS-first config (`@import "tailwindcss"`, `@theme`) |
| shadcn/ui | latest CLI | Rolling; "new-york" style, full Tailwind v4 + React 19 support |
| TanStack Query | 5.x | Server/SDK state |
| TanStack Router | 1.x | Routing; majors do not align with Query by design |
| Zod | 4.x | 14x faster than v3; `zod/v4` subpath allows incremental migration if a dep still needs v3 |
| Zustand | 5.x | Context/Workspace/UI state |

### Integration approach (single shared UI package)

- Base on shadcn's official monorepo layout: `pnpm dlx shadcn@latest init --monorepo` → one shared `packages/ui` (here `@aegis/platform-ui`) owning shadcn components + the Tailwind preset, consumed by the shell and all Functions.
- Each workspace keeps its own `components.json`; shared aliases are `@workspace/ui/components`, `@workspace/ui/lib/utils`. For Tailwind v4, leave the `tailwind` config field empty.
- Tailwind config is shared via a preset/CSS package (`@theme` tokens) imported by consumers; classes in the UI package may be prefixed to avoid specificity collisions if needed.

## Why

These are the current stable, mutually-proven versions: shadcn/ui ships Tailwind v4 + React 19 as the default for new projects, TanStack Query 5 / Router 1 are actively maintained and React-19-compatible, and Zod 4 / Zustand 5 are stable. A single shared UI package collapses the three fragile seams (shadcn config, Tailwind content globs, TS/bundler aliasing) into one place, which is what keeps the setup maintainable and the citizen-dev handoff safe.

## Consequences / failure modes to guard

- **Tailwind v4 cross-package purging** is the #1 failure mode: classes used in `packages/*` are stripped unless the consuming app's CSS `@source`s the package directory (or the UI package ships precompiled CSS). Verify visually in the Phase 0 spike.
- Keep enforcement light initially (per the steer to avoid Turborepo/ESLint enforcement loops); harden dependency-boundary rules later.
- Zod 4 needs TypeScript ≥5.5; watch for ecosystem libs still pinned to Zod 3 and use the `zod/v4` subpath if needed.

## Key citations

- shadcn/ui Monorepo docs — https://ui.shadcn.com/docs/monorepo
- shadcn/ui Tailwind v4 docs — https://ui.shadcn.com/docs/tailwind-v4
- Turborepo Tailwind CSS guide — https://turborepo.dev/docs/guides/tools/tailwind
- Zod v4 release notes — https://zod.dev/v4
- TanStack Query / Router releases — https://github.com/tanstack/query/releases · https://github.com/TanStack/router/releases
