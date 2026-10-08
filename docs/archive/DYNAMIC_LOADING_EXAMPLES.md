# 🎯 Dynamic Loading - Practical Examples

## Example 1: Adding Japanese (Step-by-Step)

### Step 1: Update LANGUAGE_PACK
```typescript
// src/lib/i18n.tsx
export const LANGUAGE_PACK = ["de", "en", "sq", "ru", "ja"] as const;
//                                                      ↑ Add here
```

### Step 2: Hard Refresh Browser
Open browser console (F12) → Look at output

### Step 3: Console Shows
```
⚠️ Translation file not found for language "ja". 
   Expected: src/translations/ja.json
   This language won't be available until you create the translation file.

✅ Loaded translations: de, en, sq, ru
⚠️ Missing translations: ja
```

### Step 4: Page Still Works!
- ✅ All existing languages work (de, en, sq, ru)
- ✅ No errors or crashes
- ✅ Japanese doesn't appear in selector yet (expected)
- ✅ You can safely work on other things

### Step 5: Create ja.json
Copy `en.json` and translate all values:
```json
{
  "ja.navbar.home": "ホーム",
  "ja.navbar.apartments": "アパートメント",
  "ja.navbar.book_now": "今すぐ予約！",
  ...
}
```

### Step 6: Hard Refresh Again
```
✅ Loaded translations: de, en, sq, ru, ja
```

✨ **Japanese now works perfectly!**

---

## Example 2: What Happens with Missing Keys

### Scenario
You're on Japanese page but a translation key doesn't exist in ja.json

### Code
```typescript
// Component tries to get translation
const title = t("some.missing.key");
```

### System Does
```
1. Look for: ja.some.missing.key
   ❌ Not found
   
2. Look for: de.some.missing.key (fallback)
   ✅ Found! Use German version
   
3. Console warns:
   ⚠️ Translation key missing for ja: ja.some.missing.key, 
      falling back to German
```

### Result
- Shows German text
- Page loads fine
- Warning in console

---

## Example 3: Complete Missing File

### Scenario
User adds multiple languages before creating files:

```typescript
export const LANGUAGE_PACK = ["de", "en", "sq", "ru", "ja", "zh", "ko"] as const;
//                                                      ↑         ↑   ↑ 
//                                        Adding 3 new languages
```

### Console Output
```
⚠️ Translation file not found for language "ja". 
   Expected: src/translations/ja.json
   This language won't be available until you create the translation file.

⚠️ Translation file not found for language "zh". 
   Expected: src/translations/zh.json
   This language won't be available until you create the translation file.

⚠️ Translation file not found for language "ko". 
   Expected: src/translations/ko.json
   This language won't be available until you create the translation file.

✅ Loaded translations: de, en, sq, ru
⚠️ Missing translations: ja, zh, ko
```

### What Happens
- ✅ App loads fine
- ✅ Existing languages work perfectly
- ✅ New languages simply unavailable
- ✅ You can create files one by one
- ✅ Each reload loads new languages automatically

### Timeline
```
Day 1: Add ja, zh, ko to LANGUAGE_PACK
       ↓ Warnings in console
       
Day 2: Create ja.json
       ↓ Hard refresh
       ↓ Japanese now works!
       
Day 3: Create zh.json
       ↓ Hard refresh
       ↓ Chinese now works!
       
Day 4: Create ko.json
       ↓ Hard refresh
       ↓ All 7 languages working! ✨
```

---

## Example 4: Real-World Workflow

### Month 1: Launch with 4 Languages
```typescript
export const LANGUAGE_PACK = ["de", "en", "sq", "ru"] as const;
```
✅ All 4 languages working

### Month 2: French Tourist Season Starts
```typescript
export const LANGUAGE_PACK = ["de", "en", "sq", "ru", "fr"] as const;
```
- Add to LANGUAGE_PACK
- Create fr.json
- 1 hour later: French available
- No system downtime needed

### Month 3: Japanese Visitors Increase
```typescript
export const LANGUAGE_PACK = ["de", "en", "sq", "ru", "fr", "ja"] as const;
```
- Add to LANGUAGE_PACK
- Create ja.json
- Japanese live instantly
- 0 impact on existing languages

