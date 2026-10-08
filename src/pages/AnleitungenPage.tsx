import { siteConfig } from "@/config/site.config";
import { useI18n } from "@/lib/i18n";
import { instructions } from "@/lib/data";
import { Link } from "react-router-dom";
import { VoucherBanner } from "@/components/promo";
import offersConfig from "../../projects/apzurquelle/config/offers.json";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useState, useEffect } from "react";

export default function AnleitungenPage() {
  const { t, langPrefix } = useI18n();
  const [scrollY, setScrollY] = useState(0);
  
  // Scroll animation refs for each section
  const heroRef = useScrollAnimation({ threshold: 0.3, delay: 0 });
  const voucherRef = useScrollAnimation({ threshold: 0.2, delay: 100 });
  const viatorRef = useScrollAnimation({ threshold: 0.2, delay: 150 });
  const gridRef = useScrollAnimation({ threshold: 0.1, delay: 200 });

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
        {/* Hero */}
        <section
            className="relative w-full h-[50vh] min-h-[350px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800"
            style={{
                backgroundImage: `url(${siteConfig.images.guidesHero})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <img
                src={siteConfig.images.guidesHero}
                alt="About"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300"
                style={{
                    transform: `scale(1.05) translateY(${scrollY * 0.3}px)`,
                }}
                loading="lazy"
                onError={(e) => {
                    console.error("About hero image failed to load:", e);
                    e.currentTarget.style.display = 'none';
                }}
            />

            {/* Centered text */}
            <div className="relative z-10 text-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-up-in">
                <h1 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-4">
                    {t("anleitungen.title")}
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    {t("anleitungen.subtitle")}
                </p>
            </div>
        </section>



        {/* Voucher Banner */}
      {offersConfig.voucher.enabled && (
        <section 
          ref={voucherRef.ref}
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-all duration-700 ${
            voucherRef.isVisible ? "animate-fade-in-scale" : "will-animate-scale"
          }`}
        >
          <VoucherBanner />
        </section>
      )}

      {/* Viator */}
      <section 
        ref={viatorRef.ref}
        className={`bg-primary text-white py-10 bg-cover bg-center bg-no-repeat relative transition-all duration-700 ${
          viatorRef.isVisible ? "animate-fade-up-in" : "will-animate-fade-up"
        }`}
        style={{ backgroundImage: `url(${siteConfig.images.viatorBg})` }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-xl font-serif font-bold mb-2 text-white">
            {t("anleitungen.viator.title")}
          </h2>
          <p className="text-white/90 mb-4 text-sm">{t("anleitungen.viator.subtitle")}</p>
          <a href={siteConfig.booking.viatorUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-6 py-2 text-sm font-medium bg-white text-primary rounded-full shadow-lg hover:shadow-xl transition-smooth hover:opacity-95 active:scale-95">
            {t("anleitungen.viator.cta")}
          </a>
        </div>
      </section>

      {/* Instructions Grid */}
      <section 
        ref={gridRef.ref}
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 transition-all duration-700 ${
          gridRef.isVisible ? "animate-fade-up-in" : "will-animate-fade-up"
        }`}
      >
        <h2 className="text-2xl font-serif font-bold text-foreground mb-8">
          {t("anleitungen.section.title")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {instructions.map((inst, index) => (
            <div
              key={inst.id}
              className="transition-all duration-700"
              style={{
                animation: gridRef.isVisible ? `fadeUpIn 0.6s ease-out ${0.1 * index}s forwards` : "none",
                opacity: gridRef.isVisible ? 1 : 0,
                transform: gridRef.isVisible ? "translateY(0)" : "translateY(40px)",
              }}
            >
              <Link
                to={`${langPrefix}/anleitungen-post/${inst.id}`}
                className="group rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-smooth block h-full"
              >
                <div className="aspect-video overflow-hidden">
                  <img src={inst.image} alt={t(inst.titleKey)} className="w-full h-full object-cover transition-smooth group-hover:scale-105" loading="lazy" />
                </div>
                <div className="p-6 bg-background">
                  <span className="text-xs font-medium text-primary uppercase tracking-wider mb-2 block font-sans">
                    {inst.category === "apartments" ? t("anleitungen.category.apartments") : t("anleitungen.category.location")}
                  </span>
                  <h3 className="text-lg font-semibold text-foreground mb-2 font-sans">{t(inst.titleKey)}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{t(inst.descriptionKey)}</p>
                  {inst.pdf && (
                    <div className="flex flex-wrap gap-2">
                      {inst.pdf.de && (
                        <span className="inline-flex items-center gap-1 text-sm text-primary font-medium">
                          📄 PDF (DE)
                        </span>
                      )}
                      {inst.pdf.en && (
                        <span className="inline-flex items-center gap-1 text-sm text-primary font-medium">
                          📄 PDF (EN)
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
