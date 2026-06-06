# V2 Brief — Mocked PMS / OMS

A seed for a `/grill-with-docs` session. This is **intent and open questions**, not a
spec — the grill will sharpen it against [CONTEXT.md](../CONTEXT.md) and the ADRs and
produce the decisions. Built entirely on the V1 platform with mocked data.

## Purpose

Demonstrate an end-to-end portfolio-management → order → execution workflow across two
Applications (PMS and OMS), to show peers what the real apps could look like and to validate
the "Application = composition of Functions" model (ADR 0001) with the first real Applications.

## Scope (from the original requirements, "Mocked applications")

- Portfolio management for different **Client** accounts across **single and multiple**
  Accounts/Portfolios.
- **Universe** of assets — search, filter — to build a Portfolio or add to an existing one.
- **Weight-based rebalancing**.
- An **Order** generated in PMS that **flows to OMS** → execution → status visible in both.
- **Simulated compliance, suitability, mandate** and other OMS checks, surfaced in PMS and OMS.

## Likely new building blocks (to confirm in the grill)

- **SDKs** extending the entity chain (Contact→Client→Account→Portfolio→Holding, + Instrument):
  `@aegis/sdk-clients`, `@aegis/sdk-accounts`, `@aegis/sdk-instruments`, `@aegis/sdk-orders`.
  Each owns its types (ADR 0002), mocked in V1 style.
- **Functions** (reusable): `universe-builder`, `rebalancer` (weight-based), `order-ticket`,
  `order-blotter`, `execution-status`, `compliance-suitability-mandate-checks`.
- **Applications**: `@aegis/app-pms`, `@aegis/app-oms` — compositions of the above Functions.

## Open questions for the grill

1. **Composition** — Which Functions make up PMS vs OMS, and which are shared between them
   (e.g. universe-builder, the checks)? Where exactly is the PMS/OMS boundary?
2. **Order lifecycle** — The Order state machine: draft → checks → approved → routed →
   executing → filled / partially-filled / rejected → settled. Which states, which transitions,
   who/what triggers each?
3. **PMS → OMS handoff** — How does an Order created in PMS reach OMS? Via the Context Bus, an
   Action assigned to the trading desk, a shared `sdk-orders`, or some combination? What's the
   source of truth for Order state?
4. **Compliance / suitability / mandate** — What do these checks evaluate (mock rules), and do
   they *gate* the flow (block until approved) or just annotate? Where do they run (PMS pre-trade,
   OMS pre-execution, or both)?
5. **Rebalancing** — Target weights vs current weights → generated trades. Drift tolerance?
   Does rebalancing produce a basket of Orders?
6. **Universe** — Is the universe builder its own search, or does it reuse Global Search /
   `SearchProvider`s? How does selection flow into a Portfolio (Context Bus)?
7. **Client / Account / Portfolio** — Confirm the single-vs-multiple account/portfolio modelling
   and how the PMS navigates it. (CRM relationships were deferred — how much is needed here?)
8. **Roles** — Which Personas drive which steps (PM constructs/rebalances, Trading executes,
   Compliance reviews, Ops settles), and how do Actions route work between them?
9. **Lifecycle mapping** — These Functions populate the Pre-Trade → Execution → Post-Trade
   stages (the Trade Lifecycle segment). Confirm category assignments for the nav taxonomy.

## Out of scope (V2)

- Real execution, real market data, real auth, a real backend. All mocked via SDKs.
- Deep CRM relationship modelling (deferred per CONTEXT.md).

## Definition of Done

Each Function/Application: gates green (type-check, tests, `check-deps`, build) **and** a design
pass per [DESIGN.md](./DESIGN.md). A human can drive PMS → OMS → execution end-to-end with the
mocked flow visible in both Applications.
