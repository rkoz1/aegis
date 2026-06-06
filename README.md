# Aegis

A wealth-management platform: a monorepo of frontend **Applications** and reusable **Functions**, built for rapid LLM-assisted development. It hosts both Live applications and throwaway Prototypes used to demonstrate potential workflows to stakeholders.

The platform's organising spine is the **Investment Lifecycle** — front-to-back office, from first client contact (CRM) through onboarding (KYC/AML), portfolio construction, trading, and operations.

## Start here

| Doc | What it is |
|---|---|
| [CONTEXT.md](./CONTEXT.md) | The glossary — the platform's ubiquitous language. Read this first. |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | The map — package taxonomy, layering rules, topology. |
| [CONVENTIONS.md](./CONVENTIONS.md) | How we build — naming, dependency rules, the citizen-dev guardrail. |
| [docs/adr/](./docs/adr) | The hard-to-reverse decisions and why we made them. |
| [docs/PHASES.md](./docs/PHASES.md) | The tracer-bullet build plan (V1). |

## Status

Greenfield — design phase complete (glossary, ADRs, phased plan written); build starts at [Phase 0 — Spine](./docs/PHASES.md#phase-0--spine).

## Stack

pnpm · Turborepo · React 19 · Vite 7 · Tailwind CSS v4 · shadcn/ui · TanStack Query + Router · Zod 4 · Zustand 5. Versions are locked in [ADR 0003](./docs/adr/0003-locked-stack-version-matrix.md).
