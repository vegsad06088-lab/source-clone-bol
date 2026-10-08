# 🏥 Apotheke Website (Wien) — Project Requirements (No Shop)

**Document purpose:** This is the requirement/specification for a **professional pharmacy ("Apotheke") website in Vienna** without an online shop.  
The website's job is **trust, clarity, local discoverability, and fast contact** — not e-commerce.

**Launch:** Production-ready, all languages (DE + EN + SQ + RU + TR) from day one.

---

## Explicit Non-Goals (Out of Scope)
- ❌ No checkout, payments, accounts, or online sales.
- ❌ No medical "promises" or outcomes ("guaranteed healing", etc.).
- ❌ No "News" section unless the client commits to maintaining it (outdated content destroys credibility).
- ❌ No copying official texts unless licensing is verified; official information will be linked, not duplicated.

---

## 1) Project Goals (Non‑Negotiable)

1. **Instant trust (5–10 seconds)**
   - Real photos, real team (if enabled), real location, consistent branding.
   
2. **Instant action (mobile-first)**
   - Phone, route, opening hours, notdienst link are always easy to find.
   
3. **Legal safety (AT/EU compliant)**
   - Correct, complete Austrian/EU compliance pages and consent concept.
   
4. **Local SEO foundation**
   - The website must rank for local intent search (e.g., "Apotheke 10xx Wien").
   
5. **Maintainability**
   - No pages that become stale. Clear responsibility for updates.
   
6. **Multilingual professionalism**
   - All 5 languages (DE/EN/SQ/RU/TR) launch together, SEO-correct, fast, consistently translated.

---

## 🛠️ Tech Stack

```
Frontend Framework    → React 18 with TypeScript
Build Tool           → Vite
Styling              → Tailwind CSS + PostCSS
UI Components        → shadcn-ui + Lucide Icons
State Management     → React Context (i18n)
Routing              → React Router v6
HTTP Client          → Fetch API
Deployment           → Vercel
Testing              → Vitest + Playwright
```

---

## 2) Language Scope (All Languages Delivered Day 1)

**Canonical/source language:** German (DE)  
**Launch languages:** English (EN), Albanian (SQ), Russian (RU), Turkish (TR)

### 2.1 Multilingual architecture (strict, no shortcuts)

- **URL structure (language-specific):**  
  `/de/...`, `/en/...`, `/sq/...`, `/ru/...`, `/tr/...`
  
  No default unprefixed URLs (e.g., no `/apartments` alone). Every route has a language prefix.

- **Language routing (URL drives language state, not vice versa):**
  - User navigates to `/en/kontakt` → UI renders in English
  - User clicks language switcher to "Русский" → URL changes to `/ru/kontakt` → UI updates
  - Language selection is **persisted** in localStorage for future visits
  - Visiting a language prefix URL that doesn't exist (e.g., `/xyz/kontakt`) → redirects to `/de/kontakt`

- **Homepage routing:**
  - `/` → redirects to `/de` (canonical default)
  - Language detection (optional):
    - If user has stored language preference → redirect to that language's home
    - Otherwise → default to `/de`

- **SEO correctness (per language):**
  - Each language has unique title, meta description, og:image
  - hreflang tags link all language variants to each other
  - Canonical tag points to the specific language URL (not self-referential)

### 2.2 Translation workflow (quality gates)

**Input:** Client provides German text for all pages

**Output:** All 5 languages delivered on launch day

**Translation sourcing (choose one):**

1. **Professional translations** (recommended for medical/legal credibility)
   - Client provides pre-translated files (EN/SQ/RU/TR) or hires professional translator
   - Developer integrates and tests all language versions
   
2. **Client-provided translations** (cost-effective option)
   - Client translates content or uses their own resources
   - Client reviews and approves each language before deployment

**Legal pages translation strategy (decide now):**
- Option A: German-only with note "Rechtlich verbindlich ist die deutsche Version" (RECOMMENDED)
- Option B: Client provides lawyer-approved translations for all legal pages (EN/SQ/RU/TR)

### 2.3 Language switcher (user-facing, always visible)

- Header placement: top-right (standard)
- Display format: **native language names** (not flags alone)
  - Deutsch
  - English
  - Shqip
  - Русский
  - Türkçe
