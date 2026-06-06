# Aegis Architecture

The map of the platform. For *language* see [CONTEXT.md](./CONTEXT.md); for *decisions and why* see [docs/adr/](./docs/adr); for *how to build* see [CONVENTIONS.md](./CONVENTIONS.md); for *the plan* see [docs/PHASES.md](./docs/PHASES.md).

## North-star

The platform exists to prove that a **Citizen Developer** (a proficient scripter / non-developer) can build a feature — up to a full, production-grade **Prototype** application — by working with an LLM that follows this documentation, and hand it to the dev team as a pull request they are happy to accept. Developers then take Prototypes **Live** through a stricter SDLC (polish, verify data connections). Every architectural choice serves making that handoff safe. Reviewed post-V2.

## The shape

**Applications are compositions of Functions** ([ADR 0001](./docs/adr/0001-functions-composed-at-build-time.md)):

- A **Function** is a self-contained, reusable capability with its own UI, state, and data access (universe builder, rebalancer, order blotter). It knows nothing about which Application it is mounted in.
- An **Application** (PMS, OMS) is a curated composition of Functions plus app-level layout and navigation. It adds little logic of its own.
- A single **host shell** (`apps/platform`) owns the chrome — global search, navigation, workspace switcher, actions inbox, persona — and mounts Applications. Composition is build-time; there are no micro-frontends. A second host (a slim Client Portal) is plausible later, not in V1.

## Package taxonomy

Every package is named `@aegis/<kind>-<name>` so each import announces its layer.

```
/
├── apps/
│   └── platform/                  # @aegis host shell (chrome + mounts Applications) — the only V1 deployable
├── packages/
│   ├── core/                      # @aegis/core-*      logger, config, errors, low-level utils
│   ├── models/                    # @aegis/models      shared primitives/value-objects + the Entity base shape
│   ├── platform-*/                # @aegis/platform-*  registry, context-bus, search, actions, nav, ui (shadcn)
│   ├── sdk-*/                     # @aegis/sdk-*       one per Entity domain (portfolios, instruments, clients, orders…)
│   ├── functions/<name>/          # @aegis/function-*  reusable capabilities
│   └── applications/<name>/       # @aegis/app-*       compositions of Functions (PMS, OMS…)
└── docs/adr/ · CONTEXT.md · ARCHITECTURE.md · CONVENTIONS.md · CLAUDE.md · docs/PHASES.md
```

`@aegis/platform-ui` is the **single** shared UI package — it owns shadcn/ui and the Tailwind v4 preset; the shell and every Function consume it. There is exactly one shadcn install and one Tailwind setup ([ADR 0003](./docs/adr/0003-locked-stack-version-matrix.md)).

## Layering & dependency rules

Dependencies point **downward only**:

```
app  →  application  →  function  →  { sdk, platform, models, core }
                              sdk  →  { models, core }
```

- **Functions never import other Functions** — they coordinate only through the Context Bus.
- **Live units never depend on a Prototype.** Prototypes may depend on Live units (read-only reuse).
- Enforced mechanically (lint/boundary rules) — but kept light early to avoid Turborepo/ESLint enforcement loops.

## How the cross-cutting features connect

- **Data** — Functions read data only through domain **SDKs** (typed, Zod-validated, TanStack Query hooks). The SDK interface is the source of truth; V1 backs it with in-memory mocks; a future backend conforms via OpenAPI codegen with no mapping layer ([ADR 0002](./docs/adr/0002-sdk-types-are-the-source-of-truth.md)).
- **Context** — Functions emit and react to **Context** on the shared **Context Bus** (Zustand in-app; Zod-validated URL search params cross-Application and for shareable links). FDC3-inspired: strict core fields + open namespaced extensions.
- **Workspace** — a named, switchable snapshot of the platform context (persona + Context + open Functions). One active per user; a shared link is a shared Workspace.
- **Identity & visibility** — a **User** holds Roles; the active **Persona** is the current Role; visibility is a flat, static Role → resource map (small company, no policy engine). External access is the `client-portal` Role.
- **Discovery** — each Function/Application exports a typed **Manifest**; the **Registry** aggregates them and drives Global Search, Role visibility, and routing. The **Navigation Taxonomy** is curated separately to read as the Investment Lifecycle (front-to-back office).
- **Search** — **Global Search** federates **Search Providers** (Registry for Apps/Functions, one per SDK for Entities), filtered by Role and ranked by Context, with a routing/ranking layer for relevance.
- **Actions** — assigned, status-tracked, Context-carrying deep-links into a target Function. The platform renders/resolves Actions; it is not a workflow engine.

## State management split

- **TanStack Query** owns server/SDK state (fetching, caching, invalidation).
- **Zustand** owns client state: the Context Bus, Workspace, persona, and UI state.
- **Zod** validates all SDK I/O, Context payloads, and shareable URL state.

## V1 / V2

V1 builds the platform and all cross-cutting features, made real with a minimal but genuine set of Functions/SDKs/Entities. The rich mocked PMS/OMS workflows are V2. See [docs/PHASES.md](./docs/PHASES.md).
