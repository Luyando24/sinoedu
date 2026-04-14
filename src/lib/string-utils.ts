/**
 * Normalizes a search query by trimming leading/trailing whitespace
 * and collapsing multiple internal spaces into a single space.
 */
export function normalizeSearchQuery(query: string | null | undefined): string {
  if (!query) return "";
  return query
    .trim()
    .replace(/\s+/g, ' ');
}

/**
 * Safely trims a string if it exists, otherwise returns an empty string.
 */
export function safeTrim(val: string | null | undefined): string {
  if (!val) return "";
  return val.trim();
}