- Behavior: clicking a language → navigates to same page in that language
- Remember preference for next visit

---

## 3) Sitemap / Pages (All Languages, All Versions)

### 3.1 Core pages (recommended baseline for a professional apotheke)

These pages are recommended for every pharmacy website and are typically always enabled:

1. **Startseite (Home)** ← *Core*
2. **Kontakt & Anfahrt** (Contact & Getting There) ← *Core*
3. **Impressum** (Imprint/Legal Info) ← *Core*
4. **Datenschutzerklärung** (Privacy Policy) ← *Core*
5. **Leistungen & Beratung** (Services & Consultation) ← *Core*
6. **FAQ** (Practical pharmacy questions)
7. **Notdienst-Termine** (Emergency Service Dates) ← *Toggleable*

### 3.2 Optional pages (toggleable with feature flags)

These pages are controlled by config switches. If disabled: removed from nav, routes, internal links, sitemaps.

- **Team** (staff profiles and photos)
- **Sortiment / Produkte** (Showcase only, no shop)
  - Disclaimer required: "Beispielsortiment – Verfügbarkeit kann variieren."
- **Über uns** (About the pharmacy)
- **Karriere** (Job listings / recruitment)
- **Gesundheitsinfos & Links** (Health information and official links)

---

## 4) Page Toggle System (Feature Flags) — Required in Code

The project must include a **central configuration file** to enable/disable all pages flexibly. This system is designed to support multiple pharmacy websites (different countries, different requirements).

### 4.1 Example config structure
```typescript
siteConfig.pages = {
  // MANDATORY (core pages - always recommended to enable)
  home: { enabled: true },           // Core
  contact: { enabled: true },        // Core
  impressum: { enabled: true },      // Core
  datenschutz: { enabled: true },    // Core
  leistungen: { enabled: true },     // Core
  
  // OPTIONAL (can be enabled/disabled per client)
  team: { enabled: true },
  assortment: { enabled: true },
  about: { enabled: false },
  careers: { enabled: false },
  health: { enabled: true },
  notdienstTermine: { enabled: true },
}
```

### 4.2 Hard rules for toggling (no shortcuts)

Disabling a page must remove it from:
1. **Navigation** (navbar + footer)
2. **Route definitions** (app router; no route exists)
3. **Internal links** (no hero teasers, no sitemap, no breadcrumbs that point to it)
4. **Language versions** (if EN version disabled, DE version also disabled; all or nothing per page)

When a user tries to visit a disabled page URL (e.g., `/de/team`):
- Respond with **404 page** (clearest) **or** redirect to homepage
- Do NOT render the page silently

### 4.3 Flexibility for different markets

The toggle system is designed to be flexible:
- **Vienna pharmacy:** All core pages enabled, optional pages enabled/disabled per client preference
- **Another country:** Can modify default `enabled` values in config to suit local legal/business requirements
- **Future expansion:** New pages can be added to config with `enabled: true/false` without breaking existing sites

---

## 5) UX / UI Requirements ("Pharmacy-grade Professional")

### 5.1 Header & mobile behavior (must-have for all devices)

The website must be **fully responsive** and function perfectly on:
- 📱 Mobile phones (320px – 767px)
- 📱 Tablets (768px – 1024px)
- 🖥️ Desktops (1025px+)

**Desktop header includes:**
- Logo + site name (left)
- Navigation menu (center)
- Language switcher (right)
- Phone (click-to-call)
- Opening hours shortcut

**Tablet header:**
- Logo + hamburger menu (left)
- Language switcher (right)
- Sticky action bar at bottom with: Call / Route / Hours

**Mobile header (320px – 667px):**
- Logo (left) + hamburger menu (left)
- Language switcher (right or in menu)
- **Persistent sticky CTA bar** (bottom or top) with icons only:
  - 📞 **Call** (click-to-call, opens phone dialer)
  - 🗺️ **Route** (opens Google Maps to pharmacy)
  - ⏰ **Hours** (shows "now open/closed" status)

**All screen sizes:**
- Touch-friendly buttons (minimum 44px × 44px)
- Readable fonts (min 16px base font)
- Sufficient spacing between interactive elements
- No horizontal scroll required
- Images scale properly (no distortion)

