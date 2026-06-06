import type { FunctionManifest } from "@aegis/platform-registry";
import { useSession } from "@aegis/platform-session";

/**
 * Wraps a mounted Function with a visibility check, so a Function hidden from
 * the active Persona is not reachable by direct URL — Role visibility, not just
 * a filtered nav.
 */
export function Guarded({ manifest }: { manifest: FunctionManifest }) {
  const activePersona = useSession((s) => s.activePersona);
  const visible =
    manifest.requiredRoles.length === 0 ||
    manifest.requiredRoles.includes(activePersona);

  if (!visible) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-card-foreground">
        <h1 className="text-lg font-semibold">Access restricted</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          “{manifest.label}” isn’t available to the current persona.
        </p>
      </div>
    );
  }

  const Mount = manifest.mount;
  return <Mount />;
}
