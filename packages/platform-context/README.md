# @aegis/platform-context

**Purpose** — The Context Bus. Functions coordinate by emitting and reacting to Context here — never by importing each other.

**Public surface** — `ContextSchema`/`AegisContext` (FDC3-inspired strict core + open extensions), `ContextTypes`, `makeContext`, `matchesType`, `useContextBus`, `useContextOfType`.

**Dependencies** — `zod`, `zustand`; React (peer).

**Tests** — `context.test.ts` (schema, helpers, store).

**Status** — live.
