---
name: Financial Intelligence System
colors:
  surface: '#1a120a'
  surface-dim: '#1a120a'
  surface-bright: '#42372d'
  surface-container-lowest: '#150c06'
  surface-container-low: '#231a11'
  surface-container: '#271e15'
  surface-container-high: '#32281f'
  surface-container-highest: '#3e3329'
  on-surface: '#f2dfd1'
  on-surface-variant: '#dbc2ad'
  inverse-surface: '#f2dfd1'
  inverse-on-surface: '#392e25'
  outline: '#a38d7a'
  outline-variant: '#554334'
  surface-tint: '#ffb874'
  primary: '#ffbd7f'
  on-primary: '#4b2800'
  primary-container: '#ff9500'
  on-primary-container: '#643700'
  inverse-primary: '#8c5000'
  secondary: '#c5c7c9'
  on-secondary: '#2e3133'
  secondary-container: '#444749'
  on-secondary-container: '#b3b5b8'
  tertiary: '#8ad3ff'
  on-tertiary: '#00344a'
  tertiary-container: '#00bbfe'
  on-tertiary-container: '#004764'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdcbf'
  primary-fixed-dim: '#ffb874'
  on-primary-fixed: '#2d1600'
  on-primary-fixed-variant: '#6a3b00'
  secondary-fixed: '#e1e3e5'
  secondary-fixed-dim: '#c5c7c9'
  on-secondary-fixed: '#191c1e'
  on-secondary-fixed-variant: '#444749'
  tertiary-fixed: '#c5e7ff'
  tertiary-fixed-dim: '#7fd0ff'
  on-tertiary-fixed: '#001e2d'
  on-tertiary-fixed-variant: '#004c6a'
  background: '#1a120a'
  on-background: '#f2dfd1'
  surface-variant: '#3e3329'
typography:
  display:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  data-lg:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: -0.01em
  data-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: -0.01em
  label-xs:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 12px
    letterSpacing: 0.05em
spacing:
  unit: 4px
  container-padding: 12px
  component-gap: 8px
  table-row-height: 28px
  sidebar-width: 240px
  gutter: 4px
---

## Brand & Style

This design system is engineered for professional wealth management and high-frequency trading environments. It prioritizes information density and data-driven decision-making over decorative elements. The brand personality is **authoritative, precise, and utilitarian**, reflecting a high-end financial terminal experience.

The design style is **Modern Professionalism** with a heavy focus on **Systematic Functionalism**. It avoids unnecessary whitespace, opting for a compact, grid-locked interface where every pixel serves a functional purpose. The aesthetic is reminiscent of Bloomberg Terminal’s efficiency but refined with modern UI sensibilities—incorporating subtle borders and high-legibility typography to reduce cognitive load during long periods of market monitoring.

## Colors

The palette is anchored in a **Primary Dark Mode** to reduce eye strain and maximize the contrast of critical market data.

- **Core Backgrounds:** The base is a deep, true charcoal (`#0A0B0C`), providing a non-distracting canvas for data.
- **Accents:** The "Bloomberg Orange" (`#FF9500`) is used sparingly for primary actions, focus states, and key alerts to provide immediate visual hierarchy.
- **Market Signals:** We utilize highly saturated Greens and Reds for price movements. These are tuned for high contrast against the dark background to ensure instant recognition of profit/loss states.
- **Neutrals:** Grays are utilized for structural elements (borders, headers, and secondary text) to create clear compartmentalization without adding visual noise.

## Typography

Typography is the most critical asset in this design system. We utilize a dual-font strategy:
1. **Inter:** Used for the primary UI, navigation, and labels. It provides a clean, neutral tone that stays legible at small sizes.
2. **JetBrains Mono:** Reserved for all numerical data, tickers, and financial values. The monospaced nature ensures that columns of numbers align perfectly in tables, allowing for easier vertical scanning of market movements.

**Hierarchy Rules:**
- Use `data-sm` for the majority of table content to maximize row density.
- Use `label-xs` for table headers and metadata descriptors to keep them distinct from active data.
- Maintain a high contrast ratio for primary data; use muted grays for descriptive labels.

## Layout & Spacing

This design system uses a **Fluid/Modular Grid** optimized for high density. The base unit is **4px**, allowing for tight, precise alignments.

- **Density:** We deviate from standard web margins. Component gaps are minimized to 8px or 4px to maximize the "above the fold" information.
- **Tables:** This is the primary layout engine. Rows should be compact (28px height) with minimal padding.
- **Breakpoints:**
  - **Desktop (1440px+):** Full multi-pane dashboard with fixed sidebars and flexible central data widgets.
  - **Tablet (768px-1439px):** Reflows to 2-column view; secondary widgets collapse into tabs.
  - **Mobile:** Not the primary use case, but provides a single-column, simplified ticker and order-entry view.

## Elevation & Depth

Elevation is conveyed through **Tonal Layering** and **Low-Contrast Outlines** rather than soft shadows. This maintains the utilitarian, "screen-within-a-screen" terminal feel.

- **Level 0 (Background):** `#0A0B0C` - The master canvas.
- **Level 1 (Panels/Cards):** `#141618` - Used for primary workspace modules.
- **Level 2 (Popovers/Modals):** `#1C1E20` - Used for dropdowns and dialogs, accented with a 1px solid border (`#27272A`).
- **Dividers:** Use subtle, 1px solid lines to separate data columns. Avoid shadows unless used for critical modal focus to ensure the UI remains flat and fast.

## Shapes

The shape language is **Sharp (0px roundedness)**. 

To maintain the professional, financial-tool aesthetic, rounded corners are eliminated. Every button, input field, and card container uses 90-degree angles. This allows components to sit flush against one another, maximizing usable screen real estate and reinforcing the "instrument" feel of the platform.

## Components

All components are built upon Radix UI primitives for accessibility, styled with Tailwind CSS for high density.

- **Buttons:** Small (24px-32px height). Primary buttons use the Orange accent with black text. Secondary buttons use ghost styles with a 1px border.
- **Inputs:** Dark backgrounds, sharp corners, and monochromatic borders that highlight Orange only on focus.
- **Data Tables:** The core component. Must support "Flash" states (background color flashes green/red on value change). Headers are sticky and use `label-xs` typography.
- **Chips/Badges:** Small, rectangular tags for status (e.g., "OPEN", "FILLED"). Use low-opacity background tints of success/error colors with high-contrast text.
- **Command Palette:** A central feature for quick navigation and ticker search, using a blurred Level 2 surface.
- **Trade Ticket:** A specialized vertical or horizontal panel for order entry, requiring high-contrast inputs and immediate visual feedback on "Buy" vs "Sell" buttons.