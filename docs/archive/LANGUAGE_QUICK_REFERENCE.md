# 📋 Language Addition Checklist

## ✅ Current System Status

### Configured Languages (Active in app)
- [x] German (de)
- [x] English (en)  
- [x] Albanian (sq)
- [x] Russian (ru)

### Available (Metadata pre-loaded, just need JSON)
- [ ] French (fr)
- [ ] Italian (it)
- [ ] Spanish (es)
- [ ] Turkish (tr)
- [ ] Japanese (ja)
- [ ] Chinese (zh)

---

## 🚀 Quick Add Language Workflow

### To add **French** to active languages:

#### Step 1: Edit `src/lib/i18n.tsx`
```diff
- export const LANGUAGE_PACK = ["de", "en", "sq", "ru"] as const;
+ export const LANGUAGE_PACK = ["de", "en", "sq", "ru", "fr"] as const;
```

#### Step 2: Create `src/translations/fr.json`
Copy from `en.json` or `de.json` and translate all values

#### Step 3: Done! ✅
- French now appears in language dropdown
- All routes work: `/fr/`, `/fr/apartments`, etc.
- All components display French text

---

## 🔄 Decision Tree

```
Want to add a language?
│
├─ Is it in the metadata list (de, en, sq, fr, it, es, tr, ru, ja, zh)?
│  │
│  └─ YES
│     ├─ Add code to LANGUAGE_PACK in i18n.tsx
│     ├─ Create translation JSON file
│     └─ ✅ DONE! (Metadata auto-loads)
│
└─ NO (New language not in metadata)
   ├─ Add code to LANGUAGE_PACK in i18n.tsx  
   ├─ Add metadata to LANGUAGE_METADATA in LanguageSelector.tsx
   ├─ Create translation JSON file
   └─ ✅ DONE!
```

---

## 📁 File Structure

```
src/
├── lib/
│   └── i18n.tsx                    ← Add language codes here
├── components/
│   └── LanguageSelector.tsx        ← Metadata defined here
└── translations/
    ├── de.json                     ✅ German
    ├── en.json                     ✅ English
    ├── sq.json                     ✅ Albanian
    ├── ru.json                     ✅ Russian
    ├── fr.json                     ⏳ When you add to LANGUAGE_PACK
    ├── it.json                     ⏳ When you add to LANGUAGE_PACK
    ├── es.json                     ⏳ When you add to LANGUAGE_PACK
    ├── tr.json                     ⏳ When you add to LANGUAGE_PACK
    ├── ja.json                     ⏳ When you add to LANGUAGE_PACK
    └── zh.json                     ⏳ When you add to LANGUAGE_PACK
```

---

## 🎯 Common Scenarios

### Scenario 1: Activate Italian
```
1. Open src/lib/i18n.tsx
2. Change: ["de", "en", "sq", "ru", "it"]
3. Reload browser
✅ Italian is now available!
```

### Scenario 2: Add Portuguese (not in metadata)
```
1. Open src/lib/i18n.tsx
   Change: ["de", "en", "sq", "ru", "pt"]

2. Open src/components/LanguageSelector.tsx
   Add: pt: { name: "Portuguese", flag: "🇵🇹", nativeName: "Português" }

3. Create src/translations/pt.json
   (Copy from en.json structure and translate)

4. Reload browser
✅ Portuguese is now available!
```

### Scenario 3: Remove Russian temporarily
```
1. Open src/lib/i18n.tsx
   Change: ["de", "en", "sq"] (remove "ru")

2. Reload browser
✅ Russian is gone, no errors, everything still works!
```

### Scenario 4: Switch to ALL languages
```
1. Open src/lib/i18n.tsx
   Change: ["de", "en", "sq", "ru", "fr", "it", "es", "tr", "ja", "zh"]

2. Reload browser
✅ All 10 languages appear in dropdown!
```

---

## 🔗 Files to Modify

| Task | File | Lines | Change |
|------|------|-------|--------|
| Add/Remove languages | `src/lib/i18n.tsx` | 24 | LANGUAGE_PACK array |
| Add new language metadata | `src/components/LanguageSelector.tsx` | 31-42 | LANGUAGE_METADATA object |
| Add translations | `src/translations/{code}.json` | All | Copy structure + translate |

---

## ⚡ Pro Tips

1. **Use en.json as template** - It's the most consistent
2. **Keep key structure identical** - Don't rename or reorder keys
3. **Test language switching** - Make sure all pages load correctly
4. **Use professional translator** - For better UX in critical sections
5. **Copy from i18n section** - Easier to understand structure than de.json

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Language not showing | Add to LANGUAGE_PACK in i18n.tsx |
| Blank page | Check JSON file has valid syntax |
| Wrong flag/name | Metadata missing or wrong in LanguageSelector.tsx |
| Text in German | Key missing from JSON file or wrong prefix |
| Page crashes | Restart dev server: `npm run dev` |

---

## 📚 Documentation Files

- **ADD_NEW_LANGUAGE_GUIDE.md** - Detailed step-by-step guide
- **LANGUAGE_REFACTORING_SUMMARY.md** - Technical overview
- **This file** - Quick reference checklist

---

**Happy translating! 🌍**

