import { useI18n } from "@/lib/i18n";

export default function CookiePolicy() {
  const { t } = useI18n();

  return (
    <div className="pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-serif font-bold text-foreground mb-4">
          {t("cookies.title")}
        </h1>

        <p className="text-muted-foreground mb-8">
          {t("cookies.intro")}
        </p>

        <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">

          {/* 1. What are cookies */}
          <section>
            <h2 className="text-lg font-sans font-semibold text-foreground mb-2">
              {t("cookies.section1.title")}
            </h2>
            <p>
              {t("cookies.section1.text")}
            </p>
          </section>

          {/* 2. Types of cookies */}
          <section>
            <h2 className="text-lg font-sans font-semibold text-foreground mb-2">
              {t("cookies.section2.title")}
            </h2>

            <h3 className="font-semibold text-foreground mb-1">
              {t("cookies.section2.essential")}
            </h3>
            <p className="mb-3">
              {t("cookies.section2.essential.text")}
            </p>

            <h3 className="font-semibold text-foreground mb-1">
              {t("cookies.section2.analytics")}
            </h3>
            <p className="mb-3">
              {t("cookies.section2.analytics.text")}
            </p>

            <h3 className="font-semibold text-foreground mb-1">
              {t("cookies.section2.marketing")}
            </h3>
            <p className="mb-3">
              {t("cookies.section2.marketing.text")}
            </p>

            <h3 className="font-semibold text-foreground mb-1">
              {t("cookies.section2.thirdparty")}
            </h3>
            <p>
              {t("cookies.section2.thirdparty.text")}
            </p>
          </section>

          {/* 3. Legal basis */}
          <section>
            <h2 className="text-lg font-sans font-semibold text-foreground mb-2">
              {t("cookies.section3.title")}
            </h2>
            <p>
              {t("cookies.section3.text")}
            </p>
          </section>

          {/* 4. Change settings */}
          <section>
            <h2 className="text-lg font-sans font-semibold text-foreground mb-2">
              {t("cookies.section4.title")}
            </h2>
            <p>
              {t("cookies.section4.text")}
            </p>
          </section>

          {/* 5. Contact */}
          <section>
            <h2 className="text-lg font-sans font-semibold text-foreground mb-2">
              {t("inline.cookiepolicy.t1")}
            </h2>
            <p className="mb-1">
              Apartments zur Quelle<br />
              Christine Führer GmbH<br />
              Absberggasse 6, 1100 Wien, Österreich
            </p>
            <p>
              E-Mail:{" "}
              <a href="mailto:info@ap-zur-quelle.at" className="text-primary hover:underline">
                info@ap-zur-quelle.at
              </a>
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
