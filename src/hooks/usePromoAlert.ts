import { useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import offersConfig from "../../projects/apzurquelle/config/offers.json";

export function usePromoAlert() {
  const { t } = useI18n();

  useEffect(() => {
    // Only show if promo is enabled and configured
    if (!offersConfig.promo.enabled || !offersConfig.promo.showAsAlert) {
      return;
    }

    // Check if alert has been shown in this session
    const alertShownKey = "promo_alert_shown";
    if (sessionStorage.getItem(alertShownKey)) {
      return;
    }

    // Get the alert message template from translations
    const alertTemplate = t("promo.alert");
    
    // Replace template variables with actual values
    const message = alertTemplate
      .replace("%%percentage%%", String(offersConfig.promo.percentage))
      .replace("%%nights%%", String(offersConfig.promo.nights));

    // Show alert after a short delay
    setTimeout(() => {
      alert(message);
      sessionStorage.setItem(alertShownKey, "true");
    }, 1000);
  }, [t]);
}

