import { useI18n } from "@/lib/i18n";

export default function DatenschutzPage() {
  const { t } = useI18n();

  return (
    <div className="pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-serif font-bold text-foreground mb-4">
          {t("datenschutz.title")}
        </h1>
        <p className="text-muted-foreground mb-8">
          {t("datenschutz.subtitle")}
        </p>

        <div className="prose prose-slate max-w-none text-muted-foreground text-sm leading-relaxed space-y-6">
          <section>
            <h2 className="text-xl font-serif font-bold text-foreground">{t("datenschutz.preamble.title")}</h2>
            <p>{t("datenschutz.preamble.text")}</p>
            <p>{t("datenschutz.preamble.lastUpdated")}</p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-foreground">{t("datenschutz.controller.title")}</h2>
            <p>Christine Führer GmbH<br />Absberggasse 6<br />1100 Wien - AT</p>
            <p>E-Mail: <a href="mailto:info@ap-zur-quelle.at" className="text-primary hover:underline">info@ap-zur-quelle.at</a></p>
            <p>Impressum: <a href="/impressum" className="text-primary hover:underline">ap-zur-quelle.at/impressum</a></p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-foreground">{t("datenschutz.processing.title")}</h2>
            <h3 className="text-lg font-sans font-semibold text-foreground">{t("datenschutz.processing.types")}</h3>
            <ul className="list-disc pl-5">
              <li>{t("datenschutz.processing.masterData")}</li>
              <li>{t("datenschutz.processing.contactData")}</li>
              <li>{t("datenschutz.processing.contentData")}</li>
              <li>{t("datenschutz.processing.usageData")}</li>
              <li>{t("datenschutz.processing.metaData")}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-foreground">{t("datenschutz.cookies.title")}</h2>
            <p>{t("datenschutz.cookies.text")}</p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-foreground">{t("datenschutz.booking.title")}</h2>
            <p>{t("datenschutz.booking.text")}</p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-foreground">{t("datenschutz.hosting.title")}</h2>
            <p>{t("datenschutz.hosting.text")}</p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-foreground">{t("datenschutz.rights.title")}</h2>
            <p>{t("datenschutz.rights.text")}</p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-foreground">{t("datenschutz.austria.title")}</h2>
            <p>{t("datenschutz.austria.text")}</p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-foreground">{t("datenschutz.contact.title")}</h2>
            <p>{t("datenschutz.contact.text")}</p>
            <p>Christine Führer GmbH<br />Absberggasse 6, 1100 Wien<br />E-Mail: <a href="mailto:info@ap-zur-quelle.at" className="text-primary hover:underline">info@ap-zur-quelle.at</a></p>
          </section>
        </div>
      </div>
    </div>
  );
}
