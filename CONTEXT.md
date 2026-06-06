# Aegis

Aegis is a wealth-management platform: a monorepo of frontend applications and reusable capabilities, built for rapid LLM-assisted development. It hosts both live applications and throwaway prototypes used to demonstrate potential workflows to stakeholders.

## Language

**Function**:
A self-contained, reusable capability with its own UI, state, and data access (e.g. universe builder, rebalancer). The unit of composition — it knows nothing about which Application it is mounted in.
_Avoid_: Module, widget, component, feature

**Application**:
A composition of Functions arranged into a workflow, plus app-level layout, navigation, and context (e.g. PMS, OMS). Adds little logic of its own beyond wiring Functions together.
_Avoid_: App, product, tool

**Entity**:
A domain noun that Functions operate on and pass between each other as context (e.g. portfolio, client, bond, contact).
_Avoid_: Object, record, asset

**Context**:
The typed payload passed through the shared context bus to coordinate Functions — the current selection, persona, and handoff data. Follows an FDC3-inspired "strict core, open extensions" shape: a mandatory `type` discriminator plus standard fields, with namespaced dynamic fields allowed. In-app it lives in a Zustand store; cross-Application and shareable it serializes to Zod-validated URL search params / links.
_Avoid_: State, payload, props

**Context Bus**:
The single shared channel Functions read from and write to in order to coordinate. Functions never call each other directly — they emit and react to Context.
_Avoid_: Event bus, message bus, store

**Workspace**:
A named, persisted, switchable snapshot of the platform context — the active persona, the current Context, and which Application/Functions are open. A user has exactly one active Workspace at a time, and its Context is what is live on the bus. Built on the same Zod schema as Context, so a shared Workspace is a shared link. Excludes fine-grained UI geometry (panel layout, scroll position) in V1.
_Avoid_: Session, tab, desktop, layout

**User**:
An authenticated human identity. Belongs to teams and holds one or more Roles. In V1 this is a mock identity selected from a list; no real authentication.
_Avoid_: Account, member

**Role**:
A named grant of visibility and permissions (e.g. `portfolio-manager`, `compliance-officer`, `client-portal`). Determines which Applications, Functions, and Entities are visible and which actions are allowed. Aegis is a small company, so Roles are a small, flat set with no inheritance hierarchy — visibility is a static Role → resource map, not a policy engine. The target-audience teams are Roles; external access is the most-restricted Role, handled by the same mechanism (see Client Portal Access). Note: a Role is *how a person sees*; do not confuse the external Role with the Client Entity (*what is seen*).
_Avoid_: Permission group, team, persona

**Client Portal Access**:
The most-restricted Role (`client-portal`), by which a Client Entity's authorised Contacts log in to see their own wealth. The external-access Role — distinct from the Client Entity it grants a view onto.
_Avoid_: Client (as a Role), external user, guest

**Persona**:
The currently-active Role a User is operating under — the lens that scopes visibility and Context. Not a fourth identity concept: Persona = active Role. Carried in the Workspace/Context; one active Persona per Workspace.
_Avoid_: Profile, mode, view-as

**SDK**:
A domain-scoped package exposing typed, async, Zod-validated data access for one Entity domain (e.g. `@aegis/sdk-portfolios`). The SDK's interface is the contract and the single source of truth — a future backend conforms to it via OpenAPI codegen, with no DTO-mapping or anti-corruption layer. V1 backs each SDK with an in-memory mock implementation; any future HTTP is sealed inside the SDK and invisible to Functions. Functions consume SDKs only through TanStack Query hooks.
_Avoid_: API client, service, repository, data layer

**Global Search**:
The platform-wide search across Applications, Functions, and Entities. A federation of Search Providers — the registry provides Applications/Functions, each domain SDK provides its Entities — aggregated with Persona/Role visibility filtering and Context-based relevance. Above the fan-out sits a routing/ranking layer that interprets query intent so results are relevant and grouped, never a generic concatenation.
_Avoid_: Lookup, filter, find

**Search Provider**:
A registered source that answers a search query for one slice of the platform (the registry, or a single domain SDK), returning results that conform to the common Entity base shape. New domains extend Global Search by registering a provider, with no change to the search Function.
_Avoid_: Search backend, index, engine

**Manifest**:
A co-located, typed object each Function and Application exports declaring its public identity — id, label, category, the Entity types it handles, required Roles, route, and how it mounts. The Function's implementation stays private behind it. Manifests make units self-describing for both the platform and LLM navigation.
_Avoid_: Config, metadata, descriptor

**Registry**:
The aggregation of all Manifests into one typed source of truth for what exists and who may see it. Drives Global Search, Role visibility, and routing. It does **not** dictate the navigation menu's structure — that is curated separately (see Navigation Taxonomy).
_Avoid_: Catalog, index, directory

