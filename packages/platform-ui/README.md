# @aegis/platform-ui

**Purpose** — The single shared UI package: owns shadcn/ui components and the Tailwind v4 theme/preset. Every Function and the host shell consume it — there is exactly one shadcn install and one Tailwind setup (ADR 0003).

**Public surface** — `Button` (+ variants), `cn`; `./globals.css` (Tailwind import + OKLCH theme tokens).

**Dependencies** — radix-ui slot, cva, clsx, tailwind-merge, lucide-react; React (peer); Tailwind v4 (dev).

**Notes** — Consumers must `@source` this package's `src` so Tailwind v4 does not purge its classes (ADR 0003).

**Status** — live.
