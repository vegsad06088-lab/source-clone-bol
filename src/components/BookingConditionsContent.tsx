import { useI18n } from "@/lib/i18n";
import { Link } from "react-router-dom";

export default function BookingConditionsContent() {
  const { t, langPrefix } = useI18n();

  return (
    <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
      <h1 className="text-3xl font-serif font-bold text-foreground mb-4">
        {t("bookingConditions.title")}
      </h1>

      <p>{t("bookingConditions.intro")}</p>

      <section>
        <h3 className="text-lg font-sans font-semibold text-foreground mb-3">
          {t("bookingConditions.cancellation.title")}
        </h3>
        <p className="mb-2">{t("bookingConditions.cancellation.free")}</p>
        <p>{t("bookingConditions.cancellation.late")}</p>
      </section>

      <section>
        <h3 className="text-lg font-sans font-semibold text-foreground mb-3">
          {t("bookingConditions.payment.title")}
        </h3>
        <p>{t("bookingConditions.payment.methods")}</p>
      </section>

      <section>
        <h3 className="text-lg font-sans font-semibold text-foreground mb-3">
          {t("bookingConditions.deposit.title")}
        </h3>
        <p className="mb-2">{t("bookingConditions.deposit.first")}</p>
        <p>{t("bookingConditions.deposit.second")}</p>
      </section>

      <section>
        <h3 className="text-lg font-sans font-semibold text-foreground mb-3">
          {t("bookingConditions.cleaning.title")}
        </h3>
        <p>{t("bookingConditions.cleaning.text")}</p>
      </section>

      <section>
        <h3 className="text-lg font-sans font-semibold text-foreground mb-3">
          {t("bookingConditions.cityTax.title")}
        </h3>
        <p>{t("bookingConditions.cityTax.text")}</p>
      </section>

      <section>
        <h3 className="text-lg font-sans font-semibold text-foreground mb-3">
          {t("bookingConditions.checkin.title")}
        </h3>
        <p className="mb-1">{t("bookingConditions.checkin.in")}</p>
        <p className="mb-1">{t("bookingConditions.checkin.out")}</p>
        <p>{t("bookingConditions.checkin.lockbox")}</p>
      </section>

      <section>
        <h3 className="text-lg font-sans font-semibold text-foreground mb-3">
          {t("bookingConditions.more.title")}
        </h3>
        <p>
          {t("bookingConditions.more.text")}{" "}
          <Link to={`${langPrefix}/agb`} className="text-primary hover:underline">
            {t("bookingConditions.more.link")}
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
