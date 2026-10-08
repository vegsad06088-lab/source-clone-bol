import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { X } from "lucide-react";
import offersConfig from "../../../projects/apzurquelle/config/offers.json";

export default function PromoBanner() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return null;
  }

  // Only show promo banner (not voucher - that's handled by VoucherBanner component)
  if (!offersConfig.promo.enabled || !offersConfig.promo.percentage || !offersConfig.promo.nights) {
    return null;
  }

  const percentage = offersConfig.promo.percentage;
  const nights = offersConfig.promo.nights;

  const bannerText = t("promo.banner")
    .replace("%%percentage%%", percentage.toString())
    .replace("%%nights%%", nights.toString());

  return (
    <div className="bg-primary text-primary-foreground text-center py-3 px-4 text-sm font-medium relative">
      {bannerText}
      <button 
        onClick={() => setVisible(false)} 
        className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-foreground/80 hover:text-primary-foreground"
        aria-label="Close promo banner"
      >
        <X size={18} />
      </button>
    </div>
  );
}

