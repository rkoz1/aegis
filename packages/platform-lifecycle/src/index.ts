/**
 * The Investment Lifecycle — the canonical front-to-back-office spine the
 * platform's Navigation Taxonomy and Lifecycle Map are organised around. This
 * ordering is curated and editorial (CONTEXT.md: Investment Lifecycle), distinct
 * from the Registry which only says what exists.
 */

export interface LifecycleStage {
  id: string;
  label: string;
}

export const LIFECYCLE_STAGES: LifecycleStage[] = [
  { id: "client-acquisition", label: "Client Acquisition & Relationship" },
  { id: "onboarding", label: "Onboarding & Due Diligence" },
  { id: "account-setup", label: "Account & Portfolio Setup" },
  { id: "research", label: "Research & Insight" },
  { id: "portfolio-construction", label: "Portfolio Construction" },
  { id: "pre-trade", label: "Pre-Trade" },
  { id: "execution", label: "Execution" },
  { id: "post-trade", label: "Post-Trade & Operations" },
  { id: "monitoring", label: "Monitoring & Reporting" },
];

export interface StageGroup<T> {
  stage: LifecycleStage;
  items: T[];
}

/**
 * Group items (whose `category` is a stage label) under the ordered lifecycle
 * stages, dropping stages with no items. This is the curation that turns a flat
 * set of Functions into the front-to-back Navigation Taxonomy.
 */
export function groupByStage<T extends { category: string }>(
  items: T[],
): StageGroup<T>[] {
  return LIFECYCLE_STAGES.map((stage) => ({
    stage,
    items: items.filter((i) => i.category === stage.label),
  })).filter((g) => g.items.length > 0);
}
