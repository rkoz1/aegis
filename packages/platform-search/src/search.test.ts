import { describe, it, expect } from "vitest";
import type { EntityBase } from "@aegis/models";

import { scoreLabel, scoreId, looksLikeId } from "./scoring";
import { createSearchAggregator, groupResults } from "./aggregator";
import { manifestProvider, entityProvider, type ManifestSearchItem } from "./providers";

describe("scoring", () => {
  it("ranks exact > prefix > substring", () => {
    expect(scoreLabel("portfolio snapshot", "Portfolio Snapshot")).toBe(100);
    expect(scoreLabel("port", "Portfolio Snapshot")).toBeGreaterThan(
      scoreLabel("nap", "Portfolio Snapshot"),
    );
  });

  it("scoreId matches identifiers (intent)", () => {
    expect(scoreId("pf-001", "pf-001")).toBe(95);
    expect(scoreId("001", "pf-001")).toBe(80);
    expect(scoreId("xyz", "pf-001")).toBe(0);
  });

  it("looksLikeId detects id-shaped queries", () => {
    expect(looksLikeId("pf-001")).toBe(true);
    expect(looksLikeId("portfolio")).toBe(false);
  });
});

const manifests: ManifestSearchItem[] = [
  {
    id: "ps",
    label: "Portfolio Snapshot",
    category: "Portfolio Construction",
    route: "/portfolio-snapshot",
    requiredRoles: ["portfolio-manager", "client-portal"],
  },
  {
    id: "cc",
    label: "Compliance Checks",
    category: "Pre-Trade",
    route: "/compliance-checks",
    requiredRoles: ["compliance-officer", "portfolio-manager"],
  },
];

const entities: EntityBase[] = [
  { id: "pf-001", type: "portfolio", label: "Smith Family Trust — Balanced" },
];

const agg = createSearchAggregator([
  manifestProvider(() => manifests),
  entityProvider({
    id: "portfolios",
    entityType: "portfolio",
    visibleToRoles: ["portfolio-manager", "client-portal"],
    search: () => entities,
  }),
]);

describe("aggregator federation", () => {
  it("filters results by the active Persona's Role visibility", async () => {
    const results = await agg.search("compliance", { roles: ["compliance-officer"] });
    const labels = results.map((r) => r.label);
    expect(labels).toContain("Compliance Checks");
    expect(labels).not.toContain("Portfolio Snapshot"); // PM/client only
    // portfolios entity is visible to PM/client only — hidden from compliance
    expect(results.some((r) => r.category === "Entities")).toBe(false);
  });

  it("ranks a strong label match above a weak entity floor match", async () => {
    const results = await agg.search("portfolio", { roles: ["portfolio-manager"] });
    expect(results[0]?.label).toBe("Portfolio Snapshot");
    expect(results.some((r) => r.category === "Entities")).toBe(true);
  });

  it("returns nothing for an empty query", async () => {
    expect(await agg.search("   ", { roles: ["portfolio-manager"] })).toEqual([]);
  });
});

describe("groupResults", () => {
  it("orders Functions before Entities", async () => {
    const grouped = groupResults(
      await agg.search("portfolio", { roles: ["portfolio-manager"] }),
    );
    expect(grouped[0]?.category).toBe("Functions");
    expect(grouped.map((g) => g.category)).toContain("Entities");
  });
});
