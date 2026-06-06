import type {
  SearchCategory,
  SearchContext,
  SearchProvider,
  SearchResult,
} from "./types";

/**
 * Fans out a query to all Search Providers, filters by the active Persona's Role
 * visibility, and ranks. A provider that throws is skipped, not fatal.
 */
export function createSearchAggregator(providers: SearchProvider[]) {
  return {
    async search(query: string, ctx: SearchContext): Promise<SearchResult[]> {
      const q = query.trim();
      if (!q) return [];

      const settled = await Promise.all(
        providers.map(async (p) => {
          try {
            return await p.search(q, ctx);
          } catch {
            return [] as SearchResult[];
          }
        }),
      );

      const visible = settled
        .flat()
        .filter(
          (r) =>
            r.requiredRoles.length === 0 ||
            r.requiredRoles.some((role) => ctx.roles.includes(role)),
        );

      return visible.sort(
        (a, b) => b.score - a.score || a.label.localeCompare(b.label),
      );
    },
  };
}

const CATEGORY_ORDER: SearchCategory[] = [
  "Applications",
  "Functions",
  "Entities",
];

export interface SearchGroup {
  category: SearchCategory;
  results: SearchResult[];
}

/** Group ranked results by category, capping each group ("top N, see all"). */
export function groupResults(
  results: SearchResult[],
  perGroup = 5,
): SearchGroup[] {
  const groups = new Map<SearchCategory, SearchResult[]>();
  for (const r of results) {
    const list = groups.get(r.category) ?? [];
    if (list.length < perGroup) list.push(r);
    groups.set(r.category, list);
  }
  return CATEGORY_ORDER.filter((c) => groups.has(c)).map((c) => ({
    category: c,
    results: groups.get(c) ?? [],
  }));
}
