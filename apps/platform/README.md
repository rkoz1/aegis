# @aegis/platform (host shell)

**Purpose** — The single deployable host shell (ADR 0001). Owns the chrome and mounts Functions
composed from the Registry. The look follows [docs/DESIGN.md](../../docs/DESIGN.md); the skeleton
follows [docs/DESIGN-LAYOUT.md](../../docs/DESIGN-LAYOUT.md).

## Functionality

- **Navigation** — collapsible sidebar (icon rail), nav curated by the Investment Lifecycle; on
  mobile the sidebar becomes a drawer. (`routes/root.tsx`)
- **Role-based visibility** — nav + routes scoped to the active Persona; hidden Functions are
  guarded on direct URL. (`routes/guarded.tsx`, `registry.ts`)
- **Persona switcher** — switch the active Role; visibility/Context re-scope. (`persona-switcher.tsx`)
- **Global search** — federated, role-filtered, ranked search in the top bar. (`global-search.tsx`, `search.ts`)
- **Command palette & keyboard** — `⌘K`/`Ctrl+K` or `/` palette; `g` leader keys with hints; `?`
  shortcuts overlay; table arrow-nav; row-click selects. (`power-nav.tsx`)
- **Context bus** — selecting an Entity emits Context; the header chip + Functions react. (`context-chip.tsx`)
- **Workspaces & shareable links** — save/switch persona+Context snapshots; Share copies a
  restoring URL; restore-from-URL on load. (`workspace-bar.tsx`, `use-restore.ts`)
- **Actions inbox** — per-persona assigned items that deep-link with Context. (`actions-inbox.tsx`)
- **Lifecycle Map** — graphical end-to-end lifecycle page. (`routes/lifecycle-map.tsx`)
- **Theme** — dark-first with a light toggle. (`@aegis/platform-ui` ThemeProvider/Toggle, `main.tsx`)
- **Responsive** — desktop sidebar + inset; mobile drawer + reflow; tables scroll; right rail stacks.

## Key files

`registry.ts` (composes Functions) · `router.tsx` (code-based routes from the Registry) ·
`search.ts` (Search Provider composition) · `power-nav.tsx` (command palette + shortcuts) ·
`routes/` (root layout, home, lifecycle map, guard) · chrome components listed above.

**Run** — `pnpm --filter @aegis/platform dev`. **E2E** — `pnpm --filter @aegis/platform e2e`
(needs `npx playwright install`).

**Status** — live.
