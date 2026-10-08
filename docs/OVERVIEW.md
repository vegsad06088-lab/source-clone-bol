# Project overview (summary of all old docs)

This file replaces about 35 older notes, which are now in `docs/archive/`. You don't need to read those.

## What the site has
| Feature | Where | How to change it |
|---|---|---|
| Pages: Home, Apartments, Apartment detail, About, Contact, Guides (Anleitungen), Legal, Chat | `src/pages/` | Texts come from the translations |
| Photos | `public/content/` | Replace the files and keep the names |
| Settings (name, logo, email, links) | `src/config/site.config.ts` | Edit the values |
| Apartments, guides, FAQ, reviews | `src/lib/data.ts` | Edit the lists |
| Languages | `src/translations/<lang>.json` + `src/lib/i18n.tsx` | See below |
| Promo banner and voucher | `src/components/promo/offers.json` | `enabled`, `percentage`, `nights`, `voucherCode`, `voucherValue` |
| Cookie banner (GDPR) | `src/lib/cookieConsent.ts`, `src/components/CookieBanner.tsx` | Consent is saved in the browser. Analytics and marketing scripts only load after the visitor agrees |
| Booking widget (Smoobu) | `src/pages/Index.tsx` | Widget URL |
| Chatbot | `src/lib/knowledgeBase.ts` (answers), `src/lib/chatEngine.ts` (logic) | Edit the answers only |
| Guest registration | `/registrierung`, `src/pages/RegistrierungPage.tsx` | Saves to Supabase (`src/lib/supabase.ts`) |
| Admin | `/admin` | Registrations, CSV export, photo check |
| Scroll animations | `src/hooks/useScrollAnimation.ts` | No changes needed |

## Languages
- Active languages are listed in `LANGUAGE_PACK` in `src/lib/i18n.tsx`. Add a code there to switch a language on.
- Every language has its own file, `src/translations/<code>.json`, with keys like `"en.home.hero.title"`.
- To add a new language: add its code, copy `en.json` to `<code>.json`, change the key prefixes, and translate the texts. If the flag or name is missing, add it in `src/components/LanguageSelector.tsx`.
- Ready-made files: de, en, sq, fr, it, es, tr, ru, ja, zh.

## Troubleshooting
- **A photo doesn't show:** check that the file name in `public/content/` is exactly right. `/admin` lists missing photos.
- **A text shows as a key** (for example `home.hero.title`): that key is missing in the language file.
- **A new photo doesn't appear in a gallery:** restart the dev server (`npm run dev`).

## Commands
```bash
npm install     # once
npm run dev     # local preview at http://localhost:8080
npm run build   # production build
```
