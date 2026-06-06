# CLAUDE.md — Aegis

Read this, then [CONTEXT.md](./CONTEXT.md) (glossary), [ARCHITECTURE.md](./ARCHITECTURE.md) (map), and [CONVENTIONS.md](./CONVENTIONS.md) (rules) before working. The hard decisions live in [docs/adr/](./docs/adr); the build plan in [docs/PHASES.md](./docs/PHASES.md). This documentation exists so any agent — or a Citizen Developer working with an LLM — can extend the platform safely after context clearing.

## Use the glossary

Use the canonical terms from [CONTEXT.md](./CONTEXT.md) exactly. The key ones: **Function** (reusable unit), **Application** (composition of Functions), **Entity**, **Context** / **Context Bus**, **Workspace**, **User / Role / Persona**, **SDK**, **Manifest** / **Registry**, **Action**. If you reach for a synonym listed under `_Avoid_`, use the canonical term instead.

## Core rules (the non-negotiables)

- **Composition is build-time.** Functions and Applications are workspace packages; one host shell (`apps/platform`) mounts Applications. No micro-frontends. ([ADR 0001](./docs/adr/0001-functions-composed-at-build-time.md))
- **SDK types are the source of truth.** Each SDK owns its domain types; no DTO-mapping or anti-corruption layer; no duck typing. Functions consume SDKs only via TanStack Query hooks. ([ADR 0002](./docs/adr/0002-sdk-types-are-the-source-of-truth.md))
- **Functions never import each other.** They coordinate only through the Context Bus.
- **Respect the layering.** `app → application → function → {sdk, platform, models, core}`; `sdk → {models, core}`. Never import upward. **Live never imports a Prototype.**
- **Locked stack.** Use the versions in [ADR 0003](./docs/adr/0003-locked-stack-version-matrix.md). Tailwind v4 is CSS-first; shadcn lives in one shared `@aegis/platform-ui`.
- **Flag Notable Changes.** A new dependency, a new pattern, or any deviation from a documented standard is a Notable Change — surface it to the user in-session and call it out in the PR. Pure Extension (within standards, reusing components) is the default path.

## Keep docs co-located and current

Documentation lives next to the code it describes (per-package READMEs). The root index (CONTEXT / ARCHITECTURE / CONVENTIONS / ADRs / PHASES) is the thin, always-read layer — keep it accurate. Update [CONTEXT.md](./CONTEXT.md) when language changes; add an ADR only for decisions that are hard to reverse, surprising, and the result of a real trade-off.

## Build discipline

Work in tracer-bullet phases ([docs/PHASES.md](./docs/PHASES.md)): every change ends in something a human can click and test — no pure-background work. Keep dependency-rule enforcement light early to avoid Turborepo/ESLint enforcement loops.
