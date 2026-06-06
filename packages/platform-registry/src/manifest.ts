import type { FunctionComponent } from "react";
import type { EntityType } from "@aegis/models";

/**
 * A Function's public identity card. The Function's implementation stays private
 * behind it; the Registry aggregates Manifests to drive search, visibility, and
 * routing. See CONTEXT.md (Manifest, Registry) and ADR 0001.
 *
 * The shape will be sharpened (and likely Zod-validated) as more Functions land;
 * kept minimal for the Phase 0 spine.
 */
export interface FunctionManifest {
  /** Stable unique id. */
  id: string;
  /** Human label shown in nav and search. */
  label: string;
  /** Investment Lifecycle stage / nav grouping. */
  category: string;
  /** Entity types this Function operates on. */
  entityTypes: EntityType[];
  /** Roles allowed to see it; empty means visible to all. */
  requiredRoles: string[];
  /** Route the host shell mounts it on. */
  route: string;
  /** The component the shell renders. */
  mount: FunctionComponent;
}
