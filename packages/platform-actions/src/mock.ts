import { makeContext, ContextTypes } from "@aegis/platform-context";

import type { Action } from "./types";

/** Seed Actions so the inbox/attention UX is demonstrable in V1. */
export const MOCK_ACTIONS: Action[] = [
  {
    id: "act-001",
    label: "Review mandate breach — Meridian Pension",
    reason: "Holdings count exceeds mandate threshold.",
    kind: "review",
    assigneeRole: "compliance-officer",
    targetRoute: "/compliance-checks",
    context: makeContext(ContextTypes.portfolio, {
      id: "pf-003",
      name: "Meridian Pension — Liability Matching",
    }),
    status: "open",
  },
  {
    id: "act-002",
    label: "Rebalance overdue — Smith Growth",
    reason: "Drift beyond tolerance since last rebalance.",
    kind: "todo",
    assigneeRole: "portfolio-manager",
    targetRoute: "/portfolio-snapshot",
    context: makeContext(ContextTypes.portfolio, {
      id: "pf-002",
      name: "Smith Family Trust — Growth",
    }),
    status: "open",
  },
  {
    id: "act-003",
    label: "Confirm balanced allocation — Smith Balanced",
    reason: "Quarterly review due.",
    kind: "approval",
    assigneeRole: "portfolio-manager",
    targetRoute: "/portfolio-snapshot",
    context: makeContext(ContextTypes.portfolio, {
      id: "pf-001",
      name: "Smith Family Trust — Balanced",
    }),
    status: "open",
  },
];
