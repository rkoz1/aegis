# @aegis/platform-workspace

**Purpose** — Workspaces: named, switchable snapshots of persona + Context, serializable to a shareable URL.

**Public surface** — `Workspace`, `useWorkspaces` (`capture`, `activate`, `remove`), `toSearchParams`/`fromSearchParams` (Zod), `RestorableState`.

**Dependencies** — `@aegis/platform-session`, `@aegis/platform-context`, `zod`, `zustand`; React (peer). The store orchestrates the session + context stores rather than holding a second source of truth.

**Tests** — `workspace.test.ts` (serialize round-trip, capture/activate).

**Status** — live.
