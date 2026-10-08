import { useI18n } from "@/lib/i18n";
import { Link } from "react-router-dom";

export default function AGBPage() {
  const { t, langPrefix } = useI18n();

  return (
    <div className="pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-serif font-bold text-foreground mb-4">
          {t("agb.title")}
        </h1>

        <p className="text-muted-foreground mb-8">
          {t("agb.intro")}
        </p>

        <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
          {/* 1. Scope */}
          <section>
            <h3 className="text-lg font-sans font-semibold text-foreground mb-3">
              {t("agb.section1.title")}
            </h3>
            <p>
              {t("agb.section1.text")}
            </p>
          </section>

          {/* 2. Booking & Payment */}
          <section>
            <h3 className="text-lg font-sans font-semibold text-foreground mb-3">
              {t("agb.section2.title")}
            </h3>
            <p className="mb-2">
              {t("agb.section2.paragraph1")}
            </p>
            <p>
              {t("agb.section2.paragraph2")}
            </p>
          </section>

          {/* 3. Cancellation Policy */}
          <section>
            <h3 className="text-lg font-sans font-semibold text-foreground mb-3">
              {t("agb.section3.title")}
            </h3>
            <p className="mb-2">
              {t("agb.section3.paragraph1")}
            </p>
            <p className="mb-2">
              {t("agb.section3.paragraph2")}
            </p>
            <p>
              {t("agb.section3.paragraph3")}
            </p>
          </section>

          {/* 4. Check-in & Check-out */}
          <section>
            <h3 className="text-lg font-sans font-semibold text-foreground mb-3">
              {t("agb.section4.title")}
            </h3>
            <p className="mb-1">
              {t("agb.section4.checkin")}
            </p>
            <p className="mb-1">
              {t("agb.section4.checkout")}
            </p>
            <p>
              {t("agb.section4.text")}
            </p>
          </section>

          {/* 5. House Rules */}
          <section>
            <h3 className="text-lg font-sans font-semibold text-foreground mb-3">
              {t("agb.section5.title")}
            </h3>
            <p className="mb-2">
              {t("agb.section5.paragraph1")}
            </p>
            <p>
              {t("agb.section5.paragraph2")}
            </p>
          </section>

          {/* 6. Damages & Liability */}
          <section>
            <h3 className="text-lg font-sans font-semibold text-foreground mb-3">
              {t("agb.section6.title")}
            </h3>
            <p className="mb-2">
              {t("agb.section6.paragraph1")}
            </p>
            <p>
              {t("agb.section6.paragraph2")}
            </p>
          </section>

          {/* 7. Safety */}
          <section>
            <h3 className="text-lg font-sans font-semibold text-foreground mb-3">
              {t("agb.section7.title")}
            </h3>
            <p>
              {t("agb.section7.text")}
            </p>
          </section>

          {/* 8. Privacy */}
          <section>
            <h3 className="text-lg font-sans font-semibold text-foreground mb-3">
              {t("agb.section8.title")}
            </h3>
            <p>
              {t("agb.section8.text")}{" "}
              <Link
                to={`${langPrefix}/datenschutz`}
                className="text-primary hover:underline"
              >
                {t("footer.privacy")}
              </Link>
              .
            </p>
          </section>

          {/* 9. Jurisdiction */}
          <section>
            <h3 className="text-lg font-sans font-semibold text-foreground mb-3">
              {t("agb.section9.title")}
            </h3>
            <p>
              {t("agb.section9.text")}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
