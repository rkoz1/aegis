import { ContextSchema, type AegisContext } from "./types";

/** Build a validated Context. Extra fields are allowed (open extensions). */
export function makeContext(
  type: string,
  fields: { id?: string; name?: string } & Record<string, unknown> = {},
): AegisContext {
  return ContextSchema.parse({ type, ...fields });
}

/** Type guard: is the current Context of the given type? */
export function matchesType(
  context: AegisContext | null,
  type: string,
): context is AegisContext {
  return context?.type === type;
}
