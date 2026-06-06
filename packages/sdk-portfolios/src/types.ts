import { z } from "zod";
import { CurrencyCodeSchema, MoneySchema } from "@aegis/models";

/**
 * The Portfolio domain type. This SDK owns it (ADR 0002) and conforms it to the
 * shared Entity base shape (id, type, label) so search and the context bus can
 * treat it uniformly.
 */
export const PortfolioSchema = z.object({
  id: z.string(),
  type: z.literal("portfolio"),
  label: z.string(),
  accountId: z.string(),
  strategy: z.string(),
  baseCurrency: CurrencyCodeSchema,
  marketValue: MoneySchema,
  holdingsCount: z.number().int().nonnegative(),
});

export type Portfolio = z.infer<typeof PortfolioSchema>;
