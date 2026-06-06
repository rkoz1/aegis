import { z } from "zod";

/**
 * The Context payload passed on the Context Bus. FDC3-inspired "strict core,
 * open extensions": a mandatory `type` discriminator plus standard optional
 * fields, with any additional (namespaced) fields allowed via catchall. See
 * CONTEXT.md (Context) — the shape will tighten per-type as the platform grows.
 */
export const ContextSchema = z
  .object({
    type: z.string(),
    id: z.string().optional(),
    name: z.string().optional(),
  })
  .catchall(z.unknown());

export type AegisContext = z.infer<typeof ContextSchema>;

/** Canonical Context type strings. */
export const ContextTypes = {
  portfolio: "aegis.portfolio",
} as const;
