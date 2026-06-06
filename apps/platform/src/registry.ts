import { createRegistry } from "@aegis/platform-registry";
import { portfolioSnapshotManifest } from "@aegis/function-portfolio-snapshot";

/**
 * The host shell composes the Functions it mounts at build time (ADR 0001) and
 * aggregates their Manifests into the Registry. Adding a Function = import its
 * manifest and list it here; nav and routing pick it up automatically.
 */
export const registry = createRegistry([portfolioSnapshotManifest]);
