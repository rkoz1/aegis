import { useQuery } from "@tanstack/react-query";
import { portfoliosSdk } from "./client";

/** Query keys for the portfolios domain. */
export const portfolioKeys = {
  all: ["portfolios"] as const,
  detail: (id: string) => ["portfolios", id] as const,
};

/** Read all portfolios via the SDK. The only way Functions access this data. */
export function usePortfolios() {
  return useQuery({
    queryKey: portfolioKeys.all,
    queryFn: () => portfoliosSdk.list(),
  });
}

/** Read a single portfolio by id. */
export function usePortfolio(id: string) {
  return useQuery({
    queryKey: portfolioKeys.detail(id),
    queryFn: () => portfoliosSdk.get(id),
    enabled: Boolean(id),
  });
}
