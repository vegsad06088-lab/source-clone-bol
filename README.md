# Apartment Website Template

A multi-language website for holiday apartments: home, apartments, about, house guides, contact, chatbot, guest registration and admin.
It's built so that **a new company only changes JSON files and photos**. The design stays the same.

| Guide | For |
|---|---|
| **README.md** (this file) | What can be changed, and where |
| [`docs/REBRAND_GUIDE.md`](docs/REBRAND_GUIDE.md) | Step-by-step guide to switch to a new company (for you or an AI agent) |
| [`docs/OVERVIEW.md`](docs/OVERVIEW.md) | Short technical overview, troubleshooting |
| `docs/archive/` | Old notes, not needed |

---

## 1. Start locally

```bash
npm install      # once
npm run dev      # http://localhost:8080
```
Admin: http://localhost:8080/admin (login `admin` / `admin`, **replace it before going live**).

---

## 2. How the project folder works

All content for a specific company lives under `projects/<name>/`. The active project is set in `projects/active-project.json`:

```json
{ "active": "apzurquelle" }
```

To switch to a different company, change that one line. The Vite config reads it at build time and serves the right config, translations, and photos.

```text
projects/
  active-project.json          ← which project is live
  apzurquelle/                 ← one folder per company
    config/                    ← site.json, pages.json, blocks.json, offers.json
    translations/              ← de.json, en.json, … (one per language)
    content/                   ← all photos and PDFs
```

Everything described below uses paths relative to `projects/apzurquelle/`.

---

## 3. Admin: edit everything from the browser (local only)

Open http://localhost:8080/admin while `npm run dev` is running. Tabs:

| Tab | What you can do | Saved into |
|---|---|---|
| **Seiten & Einstellungen** (Pages & settings) | Switch pages and features on/off with one click; edit any settings file | `config/*.json` |
| **Texte** (Texts) | Search all texts, edit languages side by side (choose languages at the top), save | `translations/<lang>.json` |
| **Fotos & PDFs** | See every photo by page. **Ersetzen** (Replace) uploads a new photo under the same name. In galleries: **Foto hinzufügen** (Add photo) / delete | `content/**` |
| **Foto-Check** (Photo check) | Shows missing photos | none |
| **Gästeregistrierungen** (Guest registrations) | Registrations + CSV export (also on the live site) | Supabase |

- Changes are written **directly into the project files**, and the preview reloads by itself.
- The editing tabs and the file API only exist while running locally. On the published site they are absent, so nobody can change files there.
- To put changes live, publish or deploy again.
- Texts are re-read from disk before saving, so edits made in your code editor at the same time are not overwritten.

### Edit directly on the page
After logging in at `/admin` (locally), open any page and click **Seite bearbeiten** (Edit page) at the bottom left:
- Every block (section) gets a **Sichtbar / Ausgeblendet** (Visible / Hidden) switch, saved in `config/blocks.json` (`{"hidden": {"/about": [2]}}` = 2nd block on About is hidden).
- Click any text to edit it in DE / EN / SQ.
- Click any photo to replace it.

## 4. JSON settings files

### `config/pages.json`: which pages are active
```json
{
  "pages": {
    "apartments": true,     // /apartments + every apartment detail page
    "about": true,          // /about  (Über uns)
    "anleitungen": true,    // /anleitungen + every guide page
    "contact": true,        // /contact
    "chat": true,           // /chat (full-page chatbot)
    "registrierung": true   // /registrierung (guest registration form)
  },
  "features": {
    "chatWidget": true      // floating chat bubble at the bottom right of every page
  }
}
```
`false` hides the page from the menu and the footer, and its address shows "Not found".
Home, the legal pages (Impressum, Datenschutz, AGB, Cookies) and Admin are always on.

### `config/site.json`: company data
| Key | Meaning |
|---|---|
| `brand.name` | Company name (logo alt text, page texts) |
| `contact.email` / `contact.phone` | Contact data |
| `contact.instagram` | Instagram link |
| `booking.viatorUrl` | Link of the "Vienna tours" (Viator) box |

