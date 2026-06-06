# Aegis Build Phases

The V1 build proceeds as **tracer bullets**: every phase is a vertical slice through all layers that ends in something a human can click and test — no pure-background phases. Each phase is committed to git (branch + PR). Unit tests grow from Phase 0; e2e lands in Phase 7.

See also: [CONTEXT.md](../CONTEXT.md) (glossary), [docs/adr/](./adr) (decisions). Phase 0 uses the locked stack from [ADR 0003](./adr/0003-locked-stack-version-matrix.md).

## V1 / V2 boundary

- **V1** = the platform and *all* its cross-cutting features, proven end-to-end with just enough representative Functions / SDKs / Entities to exercise them.
- **V2** = the rich mocked **PMS / OMS** workflows (universe building, weight-based rebalancing, order flow PMS→OMS→execution, simulated compliance/suitability/mandate checks). A separate session.

V1 is therefore neither empty scaffolding nor full applications — it is every platform capability made real with a minimal but genuine feature set.

## Phases

### Phase 0 — Spine
The thinnest end-to-end thread through every layer, proving the toolchain coheres (the riskiest part — see ADR 0003).
- Turborepo + pnpm scaffold; locked version matrix; `apps/platform` host shell renders.
- Single shared `@aegis/platform-ui` (shadcn + Tailwind v4 preset) consumed by the shell.
- One trivial Function mounted via its Manifest through the Registry; one domain SDK (e.g. `@aegis/sdk-portfolios`) returning in-memory mock data via a TanStack Query hook.
- **First task: research + prove the shadcn / Tailwind v4 / Turborepo integration** (verify cross-package content detection visually). Keep dependency-rule enforcement light — avoid Turborepo/ESLint enforcement loops.
- **Testable:** open the app → see a nav item → click → mocked Portfolio data on screen.

### Phase 1 — Identity & visibility
- Mock User + Persona switcher; flat Role set; static Role → visibility map.
- **Testable:** switch Persona → nav items / Functions appear and disappear by Role.

### Phase 2 — Global Search
- Federated Search Providers: Registry provider (Apps/Functions) + 1–2 SDK providers (Entities).
- Aggregation with Role-visibility filtering, grouping, and the routing/ranking layer (intent-aware, not a generic concatenation).
- **Testable:** type a query → grouped, relevant, role-scoped results.

### Phase 3 — Context Bus
- Shared Context (FDC3-inspired strict-core/open-extensions, Zustand in-app); Functions emit and react to Context.
- **Testable:** select a Portfolio in Function A → Function B updates in response.

### Phase 4 — Workspaces & shareable context
- Save / switch Workspace (one active per user); serialize Context to Zod-validated URL search params / links.
- **Testable:** two Workspaces switchable; a shared link restores persona + Context.

### Phase 5 — Actions
- Actions inbox; each Action deep-links into its target Function with Context pre-loaded; status tracking. (Platform renders/resolves Actions — not a workflow engine.)
- **Testable:** open an assigned Action → land in the right Function with context loaded.

### Phase 6 — Navigation Taxonomy & Lifecycle Map
- Curated, lifecycle-ordered navigation (front-to-back office, the Investment Lifecycle stages) — distinct from the Registry.
- Dedicated Lifecycle Map page visualizing the end-to-end flow.
- **Testable:** menu reads front-to-back; the map page visualizes the lifecycle.

### Phase 7 — Doc system & guardrails
- Co-located templated package READMEs; root `ARCHITECTURE.md` and `CONVENTIONS.md`; `CLAUDE.md` pointing at the index.
- Machine-enforced dependency rules (layering; Live never depends on Prototype; Functions never import each other).
- `/citizen-dev-*` skills (commit / create-PR) enforcing the Extension vs Notable Change guardrail.
- Unit tests throughout (Vitest); **e2e (Playwright) lands here**.
- **Testable:** a Citizen Developer follows the docs to extend a Function and open a clean PR; e2e suite passes.

## Post-V2 review

Validate the [north-star](../CONTEXT.md): a Citizen Developer can deliver a production-grade Prototype application to a PR the dev team accepts, purely by following the docs/skills — developers then take it Live through a stricter SDLC.
