# Rebrand guide: same website, new company

> **AI agent:** follow this file step by step. Change **only texts, data and photos**.
> Never change the design, components or routes.

---

## Step 1: Get the new company's data
Ask the user for this form. Anything they leave empty becomes `TODO(rebrand)`. Never invent values.

```yaml
name:            # Apartments am Park
legal_name:      # for the Impressum
address:
phone:
email:
instagram:
vat_id:          # UID
register_no:     # Firmenbuch
owner:
smoobu_url:      # booking widget link
viator_url:      # optional
supabase_url:
supabase_key:    # publishable key only
languages: [de, en]
apartments:
  - id: my-apartment   # lowercase-with-dashes
    name: My Apartment
    persons: "1-2"
    size: "35m²"
    price: 50
    description:
```

## Step 2: Create the project folder

1. Copy `projects/apzurquelle/` to `projects/<new-id>/` (lowercase, no spaces).
2. Set `projects/active-project.json` to `{ "active": "<new-id>" }`.
3. Replace the photos in `projects/<new-id>/content/` and **keep the file names**:

```text
common/      logo · voucher · viator-bg
home/        hero · features/(elevator, tv, hair-dryer, wifi, kitchen, towels)
about/       hero · location · gallery/01,02… · why/(location, personality, service, detail)
contact/     hero
apartments-page/ hero      guides-page/ hero
apartments/<id>/  cover · hero · gallery/01,02…
guides/<id>/      cover · de.pdf · en.pdf · steps/01,02…
```
Galleries update by themselves. A PDF button only shows if the PDF file is there.

## Step 3: Edit these files
| # | File | What to change |
|---|---|---|
| 1 | `projects/<new-id>/config/site.json` + `pages.json` | name, email, phone, instagram, viator; switch pages on/off (or use `/admin` → Einstellungen) |
| 2 | `src/lib/data.ts` | apartments (id = photo folder), guides, FAQ, reviews |
| 3 | `src/App.tsx` | for each apartment: one route inside `/:lang` and one redirect at the top |
| 4 | `projects/<new-id>/translations/de.json`, `en.json` (+ other active languages) | all text **values**. Keep the keys. Rename only the `apartments.<id>` keys (dashes become `_`) |
| 5 | `src/components/Footer.tsx`, `src/pages/ContactPage.tsx` | address, phone, map |
| 6 | `src/pages/AboutPage.tsx` | the inline de/en texts |
| 7 | `src/pages/ImpressumPage.tsx`, `DatenschutzPage.tsx`, `AGBPage.tsx` | legal data |
| 8 | `src/pages/Index.tsx` | Smoobu widget URL |
| 9 | `src/lib/knowledgeBase.ts` | chatbot answers, using only facts from the user |
| 10 | `src/pages/RegistrierungPage.tsx` | apartment list, company name |
| 11 | `src/lib/supabase.ts` | Supabase URL + key |
| 12 | `projects/<new-id>/config/offers.json` | promo / voucher, or set `enabled: false` |
| 13 | `index.html` | title + description |

## Step 4: Check
1. Search for the old name. It should no longer appear anywhere:
   `rg -i "zur quelle|zur-quelle|ap-zur|1656615|842 287"`
2. `npm run build` must pass.
3. Open `/admin`. The photo check must be all green.
4. Give the user the list of every `TODO(rebrand)`.

## Rules
- Don't change the design, components or routes.
- Don't invent prices, addresses or legal data.
- Never put secret keys in the code.
- Remind the user that the `admin/admin` login must be replaced before going live.

More background: `docs/OVERVIEW.md`.
