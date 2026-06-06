import type { FunctionManifest } from "@aegis/platform-registry";
import { ComplianceChecks } from "./compliance-checks";

/** Restricted to compliance and portfolio-manager personas. */
export const complianceChecksManifest: FunctionManifest = {
  id: "compliance-checks",
  label: "Compliance Checks",
  category: "Pre-Trade",
  entityTypes: ["portfolio"],
  requiredRoles: ["compliance-officer", "portfolio-manager"],
  route: "/compliance-checks",
  mount: ComplianceChecks,
};