### 5.2 Notdienst (Emergency Service Dates)

### 5.2 Notdienst (Emergency Service Dates)

The pharmacy can be configured to display emergency service dates (when the pharmacy is on night/weekend duty).

**Features:**
- Toggleable via config: `pages.notdienstTermine.enabled`
- Shows dates throughout the year when pharmacy is on emergency duty
- Example format:
  - **Date:** January 15–16, 2025 (Saturday–Sunday)
  - **Hours:** 9:00 – 20:00
  - All 5 languages supported
  
**Example data (10 emergency dates throughout the year):**
```
1. January 15–16, 2025 (Saturday–Sunday)
2. February 22–23, 2025 (Saturday–Sunday)
3. March 29–30, 2025 (Saturday–Sunday)
4. April 19–20, 2025 (Saturday–Sunday)
5. May 17–18, 2025 (Saturday–Sunday)
6. June 21–22, 2025 (Saturday–Sunday)
7. July 26–27, 2025 (Saturday–Sunday)
8. August 23–24, 2025 (Saturday–Sunday)
9. September 27–28, 2025 (Saturday–Sunday)
10. October 25–26, 2025 (Saturday–Sunday)
```

**If disabled (`notdienstTermine: { enabled: false }`):**
- Emergency service page removed from navigation
- Link to official Austrian notdienst lookup available in footer instead
- Not shown in sitemap

**If enabled (`notdienstTermine: { enabled: true }`):**
- Page accessible in all 5 languages
- Can be updated by client (who updates: client responsibility)
- Mobile-friendly table format
- Always findable from header/footer

### 5.3 Content rules (strict, no medical claims)

- Use clear, short blocks. No walls of text.
- No medical guarantees. No "cures", "heals", or "diagnoses".
- Product showcase must include:
  - Disclaimer: "Beispielsortiment – Verfügbarkeit kann variieren."
  - Only show products/brands if you have rights to display them
- Service descriptions: what it is, who it helps, timeframe, what to bring

### 5.3 Photography (must be real, not stock)

**Minimum photo set required:**
- **Exterior:** pharmacy storefront (recognizable address/name visible)
- **Interior:** pharmacy interior or consultation space
- **Staff/Team:** at least 1–2 images of real staff or team (optional if `pages.team.disabled`)

Stock photos are allowed only as **fallback** (e.g., placeholder) and must not imply medical expertise.

---

## 6) Legal / Compliance (Austria + EU DSGVO/GDPR)

> Implementation follows best-practice standards; final legal approval remains with client and/or their legal advisor.

### 6.1 Required legal pages (German + translations decided below)

**Impressum** (Austrian requirements)
- Name of business
- Responsible person (Betreiber/Konzessionsinhaber:in)
- Address, phone, email
- Company register info (if applicable)

**Datenschutzerklärung** (DSGVO/GDPR)
- Hosting provider and data processing
- Contact form handling + data retention
- Embedded third-party services (maps/video/fonts/analytics)
- User rights under DSGVO

**Cookies / Consent UI** (if applicable)
- If using Google Maps, analytics, external fonts, tracking: implement consent
- Buttons: Accept / Reject / Settings
- Non-essential scripts blocked until consent given
- **Recommended:** privacy-minimal default (no tracking, no analytics)

**Barrierefreiheitserklärung** (Accessibility Statement)
- Recommended for professional standard
- Documents conformance level and known limitations

### 6.2 Legal page translation strategy (decide now)

Choose one:

**Option A (Recommended for speed & simplicity):**
- Impressum: German only
- Datenschutz: German only
- Note: "Rechtlich verbindlich ist die deutsche Version"
- Other languages show the German version with a banner above it

**Option B (If client requires full multilingual legal):**
- Client provides lawyer-approved translations (EN/SQ/RU/TR)
- Or developer can suggest professional translation service (cost to client)
- Each language has its own legal pages (more complex, more expensive)

### 6.3 Content & image rights (client responsibility)

Client must confirm **written approval** for:
- Photos of staff/premises (original or rights statement)
- Logos, brand materials
- Third-party images (license type stored/documented)

---

## 7) SEO Requirements (Local-first, multilingual)

### 7.1 On-page SEO (per language, per page)

