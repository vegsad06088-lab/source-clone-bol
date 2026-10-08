# 🎯 Configurable DEFAULT_LANGUAGE Fallback System

## What Changed

The fallback system now uses **DEFAULT_LANGUAGE** instead of hardcoding German.

### Before
```typescript
// Hardcoded German fallback
const defaultKey = `de.${texts}`;
if (translations["de"] && translations["de"][defaultKey]) {
  console.warn(`falling back to German`);
  return translations["de"][defaultKey];
}
```

### After
```typescript
// Configurable fallback using DEFAULT_LANGUAGE
const defaultKey = `${DEFAULT_LANGUAGE}.${texts}`;
if (translations[DEFAULT_LANGUAGE] && translations[DEFAULT_LANGUAGE][defaultKey]) {
  console.warn(`falling back to ${DEFAULT_LANGUAGE}`);
  return translations[DEFAULT_LANGUAGE][defaultKey];
}
```

---

## How to Configure

### Option 1: Default Setup (German)
```typescript
export const DEFAULT_LANGUAGE: typeof LANGUAGE_PACK[number] = "de";
```
✅ Falls back to German when key is missing

### Option 2: English Fallback
```typescript
export const DEFAULT_LANGUAGE: typeof LANGUAGE_PACK[number] = "en";
```
✅ Falls back to English when key is missing

### Option 3: Albanian Fallback
```typescript
export const DEFAULT_LANGUAGE: typeof LANGUAGE_PACK[number] = "sq";
```
✅ Falls back to Albanian when key is missing

**Important:** DEFAULT_LANGUAGE must be in LANGUAGE_PACK!

---

## Three-Level Fallback System

When a translation key is requested:

```
Level 1: Try current language
         └─ ja.navbar.home
            ├─ Found? ✅ Use it
            └─ Missing? Go to Level 2

Level 2: Try DEFAULT_LANGUAGE
         └─ de.navbar.home (or en, sq, etc.)
            ├─ Found? ⚠️ Warn + Use it
            └─ Missing? Go to Level 3

Level 3: Return key itself
         └─ "navbar.home"
            └─ ⚠️ Warn + Show key
```

---

## Console Output

### Using German as DEFAULT_LANGUAGE
```
⚠️ Translation key missing for ja: ja.navbar.home, falling back to de
```

### Using English as DEFAULT_LANGUAGE
```
⚠️ Translation key missing for ja: ja.navbar.home, falling back to en
```

### Using Albanian as DEFAULT_LANGUAGE
```
⚠️ Translation key missing for ja: ja.navbar.home, falling back to sq
```

---

## Configuration Example

### Setup 1: Multi-Language with German Default
```typescript
export const LANGUAGE_PACK = ["de", "en", "sq", "ru", "ja", "zh"] as const;
export const DEFAULT_LANGUAGE: typeof LANGUAGE_PACK[number] = "de";

// Result:
// - German is default
// - Missing keys fall back to German
// - All 6 languages available
```

### Setup 2: Multi-Language with English Default
```typescript
export const LANGUAGE_PACK = ["de", "en", "sq", "ru", "ja", "zh"] as const;
export const DEFAULT_LANGUAGE: typeof LANGUAGE_PACK[number] = "en";

// Result:
// - English is default
// - Missing keys fall back to English
// - All 6 languages available
```

### Setup 3: Minimal Setup
```typescript
export const LANGUAGE_PACK = ["en", "ja", "zh"] as const;
export const DEFAULT_LANGUAGE: typeof LANGUAGE_PACK[number] = "en";

// Result:
// - English is default
// - Missing keys fall back to English
// - Only 3 languages available
```

---

## Real-World Scenario

### Company A (German-first)
```typescript
export const LANGUAGE_PACK = ["de", "en", "fr"] as const;
export const DEFAULT_LANGUAGE = "de";  // German fallback

// If French user sees untranslated key → Falls back to German
```

### Company B (English-first)
```typescript
export const LANGUAGE_PACK = ["de", "en", "fr"] as const;
export const DEFAULT_LANGUAGE = "en";  // English fallback

// If French user sees untranslated key → Falls back to English
```

### Company C (Multilingual)
```typescript
export const LANGUAGE_PACK = ["de", "en", "es", "fr", "ja"] as const;
export const DEFAULT_LANGUAGE = "en";  // English as universal fallback

// Any language with missing key → Falls back to English
```

---

## Important Rules

1. **DEFAULT_LANGUAGE must be in LANGUAGE_PACK**
   ```typescript
   // ❌ WRONG - "xx" not in LANGUAGE_PACK
   export const LANGUAGE_PACK = ["de", "en", "sq"] as const;
   export const DEFAULT_LANGUAGE = "xx";
   
   // ✅ CORRECT - "en" is in LANGUAGE_PACK
   export const LANGUAGE_PACK = ["de", "en", "sq"] as const;
   export const DEFAULT_LANGUAGE = "en";
   ```

2. **DEFAULT_LANGUAGE affects both:**
   - Initial page language if no preference detected
   - Fallback when translation keys are missing

3. **Console shows which language is used for fallback**
   ```
   ⚠️ Translation key missing for ja: ja.navbar.home, falling back to de
                                                                         ↑ Shows actual DEFAULT_LANGUAGE
   ```

---

## Testing

### Test 1: Verify Default Language
```typescript
// Check what's set
export const DEFAULT_LANGUAGE = "en";

// In console, you'll see:
// "falling back to en"  ← Confirms English is default
```

### Test 2: Change Default Language
```typescript
// Change from German to English
export const DEFAULT_LANGUAGE = "en";

// Reload page
// Missing keys now fall back to English instead
```

### Test 3: Incomplete Translations
```typescript
// en.json has: en.navbar.home = "Home"
// ja.json missing: ja.navbar.home

export const DEFAULT_LANGUAGE = "en";

// Result: Shows English "Home" for Japanese users
// Console: ⚠️ falling back to en
```

---

## Summary

**Old System:**
- ❌ Hardcoded German fallback
- ❌ Can't change fallback language
- ❌ All keys showed "falling back to German"

**New System:**
- ✅ Configurable via DEFAULT_LANGUAGE
- ✅ Falls back to any language you choose
- ✅ Console shows which language is used
- ✅ Automatically applied

**To use:**
```typescript
// Change this one line to set fallback language
export const DEFAULT_LANGUAGE: typeof LANGUAGE_PACK[number] = "de";  // or "en", "sq", etc.
```

---

**Fully configurable, no hardcoding!** ✅