### Month 6: Planning Phase
```typescript
// You want Chinese support eventually
export const LANGUAGE_PACK = ["de", "en", "sq", "ru", "fr", "ja", "zh"] as const;
// Create zh.json (empty or partial translations)
```
- Warnings in console
- Site still works
- Team can work on translations at own pace
- No pressure to finish everything at once

---

## Example 5: Error Scenarios

### Scenario A: Typo in LANGUAGE_PACK
```typescript
export const LANGUAGE_PACK = ["de", "en", "sq", "ru", "ja"] as const;
// But file is named: ja-JP.json (wrong!)
```

**Console:**
```
⚠️ Translation file not found for language "ja". 
   Expected: src/translations/ja.json
   This language won't be available until you create the translation file.
```

**Fix:** Rename file to `ja.json`

---

### Scenario B: JSON Syntax Error
```json
// ja.json has syntax error
{
  "ja.navbar.home": "ホーム",
  "ja.navbar.apartments": "アパートメント"  ← Missing comma
  "ja.navbar.book_now": "今すぐ予約！",
}
```

**Result:**
- ✅ File won't be imported
- ✅ Console warns about missing ja.json
- ✅ Page loads fine
- ✅ Other languages work

**Fix:** Check JSON syntax and repair

---

### Scenario C: Empty Translation File
```typescript
export const LANGUAGE_PACK = ["de", "en", "sq", "ru", "ja"] as const;
```

```json
// ja.json is empty {}
{}
```

**Result:**
- ✅ File loads successfully
- ✅ No key will be found in ja.json
- ✅ All keys fall back to German
- ✅ Warnings in console for each missing key

**When done:** Add translations to ja.json, hard refresh

---

## Monitoring Translation Loading

### In Browser Console

**Check what loaded:**
```javascript
// Run in console:
window.__TRANSLATION_DEBUG__ = true;
// (or check console output at startup)
```

**Look for:**
```
✅ Loaded translations: de, en, sq, ru
⚠️ Missing translations: ja
```

---

## Best Practices

### ✅ DO

1. **Add to LANGUAGE_PACK early**
   ```typescript
   // Okay to add before creating JSON file
   export const LANGUAGE_PACK = ["de", "en", "sq", "ru", "ja"];
   ```

2. **Create JSON files incrementally**
   - Start with key pages only
   - Expand coverage gradually

3. **Monitor console warnings**
   - They tell you exactly what's missing
   - Fix them one by one

4. **Hard refresh after adding files**
   - Ensures new translations load
   - Ctrl+F5 or Cmd+Shift+R

### ❌ DON'T

1. **Don't leave typos in LANGUAGE_PACK**
   ```typescript
   // Bad - typo
   export const LANGUAGE_PACK = ["de", "en", "sq", "ru", "jaa"];
   // Should be "ja"
   ```

2. **Don't expect instant updates without refresh**
   - Browser caches files
   - Hard refresh needed for new files

3. **Don't ignore console warnings**
   - They tell you exactly what's wrong
   - Easy to fix if you know about them

---

## Summary Table

| Action | Result | Page | Languages | Console |
|--------|--------|------|-----------|---------|
| Add to LANGUAGE_PACK, create JSON | ✅ Works | ✅ Loads | ✅ All work | ✅ No warnings |
| Add to LANGUAGE_PACK, no JSON | ✅ Works | ✅ Loads | ✅ Partial | ⚠️ Warning |
| Missing translation key | ✅ Works | ✅ Loads | ✅ Fallback | ⚠️ Warning |
| JSON syntax error | ✅ Works | ✅ Loads | ✅ Partial | ⚠️ Warning |
| All files missing | ✅ Works | ✅ Loads | ✅ Default | ⚠️ Warnings |

---

## Key Takeaway

**Your system is designed to never fail.** 

No matter what you do:
- ✅ Page loads
- ✅ Content displays
- ✅ System never crashes
- ⚠️ Console tells you what's missing

You can develop languages **at your own pace** without affecting the live site. Perfect! 🚀

