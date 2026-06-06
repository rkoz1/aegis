import type { EntityBase, EntityType } from "@aegis/models";

import type { SearchCategory, SearchProvider, SearchResult } from "./types";
import { scoreId, scoreLabel } from "./scoring";

/** The minimal manifest shape the registry provider needs. */
export interface ManifestSearchItem {
  id: string;
  label: string;
  category: string;
  route: string;
  requiredRoles: string[];
}

/**
 * Searches Applications/Functions from the Registry. The app passes a getter so
 * platform-search stays decoupled from platform-registry's concrete types.
 */
export function manifestProvider(
  getItems: () => ManifestSearchItem[],
  opts: { id?: string; category?: SearchCategory } = {},
): SearchProvider {
  const category = opts.category ?? "Functions";
  return {
    id: opts.id ?? "registry",
    search(query) {
      return getItems()
        .map((m): SearchResult | null => {
          const score = Math.max(
            scoreLabel(query, m.label),
            Math.round(scoreLabel(query, m.category) * 0.6),
          );
          if (score <= 0) return null;
          return {
            id: `fn:${m.id}`,
            label: m.label,
            category,
            kind: "function",
            route: m.route,
            requiredRoles: m.requiredRoles,
            score,
          };
        })
        .filter((r): r is SearchResult => r !== null);
    },
  };
}

/**
 * Adapts a domain SDK's search into a SearchProvider. The SDK returns Entities
 * (conforming to EntityBase); this ranks them. Keeps SDKs free of search types.
 */
export function entityProvider(opts: {
  id: string;
  entityType: EntityType;
  visibleToRoles?: string[];
  search: (query: string) => Promise<EntityBase[]> | EntityBase[];
}): SearchProvider {
  const requiredRoles = opts.visibleToRoles ?? [];
  return {
    id: opts.id,
    async search(query) {
      const items = await opts.search(query);
      return items.map((e): SearchResult => {
        // Floor of 10 so an SDK match on a non-label/id field (e.g. strategy)
        // still surfaces, while label/id matches rank higher.
        const score = Math.max(scoreLabel(query, e.label), scoreId(query, e.id)) || 10;
        return {
          id: `${e.type}:${e.id}`,
          label: e.label,
          category: "Entities",
          kind: e.type,
          entityType: e.type,
          requiredRoles,
          score,
        };
      });
    },
  };
}
