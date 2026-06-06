import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useActions, openActionsForRole, type Action } from "@aegis/platform-actions";
import { useSession } from "@aegis/platform-session";
import { useContextBus } from "@aegis/platform-context";

/** The Actions inbox — items assigned to the active Persona that deep-link into
 *  a target Function with their Context pre-loaded. */
export function ActionsInbox() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const persona = useSession((s) => s.activePersona);
  const actions = useActions((s) => s.actions);
  const resolve = useActions((s) => s.resolve);
  const setContext = useContextBus((s) => s.setContext);

  const mine = openActionsForRole(actions, persona);

  function openAction(a: Action) {
    if (a.context) setContext(a.context);
    resolve(a.id);
    setOpen(false);
    navigate({ to: a.targetRoute });
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-sm hover:bg-accent hover:text-accent-foreground"
      >
        Actions
        {mine.length > 0 && (
          <span className="rounded-full bg-primary px-1.5 text-xs font-medium text-primary-foreground">
            {mine.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-1 w-80 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md">
          {mine.length === 0 && (
            <p className="px-2 py-3 text-sm text-muted-foreground">
              No actions for this persona.
            </p>
          )}
          {mine.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => openAction(a)}
              className="block w-full rounded-sm px-2 py-2 text-left hover:bg-accent hover:text-accent-foreground"
            >
              <span className="text-sm font-medium">{a.label}</span>
              <span className="block text-xs text-muted-foreground">{a.reason}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
