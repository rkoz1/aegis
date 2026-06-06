import type { FunctionManifest } from "./manifest";

/**
 * Aggregates Function Manifests into the single source of truth for what exists
 * and who may see it. Build-time composition (ADR 0001): the host shell passes
 * in the Manifests it composes.
 */
export function createRegistry(manifests: FunctionManifest[]) {
  return {
    all: (): FunctionManifest[] => manifests,
    byRoute: (route: string): FunctionManifest | undefined =>
      manifests.find((m) => m.route === route),
    /** Manifests visible to a set of Roles (empty requiredRoles = visible to all). */
    visibleTo: (roles: string[]): FunctionManifest[] =>
      manifests.filter(
        (m) =>
          m.requiredRoles.length === 0 ||
          m.requiredRoles.some((r) => roles.includes(r)),
      ),
  };
}

export type Registry = ReturnType<typeof createRegistry>;
