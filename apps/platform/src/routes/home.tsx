import { Link } from "@tanstack/react-router";
import { Button } from "@aegis/platform-ui";

import { registry } from "../registry";

/** Landing page — lists the mounted Functions from the Registry. */
export function HomePage() {
  const items = registry.all();

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Welcome to Aegis</h1>
        <p className="text-sm text-muted-foreground">
          Phase 0 spine — {items.length} Function(s) mounted via the Registry.
        </p>
      </header>
      <div className="flex flex-wrap gap-3">
        {items.map((m) => (
          <Button key={m.id} asChild variant="outline">
            <Link to={m.route}>{m.label}</Link>
          </Button>
        ))}
      </div>
    </section>
  );
}
