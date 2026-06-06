---
name: citizen-dev-commit
description: Commit Citizen-Developer work safely — run the gates, flag Notable Changes, write a clean commit. Use when a citizen developer is ready to commit a feature in the Aegis monorepo.
---

# citizen-dev-commit

Guide a Citizen Developer (a proficient scripter, not necessarily a developer)
to a clean commit that the dev team will be happy to review. The dev team reviews
LLM output — your job is to keep it within standards and surface anything that
isn't.

## Steps

1. **Run the gates** (all must pass — do not commit on failure):
   - `pnpm check-types`
   - `pnpm test`
   - `pnpm check-deps` (dependency-boundary rules)
   - `pnpm build`
2. **Detect Notable Changes** — anything beyond pure Extension (see CONVENTIONS.md):
   - a new dependency in any `package.json`
   - a new cross-package dependency edge (re-run `pnpm check-deps`)
   - a new pattern, or a deviation from a documented standard / the glossary
   - a new package, Function, or SDK
3. **If Notable Changes exist**, tell the Citizen Developer plainly what changed
   and why it's notable, and confirm they want to proceed. Record them — they go
   into the commit body and (later) the PR description.
4. **Verify docs moved with the code** — new package has a `README.md`; new term
   added to `CONTEXT.md`; surprising/hard-to-reverse decision has an ADR.
5. **Write the commit** — imperative subject, body explaining the change, and a
   `Notable changes:` section if any. Branch first if on `main`.

## Reminders

- Stay within existing standards and reuse components — that is the green path.
- Never introduce a new library to do something an existing one already does.
- If unsure whether something is a Notable Change, treat it as one and flag it.
