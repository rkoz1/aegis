/**
 * The routing/ranking layer that keeps results relevant rather than a generic
 * dump. Scores label matches and recognises id-shaped queries (intent), so e.g.
 * "pf-001" finds a portfolio by id even when the label doesn't contain it.
 */

/** Score a query against a label. Exact > prefix > token-prefix > substring. */
export function scoreLabel(query: string, label: string): number {
  const q = query.trim().toLowerCase();
  const l = label.toLowerCase();
  if (!q) return 0;
  if (l === q) return 100;
  if (l.startsWith(q)) return 60;
  if (l.split(/\s+/).some((t) => t.startsWith(q))) return 45;
  if (l.includes(q)) return 25;
  return 0;
}

/** Score a query against an identifier. A substring id match is strong intent. */
export function scoreId(query: string, id: string): number {
  const q = query.trim().toLowerCase();
  const i = id.toLowerCase();
  if (!q) return 0;
  if (i === q) return 95;
  if (i.includes(q)) return 80;
  return 0;
}

/** Heuristic: does the query look like an identifier (letters + digits)? */
export function looksLikeId(query: string): boolean {
  const q = query.trim();
  return /[a-z]/i.test(q) && /\d/.test(q);
}
