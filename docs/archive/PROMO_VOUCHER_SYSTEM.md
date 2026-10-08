# Dynamic Promo & Voucher System

## Overview

This system allows you to dynamically configure promo banners and vouchers without changing code. Simply edit the `offers.json` configuration file.

## Files

- **Configuration:** `src/config/offers.json`
- **PromoBanner Component:** `src/components/PromoBanner.tsx`
- **VoucherBanner Component:** `src/components/VoucherBanner.tsx`
- **Promo Alert Hook:** `src/hooks/usePromoAlert.ts`

## Configuration (offers.json)

```json
{
  "promo": {
    "enabled": true,           // Enable/disable promo banner
    "percentage": 20,          // Discount percentage (e.g., 20 for 20%)
    "nights": 4,               // Minimum nights to get discount
    "showAsAlert": true        // Show alert when page first loads
  },
  "voucher": {
    "enabled": false,          // Enable/disable voucher banner
    "voucherCode": "SUMMER2024", // Voucher code to display
    "voucherValue": 50,        // Discount value in currency
    "currency": "EUR"          // Currency code
  }
}
```

## How to Use

### 1. Configure Promo Banner

Edit `src/config/offers.json`:

```json
{
  "promo": {
    "enabled": true,
    "percentage": 15,
    "nights": 6,
    "showAsAlert": true
  }
}
```

**Result:** 
- Banner displays: "Bis zu 15% sparen ab 6 Nächten!"
- Alert shows on first page load

### 2. Disable Promo Banner

Set `enabled` to `false`:

```json
{
  "promo": {
    "enabled": false
  }
}
```

### 3. Enable Voucher Banner

Edit `src/config/offers.json`:

```json
{
  "voucher": {
    "enabled": true,
    "voucherCode": "WINTER2024",
    "voucherValue": 75,
    "currency": "EUR"
  }
}
```

**Result:** 
- Voucher displays in Anleitung tabs
- Users can copy the code with one click

### 4. Quick Examples

**Example 1: 20% off for 4+ nights with alert**
```json
{
  "promo": {
    "enabled": true,
    "percentage": 20,
    "nights": 4,
    "showAsAlert": true
  }
}
```

**Example 2: 15% off for 6+ nights, with €50 voucher**
```json
{
  "promo": {
    "enabled": true,
    "percentage": 15,
    "nights": 6,
    "showAsAlert": false
  },
  "voucher": {
    "enabled": true,
    "voucherCode": "SUMMER20",
    "voucherValue": 50,
    "currency": "EUR"
  }
}
```

**Example 3: No promo, only voucher**
```json
{
  "promo": {
    "enabled": false
  },
  "voucher": {
    "enabled": true,
    "voucherCode": "NEW2024",
    "voucherValue": 100,
    "currency": "EUR"
  }
}
```

## Where Components Display

### PromoBanner
- **Location:** `src/components/Layout.tsx` (in main layout)
- **Display:** Top of every page
- **Behavior:** Shows/hides based on `promo.enabled` config

### VoucherBanner
- **Location:** Add to Anleitung tabs (e.g., `src/pages/AnleitungenPage.tsx`)
- **Display:** Can be added anywhere needed
- **Behavior:** Shows/hides based on `voucher.enabled` config

### Promo Alert
- **Location:** Add to main page/layout with `usePromoAlert()` hook
- **Behavior:** Shows once per session when `promo.showAsAlert` is true

## Smart Features

✅ **Dynamic Text Construction** - Messages automatically use the configured values
✅ **Multi-language Support** - Automatically shows text in user's language (de, en, sq, ru)
✅ **Smart Display Logic** - Only shows if enabled AND values are configured
✅ **Session-based Alert** - Alert only shows once per browser session
✅ **Easy Copy** - Voucher code has built-in copy-to-clipboard button
✅ **No Code Changes Needed** - Just edit the JSON file!

## Future Enhancements

- Add date-based restrictions (show only during certain dates)
- Add multiple voucher codes
- Add email integration for sending voucher codes
- Add tracking for promo usage
- Add A/B testing different percentages

---

**For any changes, simply edit `src/config/offers.json` and save!** 🚀

