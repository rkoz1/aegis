import { Bell } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useActions, openActionsForRole, type Action } from "@aegis/platform-actions";
import { useSession } from "@aegis/platform-session";
import { useContextBus } from "@aegis/platform-context";
import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@aegis/platform-ui";

/** The Actions inbox — items assigned to the active Persona that deep-link into
 *  a target Function with their Context pre-loaded. */
export function ActionsInbox() {
  const navigate = useNavigate();
  const persona = useSession((s) => s.activePersona);
  const actions = useActions((s) => s.actions);
  const resolve = useActions((s) => s.resolve);
  const setContext = useContextBus((s) => s.setContext);

  const mine = openActionsForRole(actions, persona);

  function openAction(a: Action) {
    if (a.context) setContext(a.context);
    resolve(a.id);
    navigate({ to: a.targetRoute });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Bell className="size-4" />
          Actions
          {mine.length > 0 && (
            <Badge className="px-1.5">{mine.length}</Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {mine.length === 0 && (
          <DropdownMenuItem disabled>No actions for this persona.</DropdownMenuItem>
        )}
        {mine.map((a) => (
          <DropdownMenuItem
            key={a.id}
            onSelect={() => openAction(a)}
            className="flex-col items-start gap-0.5"
          >
            <span className="text-sm font-medium">{a.label}</span>
            <span className="text-xs text-muted-foreground">{a.reason}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