- Unique title tag (per page, per language)
- Unique meta description (per page, per language)
- Proper heading hierarchy (H1, H2, H3…)
- Alt text for images (translatable)

### 7.2 Technical SEO

- **hreflang implementation:** All language variants linked to each other
- **Canonical tags:** Each page points to its own URL (not all to /de)
- **NAP consistency:** Name/Address/Phone match Google Business Profile exactly
- **Structured data:** `LocalBusiness` + `Pharmacy` schema markup
- **Image optimization:** AVIF/WebP format, lazy loading, responsive sizes

### 7.3 Performance (non-negotiable)

- First Contentful Paint (FCP): < 2s
- Lighthouse Score: ≥ 80 on mobile
- Images optimized (no bloated JPEGs)
- Minimal third-party scripts

---

## 8) Technical Architecture

### 8.1 Configuration (single source of truth)

```
src/config/siteConfig.ts
- pages: { home, contact, impressum, datenschutz, leistungen, team, assortment, about, careers, health, notdienstTermine } → { enabled: bool }
- languages: ["de", "en", "sq", "ru", "tr"]
- defaultLanguage: "de"  // Configurable per country (e.g., "en" for English-speaking markets)
- businessData: { name, phone, address, hours, email }
- privacyConsent: { useMaps, useAnalytics, useTracking }
- notdienstDates: [ { startDate, endDate, hours }, ... ]  // 10 example dates throughout year
```

### 8.2 Routing (language-aware)

