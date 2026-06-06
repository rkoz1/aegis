import { describe, it, expect } from "vitest";

import { LIFECYCLE_STAGES, groupByStage } from "./index";

describe("investment lifecycle", () => {
  it("has nine stages in front-to-back order", () => {
    expect(LIFECYCLE_STAGES).toHaveLength(9);
    expect(LIFECYCLE_STAGES[0]?.id).toBe("client-acquisition");
    expect(LIFECYCLE_STAGES[8]?.id).toBe("monitoring");
  });

  it("groups items by stage in lifecycle order, dropping empty stages", () => {
    const items = [
      { id: "cc", category: "Pre-Trade" },
      { id: "ps", category: "Portfolio Construction" },
    ];
    const groups = groupByStage(items);
    // Portfolio Construction (stage 5) precedes Pre-Trade (stage 6)
    expect(groups.map((g) => g.stage.id)).toEqual([
      "portfolio-construction",
      "pre-trade",
    ]);
    expect(groups[0]?.items.map((i) => i.id)).toEqual(["ps"]);
  });

  it("drops stages with no items", () => {
    expect(groupByStage([{ id: "x", category: "Research & Insight" }])).toHaveLength(1);
  });
});