**Navigation Taxonomy**:
The curated arrangement of Applications/Functions in the navigation menu, deliberately structured to mirror the firm's front-to-back-office organisation and read as an end-to-end lifecycle. Editorial and intentional — distinct from the Registry, which only says what exists.
_Avoid_: Menu, nav tree, sitemap

**Investment Lifecycle**:
The canonical end-to-end spine the platform is organised around, spanning the firm front-to-back office: (1) Client Acquisition & Relationship (CRM), (2) Onboarding & Due Diligence (KYC/AML), (3) Account & Portfolio Setup, (4) Research & Insight, (5) Portfolio Construction, (6) Pre-Trade, (7) Execution, (8) Post-Trade & Operations, (9) Monitoring & Reporting. Stages provide the structure for the Navigation Taxonomy and the nodes for the Lifecycle Map; Roles map naturally onto stages.
_Avoid_: Workflow, value chain, pipeline

**Trade Lifecycle**:
The order-centric segment within the Investment Lifecycle — pre-trade → execution → post-trade/settlement (stages 6–8). The OMS/Trading/Operations slice; where the mocked PMS→OMS→execution flow lives.
_Avoid_: Order lifecycle, trade flow

**Lifecycle Map**:
A dedicated page that graphically illustrates the end-to-end Investment Lifecycle across the platform — the big-picture view of how front-to-back-office flows connect.
_Avoid_: Diagram, overview, dashboard

**Action**:
A unit of work assigned to a User or Role that, when opened, navigates them to a target Function with the relevant Context pre-loaded. Has an assignee, a target (Application/Function + route), a Context payload, a status, a `kind`, and a reason/label. The inbound counterpart to shareable context — context handed to you with an obligation attached. Reuses the Context bus, Registry, and Role visibility. The platform renders and resolves Actions but is **not** a workflow engine; any orchestration that generates them lives elsewhere. Distinct from a Notification (FYI, no obligation).
_Avoid_: Task, notification, todo, alert

## Development Model

**Citizen Developer**:
A proficient scripter / non-developer who builds features by working with an LLM that follows the platform's documented standards, then hands the result to the dev team for review. The dev team reviews LLM output. The documentation, Manifests, and standards exist primarily to make this handoff safe and graceful.
_Avoid_: User, developer, end-user

**Extension**:
The green-path way of building a feature — staying within existing standards, patterns, and reused components, extending the platform gracefully without introducing anything new beneath the surface. The expected mode for Citizen Developer work.
_Avoid_: Feature work, change

**Notable Change**:
A change that exceeds pure Extension — pulling in a new dependency, introducing a new pattern, or deviating from a documented standard. Must be flagged to the Citizen Developer in-session and called out explicitly in the pull request. Enforced by planned `/citizen-dev-*` tooling (not built during planning).
_Avoid_: Breaking change, refactor, deviation

**Live Application**:
A production-grade Application that follows the full standards and has verified data connections, taken through the stricter developer SDLC. Subject to hard Citizen-Dev guardrails. May never depend on a Prototype.
_Avoid_: Production app, real app

**Prototype**:
A throwaway Application/Function (`status: prototype`) that lives in the same monorepo and Registry as Live work but is badged in the UI, visible to internal Roles only (never Client Portal Access), and built under relaxed standards for rapid design iteration. May depend on Live units (read-only reuse); promotion to Live is a deliberate rebuild, not a flag flip.
_Avoid_: Demo, mockup, POC, sandbox

## Domain Entities

The core ownership chain is **Contact → Client → Account → Portfolio → Holding**.

**Client**:
The wealth-owning relationship the firm manages — an individual, household, or institution (a `type`, not a separate level). Owns one or more Accounts. The Entity in "client accounts"; not to be confused with the Client Portal Access Role.
_Avoid_: Customer, account holder, investor

**Contact**:
A person associated with a Client (the individual themselves, a spouse, a lawyer, an institution's CIO). A Client can have many Contacts and a Contact can relate to multiple Clients. Contacts are who the RM talks to and who logs in under Client Portal Access. Detailed CRM relationships are deferred to PMS build-out.
_Avoid_: Person, lead, user

**Account**:
A legal/custodial container owned by exactly one Client (e.g. "Smith Family Trust — Account 001"). Holds one or more Portfolios. Joint/shared ownership is modelled here, at the Account level.
_Avoid_: Wallet, fund, ledger

**Portfolio**:
A managed pool of Holdings with a strategy/mandate, belonging to exactly one Account. The primary unit of portfolio management and rebalancing.
_Avoid_: Book, basket, fund

**Holding**:
A position in an Instrument within a Portfolio (the instrument plus quantity/weight).
_Avoid_: Position, line, lot

**Instrument**:
A tradable asset (bond, equity, etc.) that can be held. The searchable Universe is drawn from Instruments.
_Avoid_: Security, asset, product
