import { Link } from "@tanstack/react-router";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@aegis/platform-ui";
import { useSession, ROLE_LABELS } from "@aegis/platform-session";

import { registry } from "../registry";

/** Landing page — the Functions visible to the active Persona, as cards. */
export function HomePage() {
  const activePersona = useSession((s) => s.activePersona);
  const items = registry.visibleTo([activePersona]);

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Welcome to Aegis</h1>
        <p className="text-sm text-muted-foreground">
          Acting as <strong>{ROLE_LABELS[activePersona]}</strong> — {items.length}{" "}
          Function(s) visible.
        </p>
      </header>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No Functions are available to this persona yet.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((m) => (
            <Card key={m.id} className="flex flex-col">
              <CardHeader className="flex-1">
                <CardTitle className="text-base">{m.label}</CardTitle>
                <CardDescription>{m.category}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" size="sm">
                  <Link to={m.route}>Open</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
