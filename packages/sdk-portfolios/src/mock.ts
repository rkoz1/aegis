import type { Portfolio } from "./types";

/** In-memory fixtures backing the V1 mock implementation. */
export const MOCK_PORTFOLIOS: Portfolio[] = [
  {
    id: "pf-001",
    type: "portfolio",
    label: "Smith Family Trust — Balanced",
    accountId: "ac-001",
    strategy: "Balanced 60/40",
    baseCurrency: "USD",
    marketValue: { amount: 4_250_000, currency: "USD" },
    holdingsCount: 42,
  },
  {
    id: "pf-002",
    type: "portfolio",
    label: "Smith Family Trust — Growth",
    accountId: "ac-001",
    strategy: "Global Equity Growth",
    baseCurrency: "USD",
    marketValue: { amount: 1_980_500, currency: "USD" },
    holdingsCount: 28,
  },
  {
    id: "pf-003",
    type: "portfolio",
    label: "Meridian Pension — Liability Matching",
    accountId: "ac-002",
    strategy: "LDI Fixed Income",
    baseCurrency: "GBP",
    marketValue: { amount: 87_400_000, currency: "GBP" },
    holdingsCount: 113,
  },
];

/** Simulate network latency so the mock feels real. */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
