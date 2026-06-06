import { create } from "zustand";

import type { Role } from "./roles";
import { MOCK_USER, type User } from "./user";

interface SessionState {
  /** The signed-in User. */
  user: User;
  /** The currently-active Role — the Persona. Scopes visibility. */
  activePersona: Role;
  /** Switch the active Persona (must be one of the user's Roles). */
  setActivePersona: (role: Role) => void;
}

/**
 * The session store. In V1 this holds the mock User and the active Persona.
 * Built on Zustand — the same store technology the Context Bus uses (Phase 3).
 */
export const useSession = create<SessionState>((set) => ({
  user: MOCK_USER,
  activePersona: "portfolio-manager",
  setActivePersona: (role) => set({ activePersona: role }),
}));
