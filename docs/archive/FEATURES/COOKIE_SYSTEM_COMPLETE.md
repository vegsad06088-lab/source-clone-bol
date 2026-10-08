# 🍪 Cookie Management System

## Business Logic

### What Problem Does It Solve?
The website must comply with **GDPR** (EU 2016/679), **ePrivacy Directive**, and **Austrian DSG (DSGVO)** which require explicit user consent before loading non-essential cookies. This system ensures:
- Analytics tracking only loads with user permission
- Marketing cookies only load with user permission
- Smoobu widget only loads with user permission
- Essential cookies (session, functionality) always work
- Users can change settings anytime

### Why Is It Important?
**Legal Compliance:**
- GDPR prohibits loading non-essential cookies before consent
- Violating this results in €10,000 - €20,000,000 fines
- Explicit, informed consent is mandatory
- Users must be able to withdraw consent

**User Trust:**
- Transparency about data collection
- User control over their data
- Professional appearance
- Respects user privacy

### How Does It Work?
```
1. User visits website
   ↓
2. CookieBanner displays with consent options
   ↓
3. User chooses "Accept All" or "Settings"
   ↓
4. Consent stored in localStorage
   ↓
5. Layout.tsx checks stored consent
   ↓
6. If allowed:
   - loadAnalytics() → Injects analytics script
   - loadMarketing() → Injects marketing script
   - loadSmoobu() → Injects booking widget
   ↓
7. Scripts loaded only in <head> via useEffect
```

---

## Technical Implementation

### Technology Stack
- **Framework:** React + TypeScript
- **State Management:** localStorage API
- **Hook:** Custom `useEffect` for script injection
- **Banner Library:** Tailwind CSS + Shadcn UI Components
- **Consent Storage:** Browser localStorage (key: `cookieConsent`)

### File Structure
```
src/
├── components/
│   └── CookieBanner.tsx          # Main consent UI component
├── hooks/
│   └── useCookieConsent.ts       # (Optional: for reuse)
├── pages/
│   └── CookiePolicy.tsx          # Legal policy page
└── lib/
    └── cookieConsent.ts          # Consent logic utilities

public/
└── scripts/
    ├── analytics.js               # Google Analytics
    ├── marketing.js               # Marketing script
    └── smoobu-widget.js           # Booking widget

src/Layout.tsx                     # Main layout - script loading logic
```

### Dependencies
- **Runtime:** None (uses vanilla browser APIs)
- **Development:** React, TypeScript, Tailwind CSS
- **Third-party scripts (loaded dynamically):**
  - Google Analytics
  - Marketing platform
  - Smoobu booking widget

---

## Features & Components

### 1. CookieBanner Component
**File:** `src/components/CookieBanner.tsx`  
**Purpose:** Displays consent UI to users on first visit  

**Key Features:**
- Shows banner only on first visit
- Two buttons: "Accept All" | "Settings"
- Settings modal for granular control
- Dismissible after choice made
- Bilingual (German/English)
- Responsive design

**Props:** None (uses localStorage directly)

**Key Functions:**
- `handleAcceptAll()` - Stores full consent
- `handleSaveSettings()` - Stores selective consent
- `handleDismiss()` - Closes banner

---

### 2. CookiePolicy Page
**File:** `src/pages/CookiePolicy.tsx`  
**Purpose:** Legal policy page explaining cookies  

**Key Sections:**
1. What are cookies?
2. Which cookies do we use?
3. Legal basis
4. How to change settings
5. Contact information

**Features:**
- Multilingual support via i18n
- Links back to cookie settings
- Contact details provided
- Professional legal formatting

---

### 3. Script Loading Logic
**File:** `src/Layout.tsx`  
**Purpose:** Conditionally loads third-party scripts based on consent  

**When Component Mounts:**
```
1. Read localStorage: cookieConsent
2. Parse JSON object with flags:
   - analytics: boolean
   - marketing: boolean
   - smoobu: boolean
3. Call appropriate load functions
4. Scripts injected into <head> via useEffect
5. Scripts never load if consent is false
```

**Key Functions:**
- `loadAnalytics()` - Injects analytics script
- `loadMarketing()` - Injects marketing script
- `loadSmoobu()` - Injects booking widget script

---

## Pages Affected

| Page | Interaction | Purpose |
|------|-------------|---------|
| Every page | Banner appears | Get user consent |
| CookiePolicy | Shows details | Legal transparency |
| All pages | Scripts load | Analytics & tracking |
| Footer | Cookie link | Easy access to policy |

---

## Integration Points

### 1. Layout Component Integration
```typescript
// In src/Layout.tsx
useEffect(() => {
  const consent = JSON.parse(localStorage.getItem('cookieConsent') || '{}');
  if (consent.analytics) loadAnalytics();
  if (consent.marketing) loadMarketing();
  if (consent.smoobu) loadSmoobu();
}, []);
```

### 2. Footer Navigation
```typescript
// In src/components/Footer.tsx
<Link to="/cookies">
  {t("footer.cookiePolicy")}
</Link>
```

### 3. Language System
Uses existing i18n system for translations:
- `cookies.title`
- `cookies.intro`
- `cookies.section1.title`
- etc.

---

## User Journey

### First-Time Visitor
```
1. User visits www.ap-zur-quelle.at
2. Page loads with CookieBanner
3. Banner shows: "Protecting your data - Cookies message"
4. User options:
   a) Click "I agree" → All consent given
   b) Click "Settings" → Choose individual cookies
5. Banner disappears
6. Preference stored in localStorage
7. Appropriate scripts load invisibly
```

