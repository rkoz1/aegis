# @aegis/platform-actions

**Purpose** — Actions: assigned, status-tracked, Context-carrying deep-links into a target Function. The platform renders/resolves Actions — it is not a workflow engine.

**Public surface** — `Action`/`ActionSchema`, `MOCK_ACTIONS`, `useActions` (`actions`, `resolve`), `openActionsForRole`.

**Dependencies** — `@aegis/platform-context`, `zod`, `zustand`; React (peer).

**Tests** — `actions.test.ts` (schema, role filter, resolve).

**Status** — live (mock actions).
