# @aegis/platform-registry

**Purpose** — The Manifest type and the Registry that aggregates Manifests into the source of truth for what exists and who may see it. Drives search, visibility, and routing; does **not** dictate nav structure (that is curated — see platform-lifecycle).

**Public surface** — `FunctionManifest`, `createRegistry`, `Registry` (`all`, `byRoute`, `visibleTo`).

**Dependencies** — `@aegis/models`; React (peer, for component types).

**Tests** — `registry.test.ts` (visibility).

**Status** — live.
