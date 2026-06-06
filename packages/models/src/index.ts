import { z } from "zod";

/**
 * @aegis/models — shared, domain-agnostic primitives and the common Entity
 * base shape. No single SDK owns these; SDKs own their own domain types and
 * conform them to EntityBase. See ADR 0002.
 */

/** ISO 4217 currency code, validated as three uppercase letters. */
export const CurrencyCodeSchema = z
  .string()
  .regex(/^[A-Z]{3}$/, "Expected an ISO 4217 currency code");
export type CurrencyCode = z.infer<typeof CurrencyCodeSchema>;

/** A monetary amount in a given currency. */
export const MoneySchema = z.object({
  amount: z.number(),
  currency: CurrencyCodeSchema,
});
export type Money = z.infer<typeof MoneySchema>;

/** The kinds of Entity the platform knows about. Extended as domains are added. */
export const EntityTypeSchema = z.enum([
  "portfolio",
  "account",
  "client",
  "contact",
  "instrument",
]);
export type EntityType = z.infer<typeof EntityTypeSchema>;

/** A lightweight typed reference to an Entity, used in Context and search. */
export const EntityRefSchema = z.object({
  type: EntityTypeSchema,
  id: z.string(),
});
export type EntityRef = z.infer<typeof EntityRefSchema>;

/**
 * The common shape every domain Entity conforms to, so Global Search and the
 * Context Bus can treat Entities uniformly without knowing concrete types.
 */
export const EntityBaseSchema = z.object({
  id: z.string(),
  type: EntityTypeSchema,
  label: z.string(),
});
export type EntityBase = z.infer<typeof EntityBaseSchema>;
