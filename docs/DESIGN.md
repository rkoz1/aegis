# Aegis Design System

The canonical design system. **LLMs and Citizen Developers must build to this doc.** It defines
the *ethos and specifics* (look, color, type, components). The *skeleton* (where the sidebar,
top bar, nav and panels live, and how they respond) is defined separately in
[DESIGN-LAYOUT.md](./DESIGN-LAYOUT.md) — read both.

Design is a **first-class build step**, not an afterthought: every surface is built from the
shared `@aegis/platform-ui` components, never hand-rolled markup. Stack: [ADR 0003](./adr/0003-locked-stack-version-matrix.md).

> The Stitch mockups in [`docs/design-base/`](./design-base) are **visual inspiration** for the
> components and feel. Their *layout placement is inconsistent* across screens — defer to
> DESIGN-LAYOUT.md for skeleton, not the screenshots.

## Brand & ethos

A **wealth platform with a trading-terminal sensibility** — Bloomberg-terminal efficiency with
modern polish. Personality: **authoritative, precise, utilitarian**. Style: *Modern
Professionalism* + *Systematic Functionalism* — information density over decoration, a
compact grid-locked interface where every pixel is functional, refined with subtle borders and
high-legibility type to reduce cognitive load during long monitoring sessions.

## Color

Dark-first (default). Tokens live once in `packages/platform-ui/src/styles/globals.css`; use the
semantic Tailwind utilities (`bg-card`, `text-muted-foreground`, `text-gain`), never hard-coded
colors.

**Dark (primary) palette:**

| Token | Value | Use |
|---|---|---|
| `background` | `#150c06` | App canvas (deep warm charcoal) |
| `card` | `#1f160d` | Panels / modules (Level 1) |
| `popover` | `#271e15` | Dropdowns / dialogs (Level 2), 1px border |
| `foreground` | `#f2dfd1` | Primary text (warm off-white) |
| `muted-foreground` | `#a38d7a` | Labels, secondary text |
| `primary` | `#ff9500` | **Bloomberg amber** — primary actions, active nav, focus, brand |
| `primary-foreground` | `#2d1600` | Text on amber |
| `secondary` | `#32281f` | Secondary surfaces / ghost-button bg |
| `accent` | `#32281f` | Hover surfaces (kept neutral so hovers stay quiet) |
| `info` | `#8ad3ff` | **Cyan** — market prices, links, tickers (tertiary) |
| `gain` | `#4ade80` | P&L up / positive |
| `loss` / `destructive` | `#ff5d5d` | P&L down / negative / errors |
| `warning` | `#ffbd7f` | Soft amber for non-critical attention |
| `border` / `input` | `#554334` | 1px dividers, input borders |
| `ring` | `#ff9500` | Focus ring (amber) |

Amber is used **sparingly** — primary actions, active state, focus, alerts — for instant
hierarchy. Greens/reds are reserved for market signals (P&L). Cyan marks live market data.
A warm light palette exists for completeness but the product is dark-first.

## Typography

Dual-font strategy (self-hosted via `@fontsource-variable`, set as `--font-sans` / `--font-mono`):

- **Inter** — all UI: navigation, labels, prose.
- **JetBrains Mono** — **all numbers**: prices, tickers, P&L, quantities. Monospaced + tabular
  figures so columns align for vertical scanning (`.font-mono` enables tabular nums globally).

Scale (apply with Tailwind text utilities):

| Role | Font | Size / weight | Use |
|---|---|---|---|
| display | Inter | 24px / 600, tight | Page titles |
| headline | Inter | 18px / 600 | Section / panel titles |
| body-lg | Inter | 14px / 400 | Default body |
| body-sm | Inter | 12px / 400 | Dense body |
| data-lg | JetBrains Mono | 14px / 500 | Primary numeric data |
| data-sm | JetBrains Mono | 12px / 500 | **Table cells (default — max density)** |
| label-xs | Inter | 10px / 700, uppercase, +letter-spacing | Table headers, metadata |

Rules: `data-sm` for most table content; `label-xs` for headers/descriptors; high contrast for
primary data, muted grays for labels.

## Layout & spacing (density)

Modular **4px grid**; deliberately tighter than typical web spacing.

- Base unit **4px**; container padding **12px**; component gap **8px** (down to 4px); table row
  height **~28px** with minimal padding; sidebar **240px**.
- Tables are the primary layout engine — compact rows, sticky headers, 1px column dividers.

## Elevation & shape

- **Tonal layering + 1px low-contrast outlines**, not shadows (flat, fast, terminal feel).
  L0 `background` → L1 `card` → L2 `popover` (+ 1px `border`). Shadows only for critical modal focus.
- **Sharp: 0px radius.** Corners are square so components sit flush. (`--radius: 0`; avatars may
  stay circular.)

## Components

Built on Radix primitives (shadcn) in `@aegis/platform-ui`, styled dense. **Add missing
components here and re-export from the barrel `src/index.ts`** — never hand-roll or add locally.

Available now: Button, Card, Badge, Input, Select, DropdownMenu, Command, Popover, Dialog,
Sheet, Tooltip, Avatar, Separator, ScrollArea, Skeleton, Table, Sidebar, plus finance primitives
**Stat** (KPI) and **Change** (signed gain/loss value), and **ThemeProvider/ThemeToggle**.

Conventions & terminal-specific components to honour/build:
- **Buttons** — small (24–32px). Primary = amber w/ dark text; secondary = ghost + 1px border.
- **Inputs** — dark bg, sharp, monochrome border, amber only on focus.
- **Data Tables** — the core. `label-xs` sticky headers; `data-sm` mono cells; right-align numbers;
  support **flash** states (row/cell briefly tints gain/loss on value change).
- **Badges/Chips** — small, rectangular status tags (OPEN, FILLED, REVIEW); low-opacity tint of
  gain/loss/warning with high-contrast text.
- **KPI Stat** — label-xs label + mono value; deltas via `Change`.
- **Command Palette** — central quick nav + ticker search (blurred L2 surface). *(planned)*
- **Ticker Strip** — horizontal market-index row (SPX/NDX/…) for top-of-page context. *(planned)*
- **Trade Ticket** — order-entry panel, high-contrast Buy(green)/Sell(red). *(planned)*

## Test-stable roles

Keep accessible roles stable (Playwright depends on them): nav links stay `<a>`
(`SidebarMenuButton asChild` + `Link`); persona is a `Select` labelled "Persona"; selectable
table rows expose a `<button>` with the row's name.

## Adding a component

1. From `packages/platform-ui`: `pnpm dlx shadcn@latest add <name> --overwrite`.
2. Verify imports are `@aegis/platform-ui/...` and tokens merged into `globals.css`.
3. Re-export from `src/index.ts`; if it adds a hook, the `./hooks/*` export covers it.
4. `pnpm check-types && pnpm build`; confirm classes survive Tailwind v4's cross-package scan
   (the app `@source`s `packages/platform-ui/src` + `packages/functions`).
