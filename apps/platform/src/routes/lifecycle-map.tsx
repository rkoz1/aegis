import { LIFECYCLE_STAGES } from "@aegis/platform-lifecycle";
import { useSession } from "@aegis/platform-session";
import { cn } from "@aegis/platform-ui";

import { registry } from "../registry";

/** A graphical view of the end-to-end Investment Lifecycle and where the
 *  Persona's Functions sit along it — terminal-style stage panels. */
export function LifecycleMap() {
  const persona = useSession((s) => s.activePersona);
  const visible = registry.visibleTo([persona]);

  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-xl font-semibold tracking-tight">Investment Lifecycle</h1>
        <p className="text-xs text-muted-foreground">
          End-to-end, front to back office. Functions available to you appear under
          their stage.
        </p>
      </header>

      <ol className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {LIFECYCLE_STAGES.map((stage, i) => {
          const fns = visible.filter((m) => m.category === stage.label);
          const populated = fns.length > 0;
          return (
            <li
              key={stage.id}
              className={cn(
                "border border-border bg-card",
                !populated && "opacity-50",
              )}
            >
              <div className="flex items-center justify-between border-b border-border px-3 py-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Stage {String(i + 1).padStart(2, "0")}
                </span>
                {populated && <span className="size-1.5 bg-primary" />}
              </div>
              <div className="px-3 py-2">
                <h2 className="text-sm font-medium">{stage.label}</h2>
                <ul className="mt-1.5 space-y-0.5">
                  {populated ? (
                    fns.map((f) => (
                      <li key={f.id} className="text-xs text-primary">
                        {f.label}
                      </li>
                    ))
                  ) : (
                    <li className="font-mono text-[10px] text-muted-foreground">—</li>
                  )}
                </ul>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
