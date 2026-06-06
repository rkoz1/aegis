import { describe, it, expect } from "vitest";

import { createRegistry } from "./registry";
import type { FunctionManifest } from "./manifest";

const noop = () => null;

function manifest(
  id: string,
  route: string,
  requiredRoles: string[],
): FunctionManifest {
  return {
    id,
    label: id.toUpperCase(),
    category: "test",
    entityTypes: [],
    requiredRoles,
    route,
    mount: noop,
  };
}

const pm = manifest("a", "/a", ["portfolio-manager", "client-portal"]);
const compliance = manifest("b", "/b", ["compliance-officer", "portfolio-manager"]);
const open = manifest("c", "/c", []);

describe("registry visibility", () => {
  const reg = createRegistry([pm, compliance, open]);

  it("portfolio-manager sees both restricted Functions plus open ones", () => {
    expect(reg.visibleTo(["portfolio-manager"]).map((m) => m.id)).toEqual([
      "a",
      "b",
      "c",
    ]);
  });

  it("compliance-officer sees only its Function plus open ones", () => {
    expect(reg.visibleTo(["compliance-officer"]).map((m) => m.id)).toEqual([
      "b",
      "c",
    ]);
  });

  it("client-portal sees only its Function plus open ones", () => {
    expect(reg.visibleTo(["client-portal"]).map((m) => m.id)).toEqual(["a", "c"]);
  });

  it("an empty requiredRoles array means visible to all", () => {
    expect(reg.visibleTo([]).map((m) => m.id)).toEqual(["c"]);
  });

  it("byRoute resolves a manifest", () => {
    expect(reg.byRoute("/b")?.id).toBe("b");
    expect(reg.byRoute("/missing")).toBeUndefined();
  });
});
