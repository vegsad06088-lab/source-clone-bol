import blocksJson from "../../../projects/apzurquelle/config/blocks.json";
import { LANGUAGE_PACK } from "@/lib/i18n";

/**
 * Page blocks = the top-level <section> elements of a page.
 * Hidden blocks are stored per page in src/config/blocks.json:
 *   { "hidden": { "/about": [2, 4] } }   ← numbers = position of the section on that page (1 = first)
 */
export const hiddenBlocks: Record<string, number[]> = (blocksJson as { hidden: Record<string, number[]> }).hidden || {};

export const BLOCK_SELECTOR = "main > * > section";

/** "/de/about" → "/about", "/de" → "/" */
export function pageKey(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length && (LANGUAGE_PACK as readonly string[]).includes(parts[0])) parts.shift();
  return "/" + parts.join("/");
}

/** CSS that hides (or, in edit mode, dims) the hidden blocks of a page */
export function blockCss(path: string, editMode: boolean) {
  const list = hiddenBlocks[pageKey(path)] || [];
  if (!list.length) return "";
  const sel = list.map((n) => `${BLOCK_SELECTOR}:nth-of-type(${n})`).join(",");
  return editMode ? `${sel}{opacity:.35;outline:2px dashed hsl(var(--destructive));}` : `${sel}{display:none !important;}`;
}
