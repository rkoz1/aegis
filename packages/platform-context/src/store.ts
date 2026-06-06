import { create } from "zustand";

import type { AegisContext } from "./types";

interface ContextBusState {
  /** The current Context on the bus, or null. */
  context: AegisContext | null;
  /** Emit a Context (replaces the current one). */
  setContext: (context: AegisContext | null) => void;
  /** Clear the current Context. */
  clear: () => void;
}

/**
 * The Context Bus. Functions never call each other — they emit and react to
 * Context here. In-app it lives in Zustand; cross-Application/shareable it will
 * serialize to URL search params (Phase 4). See CONTEXT.md (Context Bus).
 */
export const useContextBus = create<ContextBusState>((set) => ({
  context: null,
  setContext: (context) => set({ context }),
  clear: () => set({ context: null }),
}));
