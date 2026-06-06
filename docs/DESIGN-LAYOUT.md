# Aegis App Layout — the Skeleton

The **canonical structure** of the app: which regions exist, where they live, who owns them, and
how they respond across mobile/tablet/desktop. This is **law** — the Stitch mockups in
[`docs/design-base/`](./design-base) place the sidebar, user menu, "+ New Order", and top-bar
content *inconsistently* across screens; **this document overrides them.** For the *look* (color,
type, components) see [DESIGN.md](./DESIGN.md).

## Regions & ownership

| Region | Owner | Always present? |
|---|---|---|
| **Sidebar** (nav) | Global shell | Yes (desktop); drawer on mobile |
| **Top bar** (app bar) | Global shell | Yes |
| **Context bar** (KPIs / ticker / filters) | Page (Application/Function) | Optional |
| **Content** | Page | Yes |
| **Right rail** (inspector / trade ticket / order book) | Page | Optional |

**Key rule that resolves the mockup drift:** the **global shell owns only the Sidebar and Top
bar**, and their contents are fixed. Everything that varied between screenshots — portfolio KPIs
vs a market-ticker strip, the order-entry panel, "+ New Order" — is **page-owned** and lives in
the **Context bar** or **Right rail**, never hard-coded into the shell. So the shell is identical
on every screen; pages differ only in their own regions.

**Canonical placements (the drift, resolved):**
- **User identity, persona switcher, theme/help/logout → bottom of the sidebar** (a footer). Not the top.
- **Brand → top of the sidebar.**
- **Global search → top bar (center-left). Global actions (notifications, Actions inbox, theme) → top bar right.**
- **Primary CTAs (e.g. "+ New Order") → the page's Context bar or Right rail**, not the sidebar.
- **KPI/ticker strips → the page's Context bar** (directly under the top bar), not the global top bar.

## Desktop (≥ 1280px)

```
┌────────────┬─────────────────────────────────────────────────────────┐
│  BRAND     │ TOP BAR:  [⌘ search……]              🔔  Actions  ◑  user │  ← global shell
│            ├─────────────────────────────────────────────────────────┤
│  ── nav ── │ CONTEXT BAR (page): NAV $… │ Day P&L +… │ filters   [CTA] │  ← page (optional)
│  (grouped  ├──────────────────────────────────────────┬──────────────┤
│   by life- │ CONTENT (page): dense, table-first        │ RIGHT RAIL   │
│   cycle)   │                                           │ (page, opt.) │
│            │                                           │ inspector /  │
│            │                                           │ trade ticket │
│  ┌───────┐ │                                           │ order book   │
│  │ user  │ │                                           │              │
│  │ footer│ │                                           │              │
│  └───────┘ │                                           │              │
└────────────┴───────────────────────────────────────────┴──────────────┘
  240px         fluid                                        ~320–360px
```

- Sidebar fixed **240px**, **collapsible to a ~48px icon rail** (Cmd/Ctrl+B). Brand top; nav
  grouped by the Investment Lifecycle; **user footer pinned bottom**.
- Top bar **~48px**, sticky, identical everywhere.
- Context bar (if used) sticks directly beneath the top bar.
- Right rail (if used) is collapsible.

## Tablet (768 – 1279px)

```
┌──┬──────────────────────────────────────────────┐
│☰ │ TOP BAR: [⌘ search…]        🔔 Actions ◑ user │
│  ├──────────────────────────────────────────────┤
│ic│ CONTEXT BAR (scrolls horizontally if needed)  │
│on│──────────────────────────────────────────────│
│ra│ CONTENT (fewer columns)            [rail →]   │  rail becomes a toggle (Sheet)
│il│                                                │
└──┴──────────────────────────────────────────────┘
```

- Sidebar collapses to the **icon rail** (or off-canvas drawer via the trigger).
- Context bar wraps / KPIs scroll horizontally.
- Right rail collapses into a toggle that opens it as a **Sheet**.
- Content reflows to fewer columns.

## Mobile (< 768px)

```
┌──────────────────────────────────┐
│ ☰   AEGIS                    ⌘    │  TOP APP BAR (hamburger ▸ nav drawer/Sheet)
├──────────────────────────────────┤
│ CONTEXT (horizontal stat chips)  │
│ ───────────────────────────────  │
│ CONTENT (single column;          │
│  tables scroll horizontally or   │
│  condense to stacked rows)       │
│                                  │
│            [ + CTA ]   ← FAB or in page header
├──────────────────────────────────┤
│  ◉ Market  Assets  Portfolio  …  │  BOTTOM TAB BAR (primary destinations)
└──────────────────────────────────┘
```

- **Top app bar:** hamburger (opens full nav as a **Sheet/drawer**) + brand + one primary action
  (command/search).
- **Bottom tab bar:** up to **5 primary destinations**, curated from the Navigation Taxonomy's
  top level. Everything else (full lifecycle nav, settings, logout) lives in the drawer.
- Content single-column; **tables** scroll horizontally or condense to stacked key/value rows;
  **right rail** becomes a full-screen Sheet/modal; **context bar** becomes a horizontal scroll of
  stat chips; primary CTA becomes a FAB or sits in the page header.

## Breakpoints

| Name | Range | Sidebar | Right rail | Primary nav |
|---|---|---|---|---|
| Mobile | < 768px | Drawer (Sheet) | Full-screen Sheet | **Bottom tab bar** |
| Tablet | 768–1279px | Icon rail / drawer | Toggle → Sheet | Sidebar (rail) |
| Desktop | ≥ 1280px | 240px, collapsible | Inline, collapsible | Sidebar |

## How this maps to the code

- **Global shell** = `apps/platform/src/routes/root.tsx` — owns `Sidebar` (brand + lifecycle nav +
  user footer) and the top bar (search + global actions). Built on `@aegis/platform-ui` `Sidebar`.
- **Context bar / Right rail** = page-level slots a Function/Application renders inside the content
  region — not the shell.
- **Current state:** the desktop sidebar + top bar exist. **To build (next):** the page Context-bar
  and Right-rail slots, and the **mobile bottom-tab + drawer** responsive behaviour specced above.
