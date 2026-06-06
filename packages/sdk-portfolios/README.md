# @aegis/sdk-portfolios

**Purpose** — Domain SDK for portfolios. Owns the `Portfolio` type (ADR 0002), backed by an in-memory mock in V1.

**Public surface** — `Portfolio`/`PortfolioSchema`; `portfoliosSdk` (`list`, `get`, `search`); hooks `usePortfolios`, `usePortfolio`, `portfolioKeys`.

**Dependencies** — `@aegis/models`, `zod`; `@tanstack/react-query` (peer). Any future HTTP stays sealed inside this package.

**Status** — live (mock data).
