import { PortfolioSchema, type Portfolio } from "./types";
import { MOCK_PORTFOLIOS, delay } from "./mock";

/**
 * The Portfolios SDK interface — the contract and source of truth (ADR 0002).
 * V1 is backed by an in-memory implementation; a future backend conforms via
 * codegen. Functions never call this directly — they use the hooks.
 */
export interface PortfoliosSdk {
  list(): Promise<Portfolio[]>;
  get(id: string): Promise<Portfolio>;
  search(query: string): Promise<Portfolio[]>;
}

export const portfoliosSdk: PortfoliosSdk = {
  async list() {
    await delay(300);
    return MOCK_PORTFOLIOS.map((p) => PortfolioSchema.parse(p));
  },
  async get(id) {
    await delay(200);
    const found = MOCK_PORTFOLIOS.find((p) => p.id === id);
    if (!found) throw new Error(`Portfolio not found: ${id}`);
    return PortfolioSchema.parse(found);
  },
  async search(query) {
    await delay(150);
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return MOCK_PORTFOLIOS.filter(
      (p) =>
        p.label.toLowerCase().includes(q) ||
        p.strategy.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q),
    ).map((p) => PortfolioSchema.parse(p));
  },
};
