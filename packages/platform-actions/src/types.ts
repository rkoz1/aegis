import { z } from "zod";
import { ContextSchema } from "@aegis/platform-context";

export const ActionStatusSchema = z.enum(["open", "in-progress", "done"]);
export type ActionStatus = z.infer<typeof ActionStatusSchema>;

export const ActionKindSchema = z.enum(["review", "approval", "todo"]);
export type ActionKind = z.infer<typeof ActionKindSchema>;

/**
 * An assigned, status-tracked, Context-carrying deep-link into a target Function.
 * The platform renders and resolves Actions; it is not a workflow engine. See
 * CONTEXT.md (Action).
 */
export const ActionSchema = z.object({
  id: z.string(),
  label: z.string(),
  reason: z.string(),
  kind: ActionKindSchema,
  /** Role the Action is assigned to. */
  assigneeRole: z.string(),
  /** Where opening the Action navigates. */
  targetRoute: z.string(),
  /** Context pre-loaded when the Action is opened. */
  context: ContextSchema.nullable(),
  status: ActionStatusSchema,
});

export type Action = z.infer<typeof ActionSchema>;
