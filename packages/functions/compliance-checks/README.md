# @aegis/function-compliance-checks

**Purpose** — Surfaces simulated mandate checks across portfolios. Added in Phase 1 to demonstrate Role-based visibility (a second, restricted Function).

**Public surface** — `complianceChecksManifest`, `ComplianceChecks`. Route: `/compliance-checks`. Required roles: `compliance-officer`, `portfolio-manager`.

**Context consumed/emitted** — None yet (Context Bus arrives in Phase 3).

**SDK dependencies** — `@aegis/sdk-portfolios` (`usePortfolios`) — reused, not duplicated.

**UI components** — `@aegis/platform-ui`: Card, Badge (status), cn.

**Status** — live (minimal).
