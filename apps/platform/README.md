# @aegis/platform (host shell)

**Purpose** — The single deployable host shell (ADR 0001). Owns the chrome — global search, persona switcher, workspace bar, actions inbox, context chip, lifecycle-grouped nav — and mounts Functions composed from the Registry.

**Key files** — `registry.ts` (composes Functions), `router.tsx` (code-based routes from the Registry), `search.ts` (provider composition), `routes/` (root layout, home, lifecycle map, route guard), and the chrome components.

**Dependencies** — the `@aegis/*` Functions and platform packages; React 19, Vite 7, TanStack Router/Query, Tailwind v4 (ADR 0003).

**Run** — `pnpm --filter @aegis/platform dev`.

**Status** — live.
