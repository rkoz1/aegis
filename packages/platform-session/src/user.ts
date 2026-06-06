import type { Role } from "./roles";

/** An authenticated human identity. V1 is a mock identity (no real auth). */
export interface User {
  id: string;
  name: string;
  roles: Role[];
}

/** The mock signed-in User. Holds several Roles so the Persona switcher has
 *  something to switch between. */
export const MOCK_USER: User = {
  id: "u-001",
  name: "Alex Morgan",
  roles: ["portfolio-manager", "compliance-officer", "client-portal"],
};
