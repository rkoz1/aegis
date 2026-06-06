import {
  createSearchAggregator,
  entityProvider,
  manifestProvider,
} from "@aegis/platform-search";
import { portfoliosSdk } from "@aegis/sdk-portfolios";

import { registry } from "./registry";

/**
 * Composes the Search Providers: the Registry (Functions) plus one per domain
 * SDK (Entities). Adding a domain = add a provider here; the search UI is
 * untouched. See CONTEXT.md (Global Search, Search Provider).
 */
const providers = [
  manifestProvider(() =>
    registry.all().map((m) => ({
      id: m.id,
      label: m.label,
      category: m.category,
      route: m.route,
      requiredRoles: m.requiredRoles,
    })),
  ),
  entityProvider({
    id: "portfolios",
    entityType: "portfolio",
    visibleToRoles: ["portfolio-manager", "client-portal", "compliance-officer"],
    search: (q) => portfoliosSdk.search(q),
  }),
];

export const searchAggregator = createSearchAggregator(providers);
