import { describe, it, expect, beforeEach } from "vitest";

import { ContextSchema, ContextTypes } from "./types";
import { makeContext, matchesType } from "./helpers";
import { useContextBus } from "./store";

describe("Context schema (strict core, open extensions)", () => {
  it("keeps the standard core fields", () => {
    const c = ContextSchema.parse({
      type: "aegis.portfolio",
      id: "pf-001",
      name: "Smith",
    });
    expect(c.type).toBe("aegis.portfolio");
    expect(c.id).toBe("pf-001");
  });

  it("allows open extension fields", () => {
    const c = ContextSchema.parse({
      type: "aegis.portfolio",
      id: "pf-001",
      "x.custom": { a: 1 },
    });
    expect(c["x.custom"]).toEqual({ a: 1 });
  });

  it("rejects a Context with no type", () => {
    expect(() => ContextSchema.parse({ id: "x" })).toThrow();
  });
});

describe("helpers", () => {
  it("makeContext builds a valid Context", () => {
    expect(makeContext(ContextTypes.portfolio, { id: "pf-001" }).type).toBe(
      "aegis.portfolio",
    );
  });

  it("matchesType guards by type and handles null", () => {
    const c = makeContext(ContextTypes.portfolio, { id: "pf-001" });
    expect(matchesType(c, ContextTypes.portfolio)).toBe(true);
    expect(matchesType(c, "other")).toBe(false);
    expect(matchesType(null, ContextTypes.portfolio)).toBe(false);
  });
});

describe("context bus store", () => {
  beforeEach(() => useContextBus.getState().clear());

  it("emits then clears Context", () => {
    useContextBus
      .getState()
      .setContext(makeContext(ContextTypes.portfolio, { id: "pf-001", name: "X" }));
    expect(useContextBus.getState().context?.id).toBe("pf-001");

    useContextBus.getState().clear();
    expect(useContextBus.getState().context).toBeNull();
  });
});
