# 🌍 How to Add a New Language - Quick Guide

## System Overview
The language system is now fully automated! Adding a new language requires **ONLY 3 STEPS** and changes to only **2 files**.

## Adding a New Language - Step by Step

### Step 1️⃣: Add language code to LANGUAGE_PACK
**File:** `src/lib/i18n.tsx`

```typescript
export const LANGUAGE_PACK = ["de", "en", "sq", "ru", "ja"] as const;
//                                                          ↑
//                                            Add your language code here
```

### Step 2️⃣: Add language metadata
**File:** `src/components/LanguageSelector.tsx`

The metadata is **already pre-populated** for common languages! Just make sure your language is in `LANGUAGE_METADATA`:

```typescript
const LANGUAGE_METADATA: Record<string, Omit<LanguageInfo, "code">> = {
  de: { name: "German", flag: "🇩🇪", nativeName: "Deutsch" },
  en: { name: "English", flag: "🇬🇧", nativeName: "English" },
  sq: { name: "Albanian", flag: "🇦🇱", nativeName: "Shqip" },
  fr: { name: "French", flag: "🇫🇷", nativeName: "Français" },
  it: { name: "Italian", flag: "🇮🇹", nativeName: "Italiano" },
  es: { name: "Spanish", flag: "🇪🇸", nativeName: "Español" },
  tr: { name: "Turkish", flag: "🇹🇷", nativeName: "Türkçe" },
  ru: { name: "Russian", flag: "🇷🇺", nativeName: "Русский" },
  ja: { name: "Japanese", flag: "🇯🇵", nativeName: "日本語" },
  zh: { name: "Chinese", flag: "🇨🇳", nativeName: "中文" },
  // ↑ Already includes: German, English, Albanian, French, Italian, Spanish, Turkish, Russian, Japanese, Chinese
};
```

**Pre-loaded languages:** de, en, sq, fr, it, es, tr, ru, ja, zh

If adding a language not in the list, add it here too.

### Step 3️⃣: Create translation JSON file
**File:** `src/translations/{code}.json`

Copy the structure from any existing translation file and translate all keys.

Example structure:
```json
{
  "ja.bookingConditions.title": "予約条件",
  "ja.bookingConditions.intro": "予約前にこれらの条件をお読みください",
  ...
}
```

**Template languages available:**
- German (de.json) - most comprehensive
- English (en.json)
- Russian (ru.json) - if translating Cyrillic-based languages
- Chinese (zh.json) - if translating CJK languages

## Example: Adding Japanese

### Change 1: Update i18n.tsx
```typescript
// Before
export const LANGUAGE_PACK = ["de", "en", "sq", "ru"] as const;

// After
export const LANGUAGE_PACK = ["de", "en", "sq", "ru", "ja"] as const;
```

### Change 2: Verify LanguageSelector.tsx
✅ Already has Japanese:
```typescript
ja: { name: "Japanese", flag: "🇯🇵", nativeName: "日本語" },
```

### Change 3: Create ja.json
Create `src/translations/ja.json` with all translations

**That's it!** Japanese will now appear in the language selector and work throughout the app.

## How It Works

The system uses **two-way mapping**:

```
1. LANGUAGE_PACK defines which languages to use
        ↓
2. LANGUAGE_INFO is auto-generated from LANGUAGE_PACK + LANGUAGE_METADATA
        ↓
3. i18n system loads corresponding JSON files
        ↓
4. Language selector displays available languages with flags
```

## Benefits

✅ **No manual wiring** - LANGUAGE_INFO auto-generates from LANGUAGE_PACK  
✅ **Scalable** - Pre-loaded metadata for 10 common languages  
✅ **Maintainable** - Only change LANGUAGE_PACK and create JSON file  
✅ **Safe fallback** - Unknown languages default to globe emoji + code  
✅ **Type-safe** - TypeScript ensures language codes match  

## Currently Supported Languages

| Code | Language | Status | Metadata | JSON |
|------|----------|--------|----------|------|
| de | German | ✅ Active | ✅ | ✅ |
| en | English | ✅ Active | ✅ | ✅ |
| sq | Albanian | ✅ Active | ✅ | ✅ |
| ru | Russian | ✅ Active | ✅ | ✅ |
| fr | French | ⏸️ Available | ✅ | ✅ |
| it | Italian | ⏸️ Available | ✅ | ✅ |
| es | Spanish | ⏸️ Available | ✅ | ✅ |
| tr | Turkish | ⏸️ Available | ✅ | ✅ |
| ja | Japanese | ⏸️ Available | ✅ | ✅ |
| zh | Chinese | ⏸️ Available | ✅ | ✅ |

## Files Involved

**Core Files:**
- `src/lib/i18n.tsx` - Language pack configuration + i18n logic
- `src/components/LanguageSelector.tsx` - Language metadata + dropdown UI

**Translation Files:**
- `src/translations/{code}.json` - One file per language

**Usage (no changes needed):**
- All components use `useI18n()` hook automatically

## Troubleshooting

### Language appears blank?
→ Check that language code in LANGUAGE_PACK matches JSON filename and metadata

### Language doesn't show in dropdown?
→ Add entry to LANGUAGE_METADATA in LanguageSelector.tsx with name, flag, nativeName

### Translations not showing?
→ Ensure JSON keys use format: `{code}.{namespace}.{key}` (e.g., `ja.navbar.home`)

---

**Enjoy a seamless multi-language experience! 🌎**

