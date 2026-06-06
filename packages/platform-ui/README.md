# @aegis/platform-ui

**Purpose** — The single shared UI package: owns shadcn/ui components, the terminal design tokens
(Tailwind v4 theme), and dark mode. Every Function and the host shell consume it — there is exactly
one shadcn install and one token set ([ADR 0003](../../docs/adr/0003-locked-stack-version-matrix.md)).
The design language is defined in [docs/DESIGN.md](../../docs/DESIGN.md).

## Public surface (barrel: `@aegis/platform-ui`)

- **Components (shadcn):** Button, Card, Badge, Input, Select, DropdownMenu, Command (+ CommandDialog),
  Popover, Dialog, Sheet, Tooltip, Avatar, Separator, ScrollArea, Skeleton, **Table** (terminal-dense),
  Sidebar (+ `useSidebar`), and `useIsMobile`.
- **Finance primitives:** `Stat` / `StatLabel` / `StatValue` (KPI blocks), `Change` (signed
  gain/loss-coloured numeric).
- **Theme:** `ThemeProvider`, `useTheme`, `ThemeToggle` (dark-first; toggles `.dark`, persists to
  `localStorage`).
- **Utility:** `cn`.
- **Styles:** `./globals.css` (Tailwind import + the terminal token system: warm charcoal, amber
  primary, cyan `info`, `gain`/`loss`, sharp 0px radius, Inter + JetBrains Mono).

## Rules

- **Component-first** — no raw markup where a component exists. Add missing components here (never
  locally) and **re-export from `src/index.ts`** (the barrel) — consumers import from the barrel.
- Hooks are exported via `./hooks/*`. Consuming apps that import an icon directly need `lucide-react`.
- Consuming apps must `@source` this package's `src` so Tailwind v4 doesn't purge its classes.

## Adding a component

`pnpm dlx shadcn@latest add <name> --overwrite` from this package → verify imports/tokens →
re-export from `src/index.ts` → `pnpm check-types && pnpm build`. See [docs/DESIGN.md](../../docs/DESIGN.md).

**Status** — live.
