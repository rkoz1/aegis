import { Link, Outlet } from "@tanstack/react-router";
import { useSession } from "@aegis/platform-session";

import { registry } from "../registry";
import { PersonaSwitcher } from "../persona-switcher";
import { GlobalSearch } from "../global-search";

const linkBase =
  "block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground";
const linkActive = "bg-accent text-accent-foreground";

/** The host shell chrome: top bar with global search, sidebar with persona +
 *  Persona-scoped nav, and the routed Function. */
export function RootLayout() {
  const user = useSession((s) => s.user);
  const activePersona = useSession((s) => s.activePersona);
  const items = registry.visibleTo([activePersona]);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-14 shrink-0 items-center gap-4 border-b border-border bg-card px-4">
        <span className="text-lg font-semibold">Aegis</span>
        <GlobalSearch />
      </header>

      <div className="flex flex-1">
        <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-card p-4">
          <div className="mb-6">
            <PersonaSwitcher />
            <p className="mt-2 text-xs text-muted-foreground">
              Signed in as {user.name}
            </p>
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
    </div>
  );
}
