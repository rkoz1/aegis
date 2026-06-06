# Aegis Design System

How Aegis looks and how to keep it looking consistent. Design is a **first-class build
step**, not an afterthought — every Function and shell surface is built from the shared
component library, never hand-rolled markup. See [CONVENTIONS.md](../CONVENTIONS.md) for where
this fits in the build process and [ADR 0003](./adr/0003-locked-stack-version-matrix.md) for the
stack.

## The look

A **wealth platform with a trading-desk sensibility** — Bloomberg-terminal DNA (dense,
data-first, dark) with modern polish. Information is laid out the way portfolio managers and
traders expect: tables of right-aligned, monospaced, tabular numbers; colour-coded P&L; KPI
stats; status badges. Dark is the default; light is fully supported.

## The rules

1. **Component-first — no raw markup where a component exists.** If a shadcn primitive covers it
   (Button, Card, Badge, Select, Input, DropdownMenu, Command, Popover, Tooltip, Avatar, Sidebar,
   …), use it. Raw `<div>`/`<span>` with Tailwind is only for layout and spacing.
2. **One UI package.** All components live in `@aegis/platform-ui`. Never add a component locally
   in a Function or the app — add it to `@aegis/platform-ui` so every surface shares it.
3. **Barrel exports.** Every component is re-exported from `packages/platform-ui/src/index.ts`;
   consumers import from `@aegis/platform-ui` (the barrel), not subpaths.
4. **Layout from shadcn blocks.** Use the [shadcn blocks](https://ui.shadcn.com/blocks) as the
   layout vocabulary. The shell follows the **sidebar-07** pattern (collapsible-to-icon sidebar +
   inset content).

## Theme tokens

Defined once in `packages/platform-ui/src/styles/globals.css`, OKLCH, for **dark** (`.dark`) and
**light** (`:root`):
- Surfaces: slate `background` / `card` / `popover` (near-black in dark, not pure black).
- **`primary`** — institutional **blue** (buttons, active, focus ring).
- **`accent`** — subtle slate (hover states); keep it neutral so hovers stay quiet.
- **`warning`** — **amber**, used sparingly for attention/active highlights (the terminal nod).
- **`gain` / `loss`** — semantic green/red for P&L and deltas (`text-gain`, `text-loss`).
- `destructive`, `secondary`, `muted`, `border`, `input`, `ring`, `sidebar-*`.
- `radius` is **0.3rem** (crisp, not pill); `@theme inline` maps everything to utilities
  (`bg-primary`, `text-muted-foreground`, `text-gain`, …).

Use the semantic tokens (`bg-card`, `text-muted-foreground`, `text-gain`), never hard-coded
colors — that's what makes light/dark and future re-theming work. Style: **new-york**, icons
**lucide-react**.

## Typography & numerics

- **Inter Variable** for UI, **JetBrains Mono Variable** for numerics — both self-hosted via
  `@fontsource-variable/*` (imported in `apps/platform/src/main.tsx`), set as `--font-sans` /
  `--font-mono`.
- **All numbers use `font-mono` + `tabular-nums`** so columns align (`.font-mono` enables tabular
  figures globally). Right-align numeric table columns and KPI values.

## Data display (how PMs/traders read it)

- Tabular data → **`Table`** with right-aligned mono numerics and status **`Badge`**s.
- Metrics → **`Stat`** / `StatLabel` / `StatValue` (KPI blocks).
- Signed/P&L values → **`Change`** (auto green/red by sign): `<Change value={pct} format={…} />`.
- Selected rows use `data-state="selected"`; selection flows through the Context Bus.

## Dark mode

`ThemeProvider` + `ThemeToggle` (in `@aegis/platform-ui`) toggle the `.dark` class on
`documentElement` and persist to `localStorage`. **Dark is the default** (trading-desk
expectation) — `index.html` adds `.dark` before mount unless the user explicitly chose light, so
there's no flash. The toggle lives in the shell header.

## Adding a component to `@aegis/platform-ui`

1. From `packages/platform-ui`: `pnpm dlx shadcn@latest add <name>` (components.json is configured:
   new-york, neutral, aliases to `@aegis/platform-ui/*`). Use `--overwrite` to skip prompts.
2. **Verify** the generated file: imports are `@aegis/platform-ui/...` (not `@/...`), it lands in
   `src/components/<name>.tsx`, and any new CSS tokens merged cleanly into `globals.css`.
3. **Re-export** its public surface from `src/index.ts` (`export * from "./components/<name>"`).
4. If it adds a hook under `src/hooks/`, the `./hooks/*` export in `package.json` already covers it.
5. If a consumer (app/Function) imports an icon directly, add `lucide-react` to that package's deps.
6. Run `pnpm check-types && pnpm build`, then **verify the classes survive** Tailwind v4's
   cross-package scan (ADR 0003): grep the built CSS or check visually. The app's `index.css`
   `@source`s `packages/platform-ui/src` and `packages/functions` — keep those.

## Accessibility / test-stability notes

- Nav links use `SidebarMenuButton asChild` wrapping a TanStack `<Link>` so they stay real `<a>`
  elements (role `link`).
- The persona control is a `Select` with `aria-label="Persona"` (role `combobox`).
- Selectable cards (e.g. portfolio cards) stay `<button>` elements with their label as the
  accessible name.
Keep these stable — the Playwright smoke specs depend on them.
