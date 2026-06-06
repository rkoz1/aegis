import { z } from "zod";
import { ContextSchema, type AegisContext } from "@aegis/platform-context";

/** The restorable slice of a Workspace, as carried in a shareable URL. */
export const WorkspaceParamsSchema = z.object({
  persona: z.string(),
  route: z.string().default("/"),
  ctxType: z.string().optional(),
  ctxId: z.string().optional(),
  ctxName: z.string().optional(),
});

export interface RestorableState {
  persona: string;
  route: string;
  context: AegisContext | null;
}

/** Serialize restorable state to URL search params (for shareable links). */
export function toSearchParams(input: RestorableState): string {
  const params = new URLSearchParams();
  params.set("persona", input.persona);
  params.set("route", input.route);
  if (input.context) {
    params.set("ctxType", input.context.type);
    if (input.context.id) params.set("ctxId", input.context.id);
    if (input.context.name) params.set("ctxName", input.context.name);
  }
  return params.toString();
}

/** Parse restorable state from a URL search string, or null if absent/invalid. */
export function fromSearchParams(search: string): RestorableState | null {
  const params = new URLSearchParams(search);
  if (!params.has("persona")) return null;

  const parsed = WorkspaceParamsSchema.safeParse({
    persona: params.get("persona"),
    route: params.get("route") ?? "/",
    ctxType: params.get("ctxType") ?? undefined,
    ctxId: params.get("ctxId") ?? undefined,
    ctxName: params.get("ctxName") ?? undefined,
  });
  if (!parsed.success) return null;

  const { persona, route, ctxType, ctxId, ctxName } = parsed.data;
  const context = ctxType
    ? ContextSchema.parse({ type: ctxType, id: ctxId, name: ctxName })
    : null;

  return { persona, route, context };
}
