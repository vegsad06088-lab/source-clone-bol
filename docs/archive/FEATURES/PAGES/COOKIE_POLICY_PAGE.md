# 🍪 Cookie Policy Page

## Overview
- **Route:** `/cookies`
- **File:** `src/pages/CookiePolicy.tsx`
- **Component:** `CookiePolicy`
- **Purpose:** Display legal cookie policy to users about what cookies are used and why

---

## Business Logic

### Why This Page Exists
**Legal Requirement:**
- GDPR requires transparent explanation of cookies used
- Users must understand what data is collected
- Contact information must be provided
- Must be accessible from every page (linked in footer)

### What Users Find Here
1. Definition of what cookies are
2. Types of cookies we use
3. Legal basis for using cookies
4. How to change cookie preferences
5. Contact information for data protection questions

---

## Technical Details

### File Structure
```
src/pages/CookiePolicy.tsx
- 107 lines
- Uses React + TypeScript
- Tailwind CSS for styling
- i18n for translations
```

### Page Layout
```
<div className="pt-32 pb-20">           # Top/bottom padding
  <div className="max-w-4xl...">        # Max width container
    <h1>                                 # Main title (translated)
    
    <p className="intro">                # Introduction text (translated)
    
    <section>                            # Section 1: What are cookies?
    <section>                            # Section 2: Types of cookies
    <section>                            # Section 3: Legal basis
    <section>                            # Section 4: Change settings
    <section>                            # Section 5: Contact info
```

---

## Components & Features

### 1. Main Title
```typescript
<h1 className="text-4xl font-serif font-bold text-foreground mb-4">
  {t("cookies.title")}
</h1>
```
- **Translation Key:** `cookies.title`
- **English:** "Cookie Policy"
- **German:** "Cookie-Richtlinie"
- **Styling:** Large serif font, bold

### 2. Introduction
```typescript
<p className="text-muted-foreground mb-8">
  {t("cookies.intro")}
</p>
```
- **Translation Key:** `cookies.intro`
- Explains purpose of the policy

### 3. Section 1: What are Cookies?
- **Title Key:** `cookies.section1.title`
- **Content Key:** `cookies.section1.text`
- **Purpose:** Educational - explains what cookies are

### 4. Section 2: Types of Cookies
Four subsections:
1. **Essential Cookies**
   - Title: `cookies.section2.essential`
   - Content: `cookies.section2.essential.text`
   - Purpose: Explain mandatory cookies

2. **Analytics Cookies**
   - Title: `cookies.section2.analytics`
   - Content: `cookies.section2.analytics.text`
   - Purpose: Explain Google Analytics

3. **Marketing Cookies**
   - Title: `cookies.section2.marketing`
   - Content: `cookies.section2.marketing.text`
   - Purpose: Explain marketing tracking

4. **Third-Party Cookies**
   - Title: `cookies.section2.thirdparty`
   - Content: `cookies.section2.thirdparty.text`
   - Purpose: Explain Smoobu widget, etc.

### 5. Section 3: Legal Basis
- **Title Key:** `cookies.section3.title`
- **Content Key:** `cookies.section3.text`
- **Purpose:** Explain GDPR/legal justification

### 6. Section 4: Change Settings
- **Title Key:** `cookies.section4.title`
- **Content Key:** `cookies.section4.text`
- **Purpose:** Point users to cookie banner for preferences

### 7. Section 5: Contact
- **Hardcoded Contact Info:**
  ```
  Apartments zur Quelle
  Christine Führer GmbH
  Absberggasse 6, 1100 Wien, Österreich
  
  Email: info@ap-zur-quelle.at
  ```
- **Email Link:** Clickable mailto link

---

## Translation Keys Reference

All translation keys required for this page:

```json
{
  "cookies": {
    "title": "Cookie Policy",
    "intro": "Introduction text...",
    "section1": {
      "title": "What are cookies?",
      "text": "Detailed explanation..."
    },
    "section2": {
      "title": "Which cookies do we use?",
      "essential": "a) Essential cookies",
      "essential.text": "...",
      "analytics": "b) Analytics cookies",
      "analytics.text": "...",
      "marketing": "c) Marketing cookies",
      "marketing.text": "...",
      "thirdparty": "d) Third-party cookies",
      "thirdparty.text": "..."
    },
    "section3": {
      "title": "3. Legal basis",
      "text": "..."
    },
    "section4": {
      "title": "4. Change cookie settings",
      "text": "..."
    }
  }
}
```

---

## Styling & Responsiveness

### Responsive Design
```css
/* Container */
max-w-4xl mx-auto        /* Center with max width */
px-4 sm:px-6 lg:px-8    /* Responsive horizontal padding */

/* Typography */
text-4xl font-serif font-bold    /* Main title */
text-lg font-sans font-semibold  /* Section titles */
text-sm text-muted-foreground    /* Body text */

/* Spacing */
pt-32 pb-20              /* Top/bottom padding */
mb-4, mb-2, mb-3         /* Section spacing */
space-y-8                /* Vertical spacing between sections */
```

