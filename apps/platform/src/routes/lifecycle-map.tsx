import { LIFECYCLE_STAGES } from "@aegis/platform-lifecycle";
import { useSession } from "@aegis/platform-session";
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  cn,
} from "@aegis/platform-ui";

import { registry } from "../registry";

/** A graphical view of the end-to-end Investment Lifecycle and where the
 *  Persona's Functions sit along it. */
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
            <li key={stage.id}>
              <Card
                className={cn(
                  "h-full",
                  populated ? "border-primary/40" : "opacity-60",
                )}
              >
                <CardHeader>
                  <Badge variant="outline" className="w-fit">
                    Stage {i + 1}
                  </Badge>
                  <CardTitle className="text-base">{stage.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  {populated ? (
                    <ul className="space-y-1">
                      {fns.map((f) => (
                        <li key={f.id} className="text-sm">
                          • {f.label}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-muted-foreground">No functions yet</p>
                  )}
                </CardContent>
              </Card>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
