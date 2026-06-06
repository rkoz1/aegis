import { useSession, ROLE_LABELS, type Role } from "@aegis/platform-session";

/** Switches the active Persona among the signed-in User's Roles. */
export function PersonaSwitcher() {
  const user = useSession((s) => s.user);
  const activePersona = useSession((s) => s.activePersona);
  const setActivePersona = useSession((s) => s.setActivePersona);

  return (
    <div className="space-y-1">
      <label
        htmlFor="persona"
        className="text-xs font-medium text-muted-foreground"
      >
        Persona
      </label>
      <select
        id="persona"
        value={activePersona}
        onChange={(e) => setActivePersona(e.target.value as Role)}
        className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        {user.roles.map((r) => (
          <option key={r} value={r}>
            {ROLE_LABELS[r]}
          </option>
        ))}
      </select>
    </div>
  );
}
