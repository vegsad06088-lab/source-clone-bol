import { siteConfig } from "@/config/site.config";
import { useI18n } from "@/lib/i18n";
import { Link } from "react-router-dom";
import { faqs } from "@/lib/data";
import { useState, useEffect } from "react";
import Lightbox from "@/components/Lightbox";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";


export default function AboutPage() {
  const { t, langPrefix } = useI18n();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const viatorRef = useScrollAnimation({ threshold: 0.2, delay: 150 });

  const photoGallery = siteConfig.images.aboutGallery();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      {/* Hero */}
      <section 
        className="relative w-screen h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800"
        style={{
          backgroundImage: `url(${siteConfig.images.aboutHero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <img 
          src={siteConfig.images.aboutHero}
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
        {/* Enhanced overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/50" />
        {/* Extra accent gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
        
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white mb-4 drop-shadow-lg">
            {t("about.hero.title")}
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto drop-shadow-md">
            {t("about.hero.subtitle")}
          </p>
        </div>
      </section>

      {/* Location */}
      <section className="container-modern py-20">
        <h2 className="text-3xl font-serif font-bold text-foreground text-center mb-4">
          {t("about.location.title")}
        </h2>
        <p className="text-center text-muted-foreground mb-12">
          {t("about.location.subtitle")}
        </p>
        <div className="max-w-2xl mx-auto text-center">
          {/* Clickable Photo */}
          <a
            href="https://www.google.com/maps/place/Apartments+zur+Quelle/@48.1735058,16.3894297,646m/data=!3m3!1e3!4b1!5s0x476da9e9bb558713:0x62207c3e1bf1362d!4m6!3m5!1s0x2ad883a0300fc9ed:0xed842bf85b14b5dc!8m2!3d48.1735058!4d16.3894297!16s%2Fg%2F11vc6dg9hv?entry=ttu"
            target="_blank"
            rel="noopener noreferrer"
            className="mb-6 inline-block rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-smooth cursor-pointer transform hover:scale-105"
          >
            <img
              src={siteConfig.images.aboutLocation}
              alt="Apartments zur Quelle Location"
              className="w-full h-96 object-cover"
              loading="lazy"
            />
          </a>
          <h3 className="text-xl font-serif font-semibold text-foreground mb-2">Apartments zur Quelle</h3>
          <p className="text-muted-foreground mb-2">Absberggasse 6</p>
          <p className="text-muted-foreground mb-4">1100 Wien, Österreich</p>
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

      {/* ...existing code... */}
      <section className="py-20 bg-background">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif font-bold text-foreground mb-6">
            {t("about.home.title")}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-12 text-lg">
            {t("about.home.description")}
          </p>
          <h2 className="text-3xl font-serif font-bold text-foreground mb-6">
            {t("about.rooms.title")}
          </h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            {t("about.rooms.description")}
          </p>
        </div>
      </section>

      {/* Photo Grid */}
      <section className="container-modern pb-20">
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
    {photoGallery.map((img, i) => (
      <button
        key={i}
        onClick={() => setLightboxIndex(i)}
        className={`rounded-2xl shadow-card overflow-hidden cursor-pointer hover:shadow-card-hover transition-smooth ${i === 0 ? "col-span-2 md:col-span-2" : ""}`}
      >
        <img
          src={img}
          alt=""
          className="w-full h-48 object-cover hover:scale-110 transition-transform duration-300"
          loading="lazy"
        />
      </button>
    ))}
  </div>
</section>

      {/* Why Guests Love Us */}
      <section className="bg-card py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-foreground text-center mb-12">
            {t("inline.about.t1")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { img: siteConfig.images.aboutWhy.location, title: "inline.about.t2", desc: "inline.about.t3" },
                { img: siteConfig.images.aboutWhy.personality, title: "inline.about.t4", desc: "inline.about.t5" },
                { img: siteConfig.images.aboutWhy.service, title: "inline.about.t6", desc: "inline.about.t7" },
                { img: siteConfig.images.aboutWhy.detail, title: "inline.about.t8", desc: "inline.about.t9" },
              ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-card mb-4">
                  <img src={item.img} alt={t(item.title)} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <h3 className="text-lg font-semibold text-foreground font-sans mb-1">{t(item.title)}</h3>
                <p className="text-sm text-muted-foreground">{t(item.desc)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-background">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-foreground text-center mb-12">
            {t("inline.about.t10")}
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-2xl shadow-card overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full text-left p-5 flex justify-between items-center bg-background hover:bg-card transition-smooth">
                  <span className="text-base font-medium text-foreground font-sans">{t(faq.qKey)}</span>
                  <svg className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openFaq === i ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                  style={{
                    maxHeight: openFaq === i ? "500px" : "0px",
                  }}
                >
                  <div className="px-5 py-4 bg-background border-t border-border/20">
                    <p className="text-sm text-muted-foreground leading-relaxed">{t(faq.aKey)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {lightboxIndex !== null && (
        <Lightbox
          images={photoGallery}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={(index) => setLightboxIndex(index)}
        />
      )}
    </div>
  );
}
