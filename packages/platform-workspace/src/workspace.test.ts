import { describe, it, expect, beforeEach } from "vitest";
import { useSession } from "@aegis/platform-session";
import {
  useContextBus,
  makeContext,
  ContextTypes,
} from "@aegis/platform-context";

import { toSearchParams, fromSearchParams } from "./serialize";
import { useWorkspaces } from "./store";

describe("workspace serialize (shareable links)", () => {
  it("round-trips persona + context + route", () => {
    const ctx = makeContext(ContextTypes.portfolio, { id: "pf-001", name: "Smith" });
    const qs = toSearchParams({
      persona: "compliance-officer",
      route: "/compliance-checks",
      context: ctx,
    });
    const back = fromSearchParams(`?${qs}`);
    expect(back?.persona).toBe("compliance-officer");
    expect(back?.route).toBe("/compliance-checks");
    expect(back?.context?.id).toBe("pf-001");
    expect(back?.context?.type).toBe("aegis.portfolio");
  });

  it("returns null when there is no persona param", () => {
    expect(fromSearchParams("?foo=bar")).toBeNull();
  });

  it("handles the no-context case", () => {
    const qs = toSearchParams({ persona: "portfolio-manager", route: "/", context: null });
    expect(fromSearchParams(`?${qs}`)?.context).toBeNull();
  });
});

describe("workspace store (orchestrates session + context)", () => {
  beforeEach(() => {
    useWorkspaces.setState({ workspaces: [], activeId: null });
    useSession.getState().setActivePersona("portfolio-manager");
    useContextBus.getState().clear();
  });

  it("captures snapshots and restores persona + Context on activate", () => {
    const a = useWorkspaces.getState().capture("A", "/portfolio-snapshot");

    useSession.getState().setActivePersona("compliance-officer");
    useContextBus
      .getState()
      .setContext(makeContext(ContextTypes.portfolio, { id: "pf-003", name: "Meridian" }));
    const b = useWorkspaces.getState().capture("B", "/compliance-checks");

    expect(useWorkspaces.getState().workspaces).toHaveLength(2);

    expect(useWorkspaces.getState().activate(a.id)).toBe("/portfolio-snapshot");
    expect(useSession.getState().activePersona).toBe("portfolio-manager");
    expect(useContextBus.getState().context).toBeNull();

    useWorkspaces.getState().activate(b.id);
    expect(useSession.getState().activePersona).toBe("compliance-officer");
    expect(useContextBus.getState().context?.id).toBe("pf-003");
  });
});