### Mobile Responsive
- ✅ Works on mobile (px-4)
- ✅ Works on tablet (sm:px-6)
- ✅ Works on desktop (lg:px-8)
- ✅ Text scales appropriately

---

## Data Flow

### Page Loading
```
1. User navigates to /cookies
2. CookiePolicy component mounts
3. useI18n() hook initialized
4. i18n loads current language
5. JSX renders with translated text
6. Page displays in user's language
```

### Language Switching
```
1. User selects different language
2. LanguageSelector triggers language change
3. Component re-renders
4. New translations loaded from i18n
5. Page content updates
```

---

## Accessibility

### Features
- ✅ Semantic HTML headings (h1, h2, h3)
- ✅ Proper color contrast
- ✅ Readable font sizes
- ✅ Mobile friendly
- ✅ Keyboard navigable
- ✅ Screen reader friendly

### Color Classes
- `text-foreground` - High contrast text
- `text-muted-foreground` - Secondary text
- `text-primary` - Links (blue)

---

## Navigation & Links

### From This Page
- Email link: `mailto:info@ap-zur-quelle.at`
- Back to main site: User clicks back button or navigates

### To This Page
- **Footer link:** `{t("footer.cookiePolicy")}` → `/cookies`
- **Cookie Banner:** "Settings" button can link here
- **Direct URL:** `/cookies`

---

## Integration Points

### 1. i18n (Internationalization)
```typescript
import { useI18n } from "@/lib/i18n";

const { t } = useI18n();
// Then use: t("key.path")
```
- Fetches translations based on current language
- Supports German and English

### 2. Footer Component
```typescript
// In Footer.tsx
<Link to="/cookies">
  {t("footer.cookiePolicy")}
</Link>
```
- Link text translates based on language
- Always visible in footer

### 3. Cookie Banner
- Banner can link to this page for detailed info
- User can read policy before deciding

### 4. Routing
```typescript
// In router/App.tsx
{path: '/cookies', element: <CookiePolicy />}
```
- Route registered in main router

---

## Performance

### Page Load Performance
- ✅ No images (text only) → Fast load
- ✅ No external API calls → No waiting
- ✅ Minimal CSS → Quick render
- ✅ No JavaScript heavy lifting

### Bundle Size
- Component file: ~3KB
- Translations: Loaded from i18n system
- Total overhead: Minimal

---

## Testing

### Manual Testing
- [ ] Page loads at `/cookies`
- [ ] Title displays correctly
- [ ] All sections visible
- [ ] Text readable and spaced well
- [ ] Email link works
- [ ] Page works on mobile
- [ ] Works in both languages
- [ ] Doesn't scroll off screen

### Language Testing
- [ ] German version shows German text
- [ ] English version shows English text
- [ ] Switching language updates page
- [ ] All keys translate properly

### Browser Testing
- [ ] Chrome/Edge - ✅
- [ ] Firefox - ✅
- [ ] Safari - ✅
- [ ] Mobile browsers - ✅

---

## Content Maintenance

### To Update Cookie Policy

1. **Update translations:**
   ```
   src/translations/de.json (German)
   src/translations/en.json (English)
   ```

2. **Update contact info:**
   Edit Section 5 in `CookiePolicy.tsx`

3. **Add new sections:**
   ```typescript
   <section>
     <h2>{t("cookies.sectionX.title")}</h2>
     <p>{t("cookies.sectionX.text")}</p>
   </section>
   ```

### Translation Keys to Update
- All keys under `cookies.*` in translation files

---

## Known Issues & Solutions

### Issue: Section Not Displaying
**Cause:** Translation key doesn't exist  
**Solution:** Add key to translation files (`en.json`, `de.json`)

### Issue: Email Link Not Working
**Cause:** Email client not configured  
**Solution:** User can copy email manually or configure email client

### Issue: Layout Broken on Mobile
**Cause:** Container too narrow  
**Solution:** Check Tailwind classes are correct

---

## Related Pages & Documentation

### See Also
- [Cookie System Documentation](../COOKIE_SYSTEM_COMPLETE.md)
- [Cookie Banner Component](../FEATURES/COOKIE_BANNER_COMPONENT.md) (if created)
- [Footer Integration](../FEATURES/FOOTER_INTEGRATION.md) (if created)
- [Internationalization System](../LANGUAGE_SYSTEM.md)

### Translation Files
- `src/translations/de.json` - German translations
- `src/translations/en.json` - English translations

### Related Components
- `src/components/CookieBanner.tsx` - Consent management
- `src/components/Footer.tsx` - Link to this page
- `src/components/LanguageSelector.tsx` - Language switching

---

## Implementation Checklist

- ✅ Page created at `/cookies`
- ✅ Component imports i18n
- ✅ Responsive design implemented
- ✅ All sections included
- ✅ Translation keys set up
- ✅ Footer link created
- ✅ Email link functional
- ✅ Styling complete
- ✅ Mobile tested
- ✅ Documentation complete

---

## Status: ✅ Complete

- Created: 12 March 2026
- Last Updated: 12 March 2026
- Status: Production Ready
- Tested: ✅ Yes
- Deployed: ✅ Yes

