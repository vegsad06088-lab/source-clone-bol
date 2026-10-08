import { knowledgeBase, fallbackMessages, type KnowledgeEntry } from "./knowledgeBase";

// Simple language detection based on common words
const langPatterns: Record<string, RegExp[]> = {
  de: [/\b(ich|und|der|die|das|ist|wie|wo|was|kann|gibt|bitte|haben|wann|welche)\b/i],
  en: [/\b(the|is|are|how|what|where|when|can|do|does|have|please|which|there)\b/i],
  fr: [/\b(le|la|les|est|sont|comment|quoi|où|quand|peut|avez|s'il)\b/i],
  it: [/\b(il|la|le|è|sono|come|cosa|dove|quando|può|avete|per)\b/i],
  es: [/\b(el|la|los|es|son|cómo|qué|dónde|cuándo|puede|tienen|por)\b/i],
  sq: [/\b(un|një|është|janë|si|ku|kur|mund|ka|për|të)\b/i],
};

export function detectLanguage(text: string): string {
  let bestLang = "de";
  let bestScore = 0;

  for (const [lang, patterns] of Object.entries(langPatterns)) {
    let score = 0;
    for (const pattern of patterns) {
      const matches = text.match(new RegExp(pattern.source, "gi"));
      if (matches) score += matches.length;
    }
    if (score > bestScore) {
      bestScore = score;
      bestLang = lang;
    }
  }

  return bestLang;
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[äÄ]/g, "a")
    .replace(/[öÖ]/g, "o")
    .replace(/[üÜ]/g, "u")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function searchKnowledge(query: string, lang?: string): string {
  const detectedLang = lang || detectLanguage(query);
  const normalizedQuery = normalizeText(query);
  const queryWords = normalizedQuery.split(" ").filter((w) => w.length > 2);

  const scored: { entry: KnowledgeEntry; score: number }[] = [];

  for (const entry of knowledgeBase) {
    let score = 0;

    for (const keyword of entry.keywords) {
      const normalizedKeyword = normalizeText(keyword);

      if (normalizedQuery.includes(normalizedKeyword)) {
        score += 3;
      }

      for (const word of queryWords) {
        if (normalizedKeyword.includes(word) || word.includes(normalizedKeyword)) {
          score += 1;
        }
      }
    }

    if (score > 0) {
      scored.push({ entry, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);

  if (scored.length === 0) {
    return fallbackMessages[detectedLang] || fallbackMessages["de"];
  }

  const best = scored[0].entry;
  return best.content[detectedLang] || best.content["de"] || best.content["en"] || Object.values(best.content)[0];
}
