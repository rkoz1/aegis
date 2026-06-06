# Functions composed at build time as workspace packages

## Status

accepted

## Context

Aegis is a wealth-management platform built as a Turborepo/pnpm monorepo, where Applications (PMS, OMS, …) are compositions of reusable Functions (universe builder, rebalancer, …). We needed to decide how an Application assembles its Functions: at build time (Functions are workspace packages an Application imports and arranges) or at runtime (micro-frontends / module federation, deployed independently and loaded into shells).

## Decision

Functions and Applications are both packages in the pnpm workspace. An Application imports the Function components it needs and composes them at compile time via the Turborepo graph. No micro-frontend or runtime module-federation layer in V1/V2.

## Why

The platform's stated priorities — simplest integration, well-proven LLM-friendly technologies, SDK-over-API, mocked data in V1 — all favour build-time composition. It preserves end-to-end type safety across the Function/Application seam (props and context are typed and Zod-validated), which is what keeps the codebase navigable for LLMs. Runtime federation's only real benefit — independent team deploys — is not required by anything in V1 or V2, and its costs (weaker cross-seam types, heavier machinery, harder navigation) are high. Functions can still be made runtime-*discoverable* via a registry for search/navigation without adopting federation.

## Consequences

An Application redeploys when a Function it embeds changes. Revisit only if independent per-team deploys become a hard requirement (V3+).
