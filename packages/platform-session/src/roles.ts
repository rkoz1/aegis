/**
 * The flat, small set of Roles (Aegis is a small company — no hierarchy, see
 * CONTEXT.md). A Persona is the currently-active Role.
 */
export const ROLES = [
  "portfolio-manager",
  "compliance-officer",
  "client-portal",
] as const;

export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  "portfolio-manager": "Portfolio Manager",
  "compliance-officer": "Compliance Officer",
  "client-portal": "Client (Portal)",
};
