import { siteConfig } from "@/config/site.config";
import { useI18n } from "@/lib/i18n";
import { apartments } from "@/lib/data";
import ApartmentCard from "@/components/ApartmentCard";
import { PromoBanner } from "@/components/promo";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function ApartmentsPage() {
  const { t } = useI18n();
  const gridRef = useScrollAnimation({ threshold: 0.1 });
  const viatorRef = useScrollAnimation({ threshold: 0.2, delay: 150 });

  return (
    <div>
      {/* Hero */}
      <section 
        className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800 animate-fade-up-in"
        style={{
          backgroundImage: `url(${siteConfig.images.apartmentsHero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <img 
          src={siteConfig.images.apartmentsHero}
          alt="Apartments" 
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            console.error("Apartments hero image failed to load:", e);
            e.currentTarget.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white mb-4">
            Apartments
          </h1>
          <p className="text-lg text-background/90 max-w-2xl mx-auto">
            {t("apartments.hero.subtitle")}
          </p>
        </div>
      </section>

      <PromoBanner />

      {/* Apartment Grid */}
      <section 
        ref={gridRef.ref}
        className={`w-full py-20 bg-background transition-all duration-700 ${
          gridRef.isVisible ? "animate-fade-up-in" : "will-animate-fade-up"
        }`}
      >
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {apartments.map((apt, index) => (
              <div
                key={apt.id}
                className="transition-all duration-700"
                style={{
                  animation: gridRef.isVisible ? `fadeUpIn 0.6s ease-out ${0.1 * index}s forwards` : "none",
                  opacity: gridRef.isVisible ? 1 : 0,
                  transform: gridRef.isVisible ? "translateY(0)" : "translateY(40px)",
                }}
              >
                <ApartmentCard {...apt} />
              </div>
            ))}
          </div>
        </div>
      </section>

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
    </div>
  );
}
