import { Link, Outlet } from "@tanstack/react-router";

import { registry } from "../registry";

const linkBase =
  "block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground";
const linkActive = "bg-accent text-accent-foreground";

/** The host shell chrome: nav driven by the Registry + the routed Function. */
export function RootLayout() {
  const items = registry.all();

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 shrink-0 border-r border-border bg-card p-4">
        <div className="mb-6">
          <span className="text-lg font-semibold">Aegis</span>
          <p className="text-xs text-muted-foreground">Wealth Platform</p>
        </div>
        <nav className="space-y-1">
          <Link
            to="/"
            activeOptions={{ exact: true }}
            className={linkBase}
            activeProps={{ className: `${linkBase} ${linkActive}` }}
          >
            Home
          </Link>
          {items.map((m) => (
            <Link
              key={m.id}
              to={m.route}
              className={linkBase}
              activeProps={{ className: `${linkBase} ${linkActive}` }}
            >
              {m.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
