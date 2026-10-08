# Quick Troubleshooting Guide

## Images Not Loading? Follow These Steps:

### Step 1: Check Browser Console
```
Open DevTools (F12) → Console tab
Look for errors like:
- "Image failed to load: /images/..."
- Network errors (404, CORS, etc.)
```

### Step 2: Verify Public Folder Structure
```
public/
├── images/
│   ├── logo.avif ✓
│   ├── 652938d0b1ddde3e7ecc4cac_151351.avif ✓
│   ├── twin-harmony-suite/ ✓
│   ├── duo-deluxe-studio/ ✓
│   ├── cosy-couple-nest/ ✓
│   └── trio-harmony-suite/ ✓
```

### Step 3: Check Dev Server
```bash
# Start dev server
npm run dev

# Server should output:
# Local:   http://localhost:8081/
```

### Step 4: Test Image URL Directly
```
In browser, try: http://localhost:8081/images/logo.avif
Should display the image or show a browser error
```

### Step 5: Check Vite Config
```typescript
// vite.config.ts should have:
export default defineConfig({
  publicDir: "public",  // ← This is important
  // ...
});
```

## Common Issues & Solutions

### Issue: Images show as 404
**Solution:** 
- Check filename spelling (case-sensitive)
- Verify file exists in `public/images/` folder
- Check for special characters in filenames

### Issue: Images load slowly
**Solution:**
- Check browser Network tab for slow requests
- Images may be large AVIF files
- Consider optimizing image sizes

### Issue: AVIF not supported
**Solution:**
- Use `<picture>` tag with multiple formats:
```typescript
<picture>
  <source srcSet="image.webp" type="image/webp" />
  <source srcSet="image.avif" type="image/avif" />
  <img src="image.png" alt="fallback" />
</picture>
```

### Issue: CSS Background Images Not Showing
**Solution:**
- Ensure CSS paths use `url()` correctly
- Check browser DevTools for CSS parsing errors
- Verify quote style: `url('/images/...')`

## Debugging Commands

```bash
# Build for production (catches more errors)
npm run build

# Run dev server with verbose output
npm run dev 2>&1

# Check specific file
ls -la public/images/filename.avif
```

## Browser Console Diagnostics

```javascript
// Check if image loads and dimensions
const img = new Image();
img.onload = () => console.log('Success:', img.width, img.height);
img.onerror = () => console.log('Failed to load');
img.src = '/images/logo.avif';

// Check AVIF support
const canvas = document.createElement('canvas');
console.log(canvas.toDataURL('image/avif').startsWith('data:image'));
// true = supported, false = not supported
```

## Key Files to Check

1. **CSS Heights**: `src/index.css`, `src/App.css`
2. **Hero Images**: Pages in `src/pages/`
3. **Vite Config**: `vite.config.ts`
4. **Public Folder**: `public/images/`
5. **Error Handling**: Look for `onError` handlers

## Still Having Issues?

Check the error message in browser console and compare with:
- `IMAGE_LOADING_FIX.md` - Full technical details
- `src/hooks/useImageError.ts` - Error handling utility
- All modified page files for the pattern used