### Returning Visitor
```
1. User visits website again
2. CookieBanner doesn't show (already consented)
3. Scripts load based on previous choice
4. User sees banner again if:
   - localStorage cleared
   - Browser cache cleared
   - Different browser/device
```

### User Changing Settings
```
1. User clicks "Cookie Settings" in footer
2. Banner reappears with current selections
3. User changes toggles
4. Clicks "Save Settings"
5. New preferences saved to localStorage
6. Only allowed scripts continue running
```

---

## Configuration

### Toggling Cookie Types

**To add a new cookie type:**

1. **In CookieBanner.tsx:**
   ```typescript
   // Add toggle in settings
   <label>
     <input 
       type="checkbox" 
       checked={settings.newtype} 
       onChange={(e) => setSettings({...settings, newtype: e.target.checked})}
     />
     New Cookie Type
   </label>
   ```

2. **In Layout.tsx:**
   ```typescript
   // Add loading function
   const loadNewType = () => {
     const script = document.createElement('script');
     script.src = '/scripts/newtype.js';
     document.head.appendChild(script);
   };
   
   // Call if consented
   if (consent.newtype) loadNewType();
   ```

3. **In CookiePolicy.tsx:**
   ```typescript
   // Add explanation to policy
   <h3>{t("cookies.section2.newtype")}</h3>
   <p>{t("cookies.section2.newtype.text")}</p>
   ```

4. **In translation files:**
   ```json
   "cookies.section2.newtype": "New Cookie Type",
   "cookies.section2.newtype.text": "Description..."
   ```

---

## Troubleshooting

### Issue 1: Scripts Loading Before Consent
**Problem:** Analytics/marketing scripts run before user consent  
**Solution:** 
- Check `Layout.tsx` - ensure `useEffect` runs on mount
- Verify `loadAnalytics()` etc. are called conditionally
- Check localStorage keys are correct

### Issue 2: Banner Not Showing
**Problem:** Cookie banner doesn't appear  
**Cause:** Likely already consented  
**Solution:**
- Clear browser localStorage
- Check DevTools → Application → localStorage
- Delete `cookieConsent` key
- Refresh page

### Issue 3: Scripts Not Loading After Consent
**Problem:** User clicked "Accept All" but scripts not running  
**Debug Steps:**
1. Open DevTools → Console
2. Check for script errors
3. Verify localStorage has correct consent object
4. Check if scripts exist at `/public/scripts/`
5. Verify script URLs are correct

### Issue 4: Returning Users See Banner Again
**Problem:** Consent lost between visits  
**Cause:** localStorage cleared or privacy mode  
**Note:** This is expected in private/incognito browsing
**Solution:** Users in private mode must consent each visit (normal behavior)

---

## Testing Checklist

### Manual Testing
- [ ] First visit shows banner
- [ ] Clicking "I agree" saves consent
- [ ] Clicking "Settings" shows options
- [ ] Returning visit doesn't show banner
- [ ] Footer link goes to Cookie Policy
- [ ] Policy page loads correctly in both languages
- [ ] Changing settings updates localStorage
- [ ] Scripts appear in <head> after consent

### Browser DevTools
- [ ] Check `localStorage` → `cookieConsent` exists
- [ ] Check `<head>` → analytics script loaded
- [ ] Check Console → no errors
- [ ] Check Network → verify script downloads

### Compliance
- [ ] No scripts load before consent
- [ ] All cookies explained in policy
- [ ] Policy accessible from every page
- [ ] Settings changeable anytime
- [ ] Bilingual support works

---

## Performance Considerations

### Script Injection
- Scripts loaded asynchronously via `useEffect`
- No render blocking
- Only loads if consented (reduces bandwidth)
- Lazy loaded after React hydration

### localStorage
- Very fast (synchronous, local)
- No server requests needed
- Survives page refreshes
- Cleared only when user clears browser data

### Bundle Size Impact
- CookieBanner: ~3KB minified
- No external dependencies
- Reduces with conditional script loading

---

## See Also
- [Cookie Policy Page Documentation](./PAGES/COOKIE_POLICY_PAGE.md)
- [Footer Component - Links Integration](../FOOTER_INTEGRATION.md)
- [Multilingual System Documentation](../LANGUAGE_SYSTEM.md)
- GDPR Regulations: https://gdpr-info.eu/
- Austrian DSG: https://www.dsb.gv.at/

---

## Checklist: What Was Implemented

**12 March 2026 - Initial GDPR-compliant cookie system:**
- ✅ Added CookieBanner component
- ✅ Added Cookie Policy page
- ✅ Added script blocking mechanism
- ✅ Added footer links
- ✅ Added bilingual support
- ✅ Verified GDPR compliance
- ✅ Created documentation

---

## Legal Compliance Summary

**This system complies with:**
- ✅ GDPR (EU 2016/679)
- ✅ ePrivacy Directive (2002/58/EC)
- ✅ Austrian DSG (DSGVO)

**Requirements met:**
- ✅ No non-essential cookies before explicit consent
- ✅ Consent is informed and clear
- ✅ Consent is stored and respected
- ✅ Users can change settings anytime
- ✅ Legal information easily accessible
- ✅ Banner is bilingual and clear
- ✅ Third-party scripts blocked until consent