### `config/offers.json`: discount banner and voucher
| Key | Meaning |
|---|---|
| `promo.enabled` | Show the "save X% from N nights" banner |
| `promo.percentage` / `promo.nights` | Discount % and minimum nights |
| `promo.showAsAlert` | Also show a pop-up on the first visit |
| `voucher.enabled` | Show the voucher box |
| `voucher.voucherCode` / `voucherValue` / `currency` | Code, value, currency |

### `translations/<lang>.json`: all texts
One file per language (`de`, `en`, `sq`, `fr`, `it`, `es`, `tr`, `ru`, `ja`, `zh`).
Keys look like `"de.home.hero.title"`. **Change only the text on the right**, never the key.
Which languages are visible is set in `LANGUAGE_PACK` in `src/lib/i18n.tsx`.

### Not yet JSON (edit the TypeScript file)
| What | File |
|---|---|
| Apartments (id, persons, size, price), guides list, FAQ, reviews | `src/lib/data.ts` |
| Guide step-by-step content | `src/pages/AnleitungDetailPage.tsx` |
| Chatbot answers | `src/lib/knowledgeBase.ts` |
| Smoobu booking widget link | `src/pages/Index.tsx` |
| Address and map | `src/components/Footer.tsx`, `src/pages/ContactPage.tsx` |

---

## 5. Photos: where each photo goes

All photos are in **`projects/apzurquelle/content/`**. Replace a file with the **same name** and the page changes. No code is needed.

| Folder / file | Shown on | Size (recommended) |
|---|---|---|
| `common/logo.avif` | Menu bar, every page | about 400×120, transparent |
| `common/viator-bg.avif` | "Vienna tours" box (Apartments, About, Guides, Contact) | 1920×600 |
| `common/voucher.png` | Voucher box (character / mascot) | 400×400, transparent |
| `home/hero.avif` | Home: big top photo | 1920×1080 |
| `home/features/elevator.avif` … `towels.avif` | Home: 6 equipment tiles (elevator, tv, hair-dryer, wifi, kitchen, towels) | 800×600 |
| `about/hero.jpg` | About: top photo | 1920×1080 |
| `about/gallery/01.avif, 02.avif …` | About: photo slider (any number) | 1600 px long side |
| `about/location.avif` | About: location photo | 1200×800 |
| `about/why/location / personality / service / detail.avif` | About: "Why guests love us" 4 tiles | 800×600 |
| `apartments-page/hero.avif` | Apartments page: top photo | 1920×1080 |
| `apartments/<id>/cover.avif` | Apartment card (Home + Apartments) | 1200×800 |
| `apartments/<id>/hero.avif` | Apartment detail: top photo | 1920×1080 |
| `apartments/<id>/gallery/01.avif …` | Apartment detail: gallery and fullscreen viewer (any number, sorted by number) | 1600 px long side |
| `guides-page/hero.avif` | Guides page: top photo | 1920×1080 |
| `guides/<id>/cover.avif` | Guide card | 1200×800 |
| `guides/<id>/steps/01.avif …` | Guide detail: step photos | 1200 px wide |
| `guides/<id>/de.pdf`, `en.pdf` | Guide PDF download buttons (shown only if the file exists) | none |
| `contact/hero.avif` | Contact: top photo | 1920×1080 |

- `<id>` = the apartment or guide id from `src/lib/data.ts` (for example `cosy-couple-nest`).
- Galleries pick up new photos automatically. Restart `npm run dev` if one doesn't appear.
- Using `.jpg` instead of `.avif` works if you also change the path in `src/config/site.config.ts`.
- `/admin` → Template-Status shows any missing photo.

---

## 6. Project structure (short)

```text
projects/
  active-project.json        which project is live
  apzurquelle/
    config/                  pages.json · site.json · blocks.json · offers.json
    translations/            texts per language
    content/                 photos + PDFs (see section 5)
src/
  config/site.config.ts      reads the project JSON + photo paths
  lib/data.ts                apartments, guides, FAQ, reviews
  pages/                     one file per page
  components/                menu, footer, banners, admin tools
project-resolver.ts          Vite plugin: resolves the active project folder
vite.config.ts               photo scanner + local settings editor
```

## 7. Publish
Run `npm run build`, then deploy (Lovable Publish, Vercel, …). Settings changed locally are only part of the live site after you publish again.
