# SDK types are the source of truth; no anti-corruption layer

## Status

accepted

## Context

Functions access data through domain-scoped SDK packages (`@aegis/sdk-portfolios`, …). We had to decide who owns the canonical domain types and how the platform relates to a future backend. The usual instinct is a shared `core-models` package owning all domain entities plus an anti-corruption / DTO-mapping layer that insulates the frontend from backend contract churn.

## Decision

The SDK's typed, Zod-validated interface is the single source of truth for its domain. Each SDK package owns and exports its own domain Entity types (`Portfolio` lives with `@aegis/sdk-portfolios`). `core-models` is reduced to shared, domain-agnostic primitives and value objects that no single SDK owns (`Money`, `EntityRef`, currency/enum types) plus a minimal common `Entity` base shape (`id`, `type`, `label`, visibility) that search and the context bus rely on. There is no DTO-mapping or anti-corruption layer and no duck typing.

## Why

We want internal packages to consume SDK/library definitions directly rather than track API contracts and perform conversions. A future backend will conform to these types via an OpenAPI → generator → client pipeline, so the generated client *becomes* (or backs) the SDK's exported types with zero mapping. If a generated type changes shape, the platform fails to compile and the team addresses it loudly — drift is surfaced, not absorbed. Owning types per-SDK (rather than in a central `core-models`) keeps a single `Portfolio` definition co-located with its data access, and positions base Entities to later become publishable packages shared with backend API development.

## Consequences

The platform is deliberately coupled to backend contract shape — by design, the coupling fails loud at compile time rather than being hidden by a mapping layer. Backend contract changes require frontend fixes; this is the accepted trade-off for eliminating conversion code and duck typing.
