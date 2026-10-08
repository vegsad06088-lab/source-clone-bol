import { siteConfig } from "@/config/site.config";
import offersConfig from "../../../projects/apzurquelle/config/offers.json";
import { useI18n } from "@/lib/i18n";

export default function VoucherBanner() {
  const { t } = useI18n();

  // Check if voucher is enabled and has required config
  if (!offersConfig.voucher.enabled || !offersConfig.voucher.voucherCode || !offersConfig.voucher.voucherValue) {
    return null;
  }

    return (
        <div className="max-w-2xl mx-auto bg-blue-600 rounded-2xl shadow-lg border border-blue-700 flex items-center gap-8 py-16">

            {/* Left side - Promo Image */}
            <div className="flex-shrink-0 pl-6">
                <img
                    src={siteConfig.images.voucher}
                    alt="Voucher Promo"
                    className="w-40 h-40"
                />
            </div>

            {/* Right side - Content */}
            <div className="flex-1 pr-8">
                <h3 className="text-2xl font-bold text-white mb-4">
                    🎉 {t("voucher.banner.title").replace("%%value%%", offersConfig.voucher.voucherValue.toString())}
                </h3>

                <p className="text-base text-white leading-relaxed">
                    {t("voucher.banner.description")
                        .replace("%%value%%", offersConfig.voucher.voucherValue.toString())
                        .replace("%%code%%", offersConfig.voucher.voucherCode)}
                </p>
            </div>

        </div>
    );
}

