import type { FunctionManifest } from "@aegis/platform-registry";
import { PortfolioSnapshot } from "./portfolio-snapshot";

/** The Function's public identity card. See ADR 0001. */
export const portfolioSnapshotManifest: FunctionManifest = {
  id: "portfolio-snapshot",
  label: "Portfolio Snapshot",
  category: "Portfolio Construction",
  entityTypes: ["portfolio"],
  requiredRoles: ["portfolio-manager", "client-portal"],
  route: "/portfolio-snapshot",
  mount: PortfolioSnapshot,
};
