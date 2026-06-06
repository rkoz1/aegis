import { useState } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useWorkspaces, toSearchParams } from "@aegis/platform-workspace";
import { useSession, ROLE_LABELS } from "@aegis/platform-session";
import { useContextBus } from "@aegis/platform-context";
import { Button } from "@aegis/platform-ui";

/** Save, switch, and share Workspaces (named snapshots of persona + Context). */
export function WorkspaceBar() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const workspaces = useWorkspaces((s) => s.workspaces);
  const activeId = useWorkspaces((s) => s.activeId);
  const capture = useWorkspaces((s) => s.capture);
  const activate = useWorkspaces((s) => s.activate);
  const persona = useSession((s) => s.activePersona);
  const context = useContextBus((s) => s.context);
  const [copied, setCopied] = useState(false);

  function onNew() {
    const name = context?.name
      ? `${ROLE_LABELS[persona]} · ${context.name}`
      : ROLE_LABELS[persona];
    capture(name, pathname);
  }

  function onSwitch(id: string) {
    const route = activate(id);
    if (route) navigate({ to: route });
  }

  async function onShare() {
    const qs = toSearchParams({ persona, route: pathname, context });
    const url = `${window.location.origin}${window.location.pathname}?${qs}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="space-y-2 px-2">
      <span className="text-xs font-medium text-muted-foreground">Workspaces</span>
      <div className="space-y-1">
        {workspaces.length === 0 && (
          <p className="text-xs text-muted-foreground">None saved</p>
        )}
        {workspaces.map((w) => (
          <Button
            key={w.id}
            variant={w.id === activeId ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onSwitch(w.id)}
            className="w-full justify-start truncate text-xs"
          >
            {w.name}
          </Button>
        ))}
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={onNew}>
          New
        </Button>
        <Button size="sm" variant="ghost" onClick={onShare}>
          {copied ? "Copied!" : "Share"}
        </Button>
      </div>
    </div>
  );
}
