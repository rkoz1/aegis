# Aegis Conventions

How we build, so that any LLM or Citizen Developer extends the platform the same way. Principles first — concrete code examples are added against real packages as they land in [Phase 0](./docs/PHASES.md#phase-0--spine). See [CONTEXT.md](./CONTEXT.md) for terms and [ARCHITECTURE.md](./ARCHITECTURE.md) for the map.

## Naming

- Packages: `@aegis/<kind>-<name>` — `core-*`, `models`, `platform-*`, `sdk-*`, `function-*`, `app-*`. The kind announces the layer.
- One Entity domain per SDK (`@aegis/sdk-portfolios`, `@aegis/sdk-instruments`). The SDK owns and exports its domain types.
- Use canonical glossary terms in code, types, files, and comments. Avoid the synonyms listed under `_Avoid_` in CONTEXT.md.

## Dependency rules (downward only)

```
app  →  application  →  function  →  { sdk, platform, models, core }
                              sdk  →  { models, core }
```

- **Functions never import other Functions.** Coordinate via the Context Bus only.
- **Live never imports a Prototype.** Prototypes may import Live units (read-only reuse).
- Never import upward (a Function must not import an Application or the host shell).
- Enforcement is mechanical but **kept light early** — do not gold-plate boundary rules before there is code to guard; avoid Turborepo/ESLint/TS-paths enforcement loops.

## Adding a Function

1. Create `packages/functions/<name>` as `@aegis/function-<name>`.
2. Export a typed **Manifest** (id, label, category, entity types, required Roles, route, mount). The Manifest is the Function's public identity; its implementation stays private.
3. Read data only through SDK hooks (TanStack Query). Never call HTTP or another Function directly.
4. Read/write shared state only through the Context Bus.
5. Consume UI from `@aegis/platform-ui` (shadcn). Do not install shadcn or Tailwind locally.
6. Add a co-located `README.md` (Purpose · Public surface · Context consumed/emitted · SDK dependencies · Status).
7. Add/extend unit tests (Vitest).

## Adding an SDK

1. Create `packages/sdk-<domain>` as `@aegis/sdk-<domain>`.
2. Define the typed, Zod-validated interface — this is the **source of truth**. No DTO mapping, no anti-corruption layer, no duck typing.
3. Own and export the domain's Entity types; conform them to the shared `Entity` base shape from `@aegis/models`.
4. Back it with an in-memory mock implementation (artificial latency/pagination to feel real). Any future HTTP stays sealed inside the SDK.
5. Expose data via TanStack Query hooks (`usePortfolio(id)`). Register a Search Provider if the domain is searchable.

## State management

- **TanStack Query** for server/SDK state. **Zustand** for Context Bus, Workspace, persona, UI state. **Zod** validates all SDK I/O, Context payloads, and shareable URL state.

## Styling

- One shared UI package (`@aegis/platform-ui`) owns shadcn/ui + the Tailwind v4 preset. Tailwind v4 is CSS-first (`@import "tailwindcss"`, `@theme`).
- Guard against cross-package purging: ensure the consuming app `@source`s `packages/ui` (the #1 Tailwind-v4-in-monorepo failure mode — verify visually).

## Citizen-Developer guardrail

- **Extension** (staying within standards, reusing components) is the default path — proceed.
- A **Notable Change** — a new dependency, a new pattern, or a deviation from a documented standard — must be **flagged to the user in-session and called out explicitly in the PR**. In a Live Application this is a hard flag; in a Prototype it may simply be noted.
- This will be enforced by planned `/citizen-dev-*` skills (commit / create-PR), not yet built.

## Build discipline

- Work in **tracer-bullet phases** ([docs/PHASES.md](./docs/PHASES.md)): every change ends in something a human can click and test. No pure-background phases.
- Each phase is committed to git (branch + PR). Unit tests grow from Phase 0; e2e (Playwright) lands at Phase 7.

## Documentation

- Co-located: every package carries a `README.md` next to its code.
- The root index (CONTEXT / ARCHITECTURE / CONVENTIONS / CLAUDE / ADRs / PHASES) is the thin, always-read layer — keep it accurate.
- Update CONTEXT.md when language changes. Write an ADR only when a decision is hard to reverse **and** surprising **and** the result of a real trade-off.
