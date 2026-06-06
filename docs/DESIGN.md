# Aegis Design System

How Aegis looks and how to keep it looking consistent. Design is a **first-class build
step**, not an afterthought — every Function and shell surface is built from the shared
component library, never hand-rolled markup. See [CONVENTIONS.md](../CONVENTIONS.md) for where
this fits in the build process and [ADR 0003](./adr/0003-locked-stack-version-matrix.md) for the
stack.

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

Defined once in `packages/platform-ui/src/styles/globals.css`:
- OKLCH color tokens for **light** (`:root`) and **dark** (`.dark`) — `background`, `foreground`,
  `card`, `popover`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `input`,
  `ring`, plus `sidebar-*` tokens.
- `@theme inline` maps them to Tailwind utilities (`bg-primary`, `text-muted-foreground`, …).
- Style: **new-york**, base color **neutral**, icons **lucide-react**.

Use the semantic tokens (`bg-card`, `text-muted-foreground`, `border-border`), never hard-coded
colors — that's what makes light/dark and future re-theming work.

## Dark mode

`ThemeProvider` + `ThemeToggle` (in `@aegis/platform-ui`) toggle the `.dark` class on
`documentElement` and persist to `localStorage`. `apps/platform/index.html` sets the class before
mount to avoid a flash. The toggle lives in the shell header.

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
