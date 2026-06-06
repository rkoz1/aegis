import { create } from "zustand";

import type { Action } from "./types";
import { MOCK_ACTIONS } from "./mock";

interface ActionsState {
  actions: Action[];
  /** Mark an Action done (resolved). */
  resolve: (id: string) => void;
}

export const useActions = create<ActionsState>((set) => ({
  actions: MOCK_ACTIONS,
  resolve: (id) =>
    set((s) => ({
      actions: s.actions.map((a) =>
        a.id === id ? { ...a, status: "done" } : a,
      ),
    })),
}));

/** Open (unresolved) Actions assigned to a Role. Pure — reused by the hook + tests. */
export function openActionsForRole(actions: Action[], role: string): Action[] {
  return actions.filter((a) => a.assigneeRole === role && a.status !== "done");
}
