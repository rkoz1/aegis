---
name: citizen-dev-create-pr
description: Open a pull request for Citizen-Developer work with Notable Changes called out for the dev team. Use when a citizen developer's feature is committed and ready for review.
---

# citizen-dev-create-pr

Open a PR that a developer can review quickly and confidently. The PR is the
handoff point: the dev team reviews LLM output and then takes the work Live
through a stricter SDLC.

## Steps

1. **Confirm the gates passed** (see `citizen-dev-commit`): check-types, test,
   check-deps, build all green on the branch.
2. **Summarise the feature** in plain language: what it does and which
   Functions/SDKs it touches.
3. **Call out Notable Changes explicitly** in a dedicated PR section — new
   dependencies, new patterns, new packages, or any deviation from standards.
   If there are none, say "Notable changes: none (pure Extension)".
4. **List what a reviewer should check**: data connections still mocked,
   visibility/role behaviour, anything that will need hardening before going Live.
5. **Open the PR** with `gh pr create`, using the summary + Notable Changes +
   review checklist as the body.

## PR body template

```
## What
<plain-language summary>

## Notable changes
<each new dependency / pattern / package, or "none (pure Extension)">

## Review checklist
- [ ] Stays within documented standards (CONVENTIONS.md)
- [ ] Docs updated (package README / CONTEXT.md / ADR if warranted)
- [ ] Data still mocked via SDKs (no real connections)
- [ ] Role visibility behaves correctly
```
