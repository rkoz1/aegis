# @aegis/platform-search

**Purpose** — Global Search federation: aggregates Search Providers, filters by Role visibility, and ranks with an id-aware intent layer so results are relevant, not generic.

**Public surface** — `createSearchAggregator`, `groupResults`, `manifestProvider`, `entityProvider`, `scoreLabel`/`scoreId`/`looksLikeId`, and the `SearchResult`/`SearchProvider`/`SearchContext` types.

**Dependencies** — `@aegis/models`. Decoupled from registry/SDK concrete types — the app adapts them into providers.

**Tests** — `search.test.ts` (scoring, role filter, ranking, grouping).

**Status** — live.
