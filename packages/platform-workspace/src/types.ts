import type { Role } from "@aegis/platform-session";
import type { AegisContext } from "@aegis/platform-context";

/**
 * A named, switchable snapshot of the platform context — persona + current
 * Context + the open route. Built on the same data the Context Bus and session
 * hold, so a shared Workspace is a shared link. See CONTEXT.md (Workspace).
 */
export interface Workspace {
  id: string;
  name: string;
  persona: Role;
  context: AegisContext | null;
  route: string;
}
