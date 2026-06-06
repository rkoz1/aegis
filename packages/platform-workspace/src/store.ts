import { create } from "zustand";
import { useSession } from "@aegis/platform-session";
import { useContextBus } from "@aegis/platform-context";

import type { Workspace } from "./types";

function newId(): string {
  return globalThis.crypto.randomUUID();
}

interface WorkspaceState {
  workspaces: Workspace[];
  activeId: string | null;
  /** Snapshot the current persona + Context into a new Workspace. */
  capture: (name: string, route: string) => Workspace;
  /** Apply a saved Workspace (sets persona + Context); returns its route. */
  activate: (id: string) => string | null;
  remove: (id: string) => void;
}

/**
 * The Workspace store. A Workspace is a saved bundle of session + Context; this
 * store orchestrates those stores rather than owning a second source of truth.
 */
export const useWorkspaces = create<WorkspaceState>((set, get) => ({
  workspaces: [],
  activeId: null,

  capture: (name, route) => {
    const ws: Workspace = {
      id: newId(),
      name,
      persona: useSession.getState().activePersona,
      context: useContextBus.getState().context,
      route,
    };
    set((s) => ({ workspaces: [...s.workspaces, ws], activeId: ws.id }));
    return ws;
  },

  activate: (id) => {
    const ws = get().workspaces.find((w) => w.id === id);
    if (!ws) return null;
    useSession.getState().setActivePersona(ws.persona);
    useContextBus.getState().setContext(ws.context);
    set({ activeId: id });
    return ws.route;
  },

  remove: (id) =>
    set((s) => ({
      workspaces: s.workspaces.filter((w) => w.id !== id),
      activeId: s.activeId === id ? null : s.activeId,
    })),
}));
