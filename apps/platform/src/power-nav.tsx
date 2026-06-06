import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@aegis/platform-ui";
import { useSession } from "@aegis/platform-session";
import { useContextBus, makeContext, ContextTypes } from "@aegis/platform-context";

import { registry } from "./registry";
import { searchAggregator } from "./search";

function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] font-medium">
      {children}
    </kbd>
  );
}

function isTyping(el: Element | null): boolean {
  return (
    el instanceof HTMLElement &&
    (el.tagName === "INPUT" ||
      el.tagName === "TEXTAREA" ||
      el.isContentEditable)
  );
}

/**
 * Power-user keyboard navigation: a command palette (⌘K / /), a leader-key
 * hint system (g → go-to), and a shortcuts overlay (?). See docs/DESIGN.md.
 */
export function PowerNav() {
  const navigate = useNavigate();
  const persona = useSession((s) => s.activePersona);
  const setContext = useContextBus((s) => s.setContext);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [leader, setLeader] = useState<"g" | null>(null);
  const [query, setQuery] = useState("");

  const fns = registry.visibleTo([persona]);
  const goItems = [
    { id: "home", label: "Home", to: "/" },
    { id: "lifecycle", label: "Lifecycle Map", to: "/lifecycle" },
    ...fns.map((m) => ({ id: m.id, label: m.label, to: m.route })),
  ];
  // Leader (g + key) go-to map: h=Home, l=Lifecycle, then 1..9 = nth function.
  const leaderMap: Record<string, string> = {
    h: "/",
    l: "/lifecycle",
    ...Object.fromEntries(fns.slice(0, 9).map((m, i) => [String(i + 1), m.route])),
  };

  const { data } = useQuery({
    queryKey: ["palette-search", query, persona],
    queryFn: () => searchAggregator.search(query, { roles: [persona] }),
    enabled: paletteOpen && query.trim().length > 0,
  });
  const entityResults = (data ?? []).filter((r) => r.category === "Entities");

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
        return;
      }
      if (isTyping(document.activeElement)) return;

      if (leader === "g") {
        const to = leaderMap[e.key.toLowerCase()];
        if (to) {
          e.preventDefault();
          navigate({ to });
        }
        setLeader(null);
        return;
      }
      if (e.key === "/") {
        e.preventDefault();
        setPaletteOpen(true);
      } else if (e.key === "?") {
        e.preventDefault();
        setHelpOpen(true);
      } else if (e.key === "g") {
        e.preventDefault();
        setLeader("g");
        window.setTimeout(() => setLeader((c) => (c === "g" ? null : c)), 2500);
      } else if (e.key === "Escape") {
        setLeader(null);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [leader, leaderMap, navigate]);

  function goTo(to: string) {
    setPaletteOpen(false);
    setQuery("");
    navigate({ to });
  }

  function openEntity(entityType: string | undefined) {
    const handler = entityType
      ? fns.find((m) => m.entityTypes.includes(entityType as never))
      : undefined;
    if (handler) goTo(handler.route);
  }

  return (
    <>
      <CommandDialog open={paletteOpen} onOpenChange={setPaletteOpen}>
        <CommandInput
          placeholder="Search or jump to…"
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>No results.</CommandEmpty>
          <CommandGroup heading="Go to">
            {goItems.map((i) => (
              <CommandItem key={i.id} value={`go ${i.label}`} onSelect={() => goTo(i.to)}>
                {i.label}
              </CommandItem>
            ))}
          </CommandGroup>
          {entityResults.length > 0 && (
            <CommandGroup heading="Entities">
              {entityResults.map((r) => (
                <CommandItem
                  key={r.id}
                  value={r.label}
                  onSelect={() => {
                    if (r.entityType) {
                      setContext(
                        makeContext(ContextTypes.portfolio, { id: r.id, name: r.label }),
                      );
                    }
                    openEntity(r.entityType);
                  }}
                >
                  {r.label}
                  <span className="ml-auto text-xs text-muted-foreground">{r.kind}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>

      {leader === "g" && (
        <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 border border-border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-md">
          <span className="font-mono font-bold text-primary">g</span>
          <span className="text-muted-foreground">then</span>
          <span className="flex items-center gap-1">
            <Kbd>h</Kbd> Home
          </span>
          <span className="flex items-center gap-1">
            <Kbd>l</Kbd> Lifecycle
          </span>
          <span className="flex items-center gap-1">
            <Kbd>1–9</Kbd> Function
          </span>
        </div>
      )}

      <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Keyboard shortcuts</DialogTitle>
          </DialogHeader>
          <dl className="space-y-2 text-sm">
            {[
              ["⌘K / Ctrl K", "Command palette"],
              ["/", "Command palette (search)"],
              ["g then h / l / 1–9", "Go to Home / Lifecycle / nth function"],
              ["↑ / ↓", "Move row cursor in a table"],
              ["Enter / click row", "Select the row"],
              ["?", "This help"],
              ["Esc", "Close / cancel"],
            ].map(([keys, desc]) => (
              <div key={keys} className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">{desc}</span>
                <span className="font-mono text-xs">{keys}</span>
              </div>
            ))}
          </dl>
        </DialogContent>
      </Dialog>
    </>
  );
}
