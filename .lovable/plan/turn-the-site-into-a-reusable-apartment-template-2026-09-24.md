# Turn the site into a reusable "apartment template"

## Honest answer
Yes, this can be done, and it's a smart idea. One part needs changing: an admin page in the browser **cannot read your project folders or rebuild the site**. Once the site is live, it is a finished bundle. So the "AI makes it 90% ready" step should happen **while building a copy of the site**, not on the live admin page. The realistic flow:

1. Duplicate the project (remix).
2. Swap the photos in the folders.
3. Fill in one settings file (name, address, prices, apartments, contact, legal details).
4. Ask the AI (Lovable, or any AI with the guide) to follow `TEMPLATE_GUIDE.md`. It fills in texts and translations from your notes.

That gets a new apartment site to about 90% in under 2 hours.

## What gets built

### 1. One clear folder for each page (photos only, fixed file names)
```text
public/content/
  common/        logo.png, favicon.png, owner.png, footer-bg.jpg, viator-bg.jpg
  home/          hero.jpg, welcome.jpg, features/{elevator,tv,wifi,...}.jpg
  about/         hero.jpg, gallery/01.jpg..06.jpg, why/{location,service,...}.jpg
  apartments/
    <apartment-id>/  cover.jpg, hero.jpg, gallery/01.jpg, 02.jpg ...
  guides/
    <guide-id>/      cover.jpg, de.pdf, en.pdf
  contact/       hero.jpg
  instagram/     01.jpg..06.jpg   (footer grid)
```
Fixed names mean you replace a file and never touch the code. Galleries pick up every file in their folder automatically. Numbered files set the display order.

### 2. One settings file: `src/config/site.config.ts`
All business facts live here: brand name, address, phone, email, social links, booking widget ID, map location, company and legal details (Impressum), prices, the apartment list (id, beds, size, persons, price), the guide list, and the voucher code. Pages read from this file only. No business facts stay hard-coded in pages.

### 3. Texts separated from design
- Translations stay in `src/translations/*.json`, grouped by page.
- The chatbot knowledge base moves to `content/knowledge.md`, so it can be swapped as one plain-text file.

### 4. `TEMPLATE_GUIDE.md` (the "how to plug and go" file)
- A step-by-step checklist: which photos go in which folder, with recommended sizes, and which settings to change.
- An "AI instructions" section you paste to the AI: "Read site.config.ts and the photo folders, rewrite the texts and translations for this apartment, update the Impressum, and don't change the layout."
- A final checklist: legal pages, booking widget, email, and the registration link.

### 5. Admin page: "Template status" tab
This is read-only and safe for a live site. It shows which photos are missing or still the defaults, which settings are empty, and which translations are missing. It also displays the guide. It does not use an AI key, so no key is ever exposed in the browser.

### 6. Cleanup
- Delete `public/images/not_used`, the duplicate `src/assets/images`, and the old loose images in the images root.
- Replace the gallery generator script with automatic folder reading.
- Keep old links working.

## Technical details
- Galleries use Vite `import.meta.glob('/public/content/apartments/*/gallery/*')`, or a small build-time manifest, so adding a file needs no code change.
- `site.config.ts` is typed, so a missing field shows up as a build error.
- The status tab compares the expected file list with what is actually there.
- The existing security issue is fixed: the admin login (admin/admin, checked in the browser) is not real security. Recommendation: move it to proper login later.

## Out of scope (for now)
- A browser AI that edits the site (not possible safely). A server-side "AI text generator" could be added later with Lovable Cloud if wanted.
