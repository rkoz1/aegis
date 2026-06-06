import { useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { groupResults, type SearchResult } from "@aegis/platform-search";
import { useSession } from "@aegis/platform-session";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  Input,
} from "@aegis/platform-ui";

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
    <div className="relative w-full min-w-0 max-w-md">
      <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        value={query}
        placeholder="Search applications, functions, entities…"
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setOpen(true)}
        onBlur={() => window.setTimeout(() => setOpen(false), 150)}
        className="pl-8"
      />

      {showDropdown && (
        <div
          // Keep input focus when clicking a result so navigation fires.
          onMouseDown={(e) => e.preventDefault()}
          className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border border-border bg-popover shadow-md"
        >
          <Command shouldFilter={false}>
            <CommandList>
              {groups.length === 0 && (
                <p className="px-3 py-4 text-sm text-muted-foreground">No results.</p>
              )}
              {groups.map((group) => (
                <CommandGroup key={group.category} heading={group.category}>
                  {group.results.map((r) => (
                    <CommandItem
                      key={r.id}
                      value={r.id}
                      onSelect={() => go(r)}
                      className="justify-between"
                    >
                      <span>{r.label}</span>
                      <span className="text-xs text-muted-foreground">{r.kind}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
}
