# Language Configuration

## Active Languages

Defined in `src/lib/i18n.tsx` → `LANGUAGE_PACK`:

| Code | Language | Flag | Translation File |
|------|----------|------|-----------------|
| `de` | German | 🇩🇪 | `src/translations/de.json` |
| `en` | English | 🇬🇧 | `src/translations/en.json` |
| `sq` | Albanian | 🇦🇱 | `src/translations/sq.json` |

**Default language:** `de` (German)  
→ Default language uses **no URL prefix** (e.g. `/apartments`).  
→ All other languages get a prefix (e.g. `/en/apartments`, `/sq/apartments`).

---

## Geolocation Auto-Detection

Defined in `src/lib/i18n.tsx` → `COUNTRY_LANGUAGE_MAP`:

| Country | Code | → Language |
|---------|------|-----------|
| Austria | `AT` | `de` |
| Germany | `DE` | `de` |
| Switzerland | `CH` | `de` |
| Albania | `AL` | `sq` |
| All others | — | `en` |
| Detection fails | — | `de` (fallback) |

Uses `https://ipapi.co/json/` for IP geolocation.  
Result is **cached in `localStorage`** (`detectedLanguage` key) to avoid repeat API calls.

---

## Translation Files

Located in `src/translations/`. Keys are prefixed with language code: `de.home.hero.title`.

| File | Status |
|------|--------|
| `de.json` | ✅ Active |
| `en.json` | ✅ Active |
| `sq.json` | ✅ Active |
| `fr.json` | 💤 Exists, not in LANGUAGE_PACK |
| `it.json` | 💤 Exists, not in LANGUAGE_PACK |
| `es.json` | 💤 Exists, not in LANGUAGE_PACK |
| `ru.json` | 💤 Exists, not in LANGUAGE_PACK |
| `tr.json` | 💤 Exists, not in LANGUAGE_PACK |
| `ja.json` | 💤 Exists, not in LANGUAGE_PACK |
| `zh.json` | 💤 Exists, not in LANGUAGE_PACK |

---

## Language Selector UI

Defined in `src/components/LanguageSelector.tsx` → `LANGUAGE_METADATA`.  
Contains display names, flags, and native names for all languages (including inactive ones).  
Only languages present in `LANGUAGE_PACK` are shown in the dropdown.

---

## URL Routing

Handled in `src/App.tsx` via React Router.  
All routes are nested under `/:lang` and wrapped in `<LangWrapper>` which reads the URL param and provides the correct language context via `I18nProvider`.

| URL | Language |
|-----|----------|
| `/` | Redirects → `/de` |
| `/de/apartments` | German |
| `/en/apartments` | English |
| `/sq/apartments` | Albanian |

---

## Adding a New Language (3 steps)

1. **`src/lib/i18n.tsx`** → add code to `LANGUAGE_PACK`
   ```ts
   export const LANGUAGE_PACK = ["de", "en", "sq", "fr"] as const;
   ```

2. **`src/translations/fr.json`** → create translation file (copy `de.json` as template, file already exists for common languages)

3. **`src/components/LanguageSelector.tsx`** → add metadata to `LANGUAGE_METADATA` (already pre-populated for `fr`, `it`, `es`, `ru`, `tr`, `ja`, `zh`)

Done — the selector and routing pick it up automatically.

