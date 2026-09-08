import overrides from '../data/booksy-links.json';

// The main clinic profile — the fallback for any treatment without its own link.
export const MAIN_BOOKSY_URL =
  'https://booksy.com/en-za/33005_skin-nourishers_skin-care_54460_sandton';

// Returns a treatment's own Booksy page if one has been recorded in
// booksy-links.json, otherwise the main profile (Section 05).
export function booksyLinkFor(name) {
  if (!name) return MAIN_BOOKSY_URL;
  const key = String(name).trim().toLowerCase();
  for (const [k, v] of Object.entries(overrides)) {
    if (k.startsWith('_')) continue;
    if (k.trim().toLowerCase() === key && v) return v;
  }
  return MAIN_BOOKSY_URL;
}
