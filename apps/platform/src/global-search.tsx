import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { groupResults, type SearchResult } from "@aegis/platform-search";
import { useSession } from "@aegis/platform-session";

import { registry } from "./registry";
import { searchAggregator } from "./search";

/** Resolve where a result navigates: Functions use their route; Entities deep-link
 *  to a visible Function that handles that Entity type. */
function resolveTarget(result: SearchResult, roles: string[]): string | undefined {
  if (result.route) return result.route;
  if (result.entityType) {
    const handler = registry
      .visibleTo(roles)
      .find((m) => m.entityTypes.includes(result.entityType!));
    return handler?.route;
  }
  return undefined;
}

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const activePersona = useSession((s) => s.activePersona);
  const roles = [activePersona];

  const { data } = useQuery({
    queryKey: ["global-search", query, activePersona],
    queryFn: () => searchAggregator.search(query, { roles }),
    enabled: query.trim().length > 0,
  });

  const groups = groupResults(data ?? []);

  function go(result: SearchResult) {
    const to = resolveTarget(result, roles);
    setQuery("");
    setOpen(false);
    if (to) navigate({ to });
  }

  const showDropdown = open && query.trim().length > 0;

  return (
    <div className="relative w-full max-w-md">
      <input
        type="search"
        value={query}
        placeholder="Search applications, functions, entities…"
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setOpen(true)}
        onBlur={() => window.setTimeout(() => setOpen(false), 150)}
        className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      />

      {showDropdown && (
        <div className="absolute z-10 mt-1 w-full rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md">
          {groups.length === 0 && (
            <p className="px-2 py-3 text-sm text-muted-foreground">No results.</p>
          )}
          {groups.map((group) => (
            <div key={group.category} className="py-1">
              <p className="px-2 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {group.category}
              </p>
              {group.results.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  // onMouseDown (not onClick) fires before the input's onBlur.
                  onMouseDown={() => go(r)}
                  className="flex w-full items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                >
                  <span>{r.label}</span>
                  <span className="text-xs text-muted-foreground">{r.kind}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
