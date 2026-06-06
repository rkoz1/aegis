import type { EntityType } from "@aegis/models";

/** Top-level grouping for results, matching the platform's three searchable kinds. */
export type SearchCategory = "Applications" | "Functions" | "Entities";

/** A single ranked result, conforming loosely to the Entity base shape. */
export interface SearchResult {
  id: string;
  label: string;
  category: SearchCategory;
  /** "function" for Function/App results, or the Entity type for Entity results. */
  kind: EntityType | "function";
  /** For Entity results — used by the shell to resolve a navigation target. */
  entityType?: EntityType;
  /** For Function/App results — the route to navigate to. */
  route?: string;
  /** Roles allowed to see this result; empty = visible to all. */
  requiredRoles: string[];
  /** Relevance score; higher ranks first. */
  score: number;
}

/** Context passed to providers so results can be scoped and ranked. */
export interface SearchContext {
  roles: string[];
}

/** A registered source answering a query for one slice of the platform. */
export interface SearchProvider {
  id: string;
  search(
    query: string,
    ctx: SearchContext,
  ): Promise<SearchResult[]> | SearchResult[];
}
