# @aegis/platform-session

**Purpose** — Identity and active Persona. A mock User holding Roles, plus the Zustand session store (Persona = active Role).

**Public surface** — `ROLES`, `ROLE_LABELS`, `Role`, `MOCK_USER`, `User`, `useSession` (`user`, `activePersona`, `setActivePersona`).

**Dependencies** — `zustand`; React (peer).

**Status** — live (mock identity; no real auth in V1).
