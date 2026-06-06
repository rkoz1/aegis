import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { useSession, ROLE_LABELS } from "@aegis/platform-session";
import { groupByStage } from "@aegis/platform-lifecycle";

import { registry } from "../registry";

/** Command Center — a dense, lifecycle-grouped directory of available Functions. */
export function HomePage() {
  const activePersona = useSession((s) => s.activePersona);
  const items = registry.visibleTo([activePersona]);
  const groups = groupByStage(items);

  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-xl font-semibold tracking-tight">Command Center</h1>
        <p className="text-xs text-muted-foreground">
          Acting as <span className="text-foreground">{ROLE_LABELS[activePersona]}</span>{" "}
          · {items.length} function(s) available
        </p>
      </header>

      {items.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          No functions are available to this persona.
        </p>
      ) : (
        <div className="max-w-2xl divide-y divide-border border border-border bg-card">
          {groups.map((g) => (
            <div key={g.stage.id}>
              <div className="bg-muted/40 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {g.stage.label}
              </div>
              {g.items.map((m) => (
                <Link
                  key={m.id}
                  to={m.route}
                  className="flex items-center justify-between px-3 py-2 hover:bg-accent"
                >
                  <span className="text-sm font-medium text-primary">{m.label}</span>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
