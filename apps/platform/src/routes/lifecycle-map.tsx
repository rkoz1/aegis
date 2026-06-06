import { LIFECYCLE_STAGES } from "@aegis/platform-lifecycle";
import { useSession } from "@aegis/platform-session";

import { registry } from "../registry";

/** A graphical view of the end-to-end Investment Lifecycle and where the
 *  Persona's Functions sit along it. See CONTEXT.md (Lifecycle Map). */
export function LifecycleMap() {
  const persona = useSession((s) => s.activePersona);
  const visible = registry.visibleTo([persona]);

  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Investment Lifecycle</h1>
        <p className="text-sm text-muted-foreground">
          End-to-end, front to back office. Functions available to you appear under
          their stage.
        </p>
      </header>

      <ol className="grid gap-3 md:grid-cols-3">
        {LIFECYCLE_STAGES.map((stage, i) => {
          const fns = visible.filter((m) => m.category === stage.label);
          const populated = fns.length > 0;
          return (
            <li
              key={stage.id}
              className={`rounded-lg border p-4 ${
                populated
                  ? "border-primary/40 bg-card"
                  : "border-border bg-card/40"
              }`}
            >
              <div className="text-xs font-medium text-muted-foreground">
                Stage {i + 1}
              </div>
              <h2 className="mt-0.5 font-medium text-card-foreground">{stage.label}</h2>
              <ul className="mt-2 space-y-1">
                {populated ? (
                  fns.map((f) => (
                    <li key={f.id} className="text-sm text-foreground">
                      • {f.label}
                    </li>
                  ))
                ) : (
                  <li className="text-xs text-muted-foreground">No functions yet</li>
                )}
              </ul>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
