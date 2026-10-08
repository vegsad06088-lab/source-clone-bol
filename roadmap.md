# Roadmap

## Phase 1: everything translatable (DE / EN / SQ)
- [x] Move inline `{ de, en }` texts into the translation files, with Albanian added
- [ ] Audit the remaining hard-coded texts (navbar labels, chat widget, registration form)

## Phase 2: edit on the page (local + admin only)
- [x] Block show/hide per page section, saved in `src/config/blocks.json` and applied on the live site
- [x] Click any text → edit DE/EN/SQ → saves into the translation files
- [x] Click any photo → replace the file in `public/content`

## Phase 3: block list in admin
- [ ] Admin tab listing every page's blocks with show/hide

## Phase 4: AI page copy
- [ ] Admin: "copy page X, adapt for Y". The AI writes texts and translations, then you switch old/new (local only, key in `.env`)
