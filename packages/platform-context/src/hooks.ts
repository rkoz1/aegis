import { useContextBus } from "./store";
import { matchesType } from "./helpers";
import type { AegisContext } from "./types";

/** React to the current Context only when it matches a given type, else null. */
export function useContextOfType(type: string): AegisContext | null {
  return useContextBus((s) => (matchesType(s.context, type) ? s.context : null));
}
