import { describe, it, expect, beforeEach } from "vitest";

import { ActionSchema } from "./types";
import { MOCK_ACTIONS } from "./mock";
import { useActions, openActionsForRole } from "./store";

describe("Action schema", () => {
  it("validates the mock actions", () => {
    for (const a of MOCK_ACTIONS) {
      expect(() => ActionSchema.parse(a)).not.toThrow();
    }
  });
});

describe("openActionsForRole", () => {
  it("filters by assignee role and excludes resolved", () => {
    const pm = openActionsForRole(MOCK_ACTIONS, "portfolio-manager");
    expect(pm.map((a) => a.id)).toEqual(["act-002", "act-003"]);
    expect(openActionsForRole(MOCK_ACTIONS, "compliance-officer")).toHaveLength(1);
    expect(openActionsForRole(MOCK_ACTIONS, "client-portal")).toHaveLength(0);
  });
});

describe("actions store", () => {
  beforeEach(() => useActions.setState({ actions: MOCK_ACTIONS }));

  it("resolve() marks an action done and drops it from the open list", () => {
    useActions.getState().resolve("act-002");
    const open = openActionsForRole(useActions.getState().actions, "portfolio-manager");
    expect(open.map((a) => a.id)).toEqual(["act-003"]);
  });
});
