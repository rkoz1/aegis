import type { FunctionManifest } from "@aegis/platform-registry";
import { useSession } from "@aegis/platform-session";
import { Card, CardDescription, CardHeader, CardTitle } from "@aegis/platform-ui";

/**
 * Wraps a mounted Function with a visibility check, so a Function hidden from
 * the active Persona is not reachable by direct URL.
 */
export function Guarded({ manifest }: { manifest: FunctionManifest }) {
  const activePersona = useSession((s) => s.activePersona);
  const visible =
    manifest.requiredRoles.length === 0 ||
    manifest.requiredRoles.includes(activePersona);

  if (!visible) {
    return (
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Access restricted</CardTitle>
          <CardDescription>
            “{manifest.label}” isn’t available to the current persona.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const Mount = manifest.mount;
  return <Mount />;
}
