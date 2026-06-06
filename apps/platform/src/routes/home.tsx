import { Link } from "@tanstack/react-router";
import { Button } from "@aegis/platform-ui";
import { useSession, ROLE_LABELS } from "@aegis/platform-session";

import { registry } from "../registry";

/** Landing page — lists the Functions visible to the active Persona. */
export function HomePage() {
  const activePersona = useSession((s) => s.activePersona);
  const items = registry.visibleTo([activePersona]);

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Welcome to Aegis</h1>
        <p className="text-sm text-muted-foreground">
          Acting as <strong>{ROLE_LABELS[activePersona]}</strong> —{" "}
          {items.length} Function(s) visible.
        </p>
      </header>
      <div className="flex flex-wrap gap-3">
        {items.map((m) => (
          <Button key={m.id} asChild variant="outline">
            <Link to={m.route}>{m.label}</Link>
          </Button>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No Functions are available to this persona yet.
          </p>
        )}
      </div>
    </section>
  );
}
