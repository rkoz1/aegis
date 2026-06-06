import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@aegis/platform-ui";
import { useSession, ROLE_LABELS, type Role } from "@aegis/platform-session";

/** Switches the active Persona among the signed-in User's Roles. */
export function PersonaSwitcher() {
  const user = useSession((s) => s.user);
  const activePersona = useSession((s) => s.activePersona);
  const setActivePersona = useSession((s) => s.setActivePersona);

  return (
    <Select
      value={activePersona}
      onValueChange={(v) => setActivePersona(v as Role)}
    >
      <SelectTrigger aria-label="Persona" className="w-full" size="sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {user.roles.map((r) => (
          <SelectItem key={r} value={r}>
            {ROLE_LABELS[r]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
