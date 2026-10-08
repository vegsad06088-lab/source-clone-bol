# Smooth Scroll Animations Implementation ✨

## Overview
I've implemented comprehensive scroll-triggered animations across your entire website to make pages feel smooth and dynamic. When users scroll, sections fade in and slide up from the bottom with staggered effects.

## Key Features

### 1. **Custom Hook: `useScrollAnimation`** 🎣
- Located in: `src/hooks/useScrollAnimation.ts`
- Uses Intersection Observer API for optimal performance
- Detects when sections enter the viewport
- Supports configurable delays for staggered animations
- Automatically stops observing after animation triggers

**Usage:**
```typescript
const sectionRef = useScrollAnimation({ threshold: 0.2, delay: 100 });
```

### 2. **CSS Animations** 🎨
Added to `src/index.css`:

- **`fadeUpIn`**: Elements fade in with upward movement (40px)
  - Duration: 0.6s
  - Easing: ease-out
  - Smooth and natural

- **`fadeInScale`**: Elements scale up while fading in (0.95 → 1)
  - Perfect for accent/banner sections
  - Creates emphasis effect

**Utility Classes:**
- `.animate-fade-up-in` - Apply active animation
- `.animate-fade-in-scale` - Apply scale animation
- `.will-animate-fade-up` - Set initial hidden state
- `.will-animate-scale` - Set initial hidden state (scaled)

### 3. **Pages Enhanced with Animations** 📄

#### **Home Page (Index.tsx)**
- ✅ Hero section: Fades in on load
- ✅ Booking widget: Slides up when scrolling
- ✅ Apartment cards: Staggered animations (0.1s between each)
- ✅ Features section: Staggered with 0.05s delays
- ✅ Sustainability CTA: Scale animation
- ✅ Why Us section: Smooth fade-up
- ✅ Reviews cards: Staggered animations
- ✅ FAQ section: Staggered animations

#### **Apartments Page (ApartmentsPage.tsx)**
- ✅ Hero section: Animates in immediately
- ✅ Apartment grid: Staggered cards with progressive delays

#### **Instructions Page (AnleitungenPage.tsx)**
- ✅ Hero: Fade up on load
- ✅ Voucher banner: Scale and fade effect
- ✅ Viator section: Slides up
- ✅ Instructions grid: Staggered card animations

#### **FAQ Section Component (FAQSection.tsx)**
- ✅ Section title: Fades up
- ✅ FAQ items: Staggered with 0.08s delays
- ✅ Expanded content: Quick fade-in animation

### 4. **Animation Timings** ⏱️

| Element | Delay | Duration | Effect |
|---------|-------|----------|--------|
| Main sections | 0-200ms | 0.6s | Fade-up |
| Card grids | 0s per card + 0.1s per index | 0.6s | Staggered fade-up |
| Features | 0s per item + 0.05s per index | 0.6s | Staggered (faster) |
| FAQ items | 0s per item + 0.08s per index | 0.6s | Staggered |
| Accent sections | 150-200ms | 0.6s | Scale + fade |

### 5. **Lazy Loading** 🖼️

Added `loading="lazy"` attribute to all images:
- Hero images: `loading="lazy"`
- Background images in features
- Product images
- Review avatars

This ensures images load only when needed, improving initial page load performance.

## Performance Benefits ⚡

1. **Lightweight**: Uses native Intersection Observer API (no jQuery)
2. **GPU-Accelerated**: Animations use `transform` and `opacity` (best for performance)
3. **Lazy Loading**: Images load on-demand
4. **Efficient**: Animations stop observing after trigger
5. **Mobile Friendly**: Respects user's scroll speed

## Browser Support 🌐

- ✅ Chrome/Edge 51+
- ✅ Firefox 55+
- ✅ Safari 12.1+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Customization 🎯

### Adjust Animation Timing
Edit `src/index.css`:
```css
@keyframes fadeUpIn {
  from {
    opacity: 0;
    transform: translateY(40px);  /* Change distance */
  }
}

.animate-fade-up-in {
  animation: fadeUpIn 0.6s ease-out forwards;  /* Change duration */
}
```

### Change Trigger Threshold
In any page/component:
```typescript
const sectionRef = useScrollAnimation({ 
  threshold: 0.3,  // Trigger when 30% visible (default 0.1)
  delay: 100       // Add delay in ms
});
```

### Add Animations to New Sections
1. Import hook: `import { useScrollAnimation } from "@/hooks/useScrollAnimation";`
2. Create ref: `const ref = useScrollAnimation({ threshold: 0.2 });`
3. Apply to section:
```tsx
<section 
  ref={ref.ref}
  className={`${ref.isVisible ? "animate-fade-up-in" : "will-animate-fade-up"}`}
>
  Content here
</section>
```

## Result 🎉

Your website now feels:
- **Smooth**: Progressive reveals as users scroll
- **Modern**: Professional animation effects
- **Fast**: Optimized lazy loading and CSS animations
- **Engaging**: Users see content appearing dynamically
- **Professional**: Polished, premium feel

Every section reveals progressively, creating a cohesive, smooth browsing experience! 🚀