- All routes nested under `/:lang`
- Middleware validates `lang` is in `LANGUAGE_PACK`, else redirects to `/de`
- `/` redirects to `/de` (or user's stored preference)
- Optional pages check `siteConfig.pages.{pageName}.enabled` before rendering route

### 8.3 Translations (per-language JSON files, all 5 languages)

```
src/translations/
├── de.json
├── en.json
├── sq.json
├── ru.json
└── tr.json
```

- Shared translation keys (e.g., `nav.home`, `service.consultation`)
- Legal pages: if using "German-only legal" strategy, keys reference DE file only
- All 5 languages deployed simultaneously

### 8.4 Language persistence (configurable per market)

- localStorage key: `preferredLanguage`
- **Default language (configurable per country):**
  - Currently set to: **DE (German)** for Vienna
  - Can be changed in config for other markets (e.g., `en` for UK market, `sq` for Albania)
- On first visit, read stored preference; if exists → redirect to `/that-language/home`
- When user switches language → update localStorage + navigate
- This allows the same website template to be deployed in different countries with different default languages

---

## 9) Content Required From Client (Input Checklist)

Project cannot be completed until client supplies:

### Business data
- [ ] Exact business name (as on Google Business Profile)
- [ ] Address + postal code
- [ ] Phone + email
- [ ] Opening hours (incl. holiday rule: who updates, how often)

### Services & positioning
- [ ] List of services offered (only truth; no exaggeration)
- [ ] Any specialties / focus areas (e.g., Dermokosmetik, Diabetes, Beratung)
- [ ] Do you offer: Blutdruckmessung, Rezeptur, Medikationscheck, Reiseberatung, etc.?

### Content & copy
- [ ] German text for all pages (developer can draft + client approves, or client provides)
- [ ] Translations (EN/SQ/RU/TR): 
  - Client provides pre-translated, **OR**
  - Client approves AI drafts + signs off per language

### Assets & branding
- [ ] Logo (SVG/PNG preferred)
- [ ] Brand colors (if any specific palette)
- [ ] Photos: exterior, interior, team (if `pages.team.enabled`)
- [ ] **Explicit usage rights confirmation** for all photos

### Legal inputs
- [ ] Impressum data (Konzessionsinhaber:in, company info)
- [ ] Privacy policy decisions:
  - Does website use Google Maps? (Y/N)
  - Does website use analytics? (Y/N)
  - Does website use advertising pixels? (Y/N)
- [ ] Legal page strategy: German-only or full multilingual?

### Page toggles (decide now)
- [ ] Team page: enable or disable?
- [ ] Sortiment/Products showcase: enable or disable?
- [ ] About us: enable or disable?
- [ ] Careers: enable or disable?
- [ ] Health links: enable or disable?
- [ ] Notdienst-Termine (Emergency dates): enable or disable?
- [ ] If enabled: provide emergency service dates for the year

### Process & responsibility
- [ ] Who is primary decision maker / contact?
- [ ] Who approves translations?
- [ ] Who updates opening hours / content changes post-launch?
- [ ] Post-launch maintenance: who is responsible?

---

## 10) Acceptance Criteria (Definition of Done)

A project is considered **production-ready** only when:

✅ **Multilingual** (all 5 languages tested)
- All mandatory pages exist in DE/EN/SQ/RU/TR
- Optional pages follow toggle settings (disabled → removed from nav + routes + sitemaps)
- Language switcher works on all devices
- Navigating between languages preserves current page structure (e.g., `/de/leistungen` → click "English" → `/en/services`)

✅ **Content & copy**
- No placeholder text
- All translations reviewed (client sign-off or AI + review document)
- Disclaimer visible where needed (product showcase, etc.)

✅ **Trust & UX**
- Real photos (not stock) displayed
- Phone, opening hours, route always accessible (especially mobile)
- Contact form works end-to-end (emails delivered, no spam)
- "Heute geöffnet?" indicator correct (if implemented)

✅ **Legal & compliance**
- Impressum page complete + correct
- Datenschutz page complete + addresses all services used
- Cookie banner (if non-essential services used) functional
- hreflang / canonical tags correct in HTML
- No missing translations on visible UI

✅ **Performance**
- All images optimized (AVIF/WebP)
- Mobile Lighthouse score ≥ 80
- Page loads < 2s on 4G
- No console errors/warnings

✅ **Accessibility**
- Keyboard navigation works
- Focus states visible
- Sufficient color contrast
- Images have alt text (in all languages if text)

✅ **SEO foundations**
- Google Business Profile info matches site (NAP)
- Structured data markup valid
- URL structure is clean language-prefixed URLs
- No broken internal links

---

## 11) Delivery Timeline

**Assumptions:**
- Client supplies all content/photos/text upfront
- Translations (EN/SQ/RU/TR) provided or approved within 3 business days
- Decision on page toggles made before development starts
- Legal page strategy decided (Option A or B) upfront

**Realistic timeline:**

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| Kickoff + setup | 1–2 days | Config, design tokens, translation setup |
| Core pages (DE) | 3–5 days | Startseite, Leistungen, Kontakt, Impressum, Datenschutz, FAQ, Notdienst |
| Optional pages (if enabled) | 1–2 days | Team, Sortiment, About, Careers, Health |
| Translations (EN/SQ/RU/TR) | 2–3 days | Integrate + test all languages |
| SEO + performance | 1–2 days | hreflang, canonical, image optimization, Lighthouse |
| Testing + QA | 1–2 days | All languages, all devices, all links |
| **Total** | **~1.5–2.5 weeks** | **Production-ready site, all 5 languages** |

---

## 12) Optional Add-ons (Only if explicitly booked, extra scope)

- **Product inquiry form** (no checkout; inquiry only)
- **Appointment/reservation request** (if applicable)
- **Maintenance SLA** (post-launch: hours updates, content changes, translation corrections)
- **Analytics dashboard** (privacy-friendly setup + monthly review)
- **SEO monitoring** (local keyword tracking, monthly report)

---

## 13) Final Statement (Ruthless but Fair)

A pharmacy website's reputation is damaged more by:
- **Wrong opening hours** than by simple design
- **Stale content** than by missing animations
- **Broken language switching** than by a plain color palette
- **Missing legal pages** than by lack of "polish"

**The standard is: correct, fast, trustworthy, maintainable — in all 5 languages.**

**No phases. All languages launch together, or we don't launch.**

---

## Questions to Confirm Before Starting

1. **Languages final:** DE + EN + SQ + RU + TR confirmed?
2. **Page toggles:** Which optional pages do you want enabled?
3. **Legal strategy:** Option A (DE-only legal) or Option B (client provides translations)?
4. **Translations:** Who provides them (client provides / professional translator)?
5. **Photos:** Client will supply all photos with usage rights?
6. **Emergency dates:** Will you provide Notdienst-Termine? If yes, how many dates throughout the year?
7. **Timeline:** When do you need this live?

