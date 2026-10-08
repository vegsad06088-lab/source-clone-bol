import { siteConfig } from "@/config/site.config";
import { Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { apartments, features, reviews } from "@/lib/data";
import ApartmentCard from "@/components/ApartmentCard";
import { PromoBanner } from "@/components/promo";
import FAQSection from "@/components/FAQSection";
import { useEffect } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function HomePage() {
  const { t, langPrefix } = useI18n();

  // Scroll animation refs
  const bookingRef = useScrollAnimation({ threshold: 0.2 });
  const apartmentsRef = useScrollAnimation({ threshold: 0.2 });
  const featuresRef = useScrollAnimation({ threshold: 0.15 });
  const sustainabilityRef = useScrollAnimation({ threshold: 0.2 });
  const whyUsRef = useScrollAnimation({ threshold: 0.2 });
  const reviewsRef = useScrollAnimation({ threshold: 0.15 });

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://login.smoobu.com/js/Settings/BookingToolIframe.js";
    script.async = true;

    script.onload = () => {
      if (window.BookingToolIframe) {
        window.BookingToolIframe.initialize({
          url: "https://login.smoobu.com/en/booking-tool/iframe/1656615?newTabAfterSearch=true",
          baseUrl: "https://login.smoobu.com",
          target: "#apartmentIframeAll",
        });
      }
    };

    document.body.appendChild(script);
  }, []);

  return (
    <div>
      {/* Hero */}
      <section 
        className="relative w-screen h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800"
        style={{
          backgroundImage: `url(${siteConfig.images.homeHero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <img
          src={siteConfig.images.homeHero}
          alt="Apartments zur Quelle"
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            console.error("Hero image failed to load:", e);
            e.currentTarget.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto animate-fade-up-in">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white mb-6">
            {t("home.hero.title")}
          </h1>

          <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {t("home.hero.subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={`${langPrefix}/apartments`}
              className="inline-flex items-center justify-center px-8 py-3.5 text-base font-medium text-primary-foreground bg-primary rounded-full shadow-card hover:shadow-card-hover transition-smooth hover:-translate-y-[1px]"
            >
              {t("home.hero.cta_book")}
            </Link>

            <Link
              to={`${langPrefix}/about`}
              className="inline-flex items-center justify-center px-8 py-3.5 text-base font-medium text-background bg-background/20 backdrop-blur-sm border border-background/30 rounded-full transition-smooth hover:bg-background/30"
            >
              {t("home.hero.cta_about")}
            </Link>
          </div>
        </div>
      </section>

      {/* Booking Widget */}
      <section 
        ref={bookingRef.ref}
        className={`bg-card py-12 sm:py-16 lg:py-20 transition-all duration-700 ${
          bookingRef.isVisible ? "animate-fade-up-in" : "will-animate-fade-up"
        }`}
      >
        <div className="container-modern">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-foreground text-center mb-2 sm:mb-4">
            {t("home.booking.title")}
          </h2>

          <p className="text-center text-muted-foreground mb-3 sm:mb-4 max-w-2xl mx-auto text-sm sm:text-base">
            {t("home.booking.subtitle")}
          </p>

          <p className="text-center text-xs sm:text-sm text-yellow-600 font-medium mb-4 sm:mb-6">
            {t("home.booking.minimum_stay")}
          </p>

          <p className="text-center mb-6 sm:mb-8">
            <Link
              to={`${langPrefix}/booking-conditions`}
              className="text-primary underline hover:text-primary/80 transition-smooth text-sm sm:text-base"
            >
              {t("home.booking.conditions_link")}
            </Link>
          </p>

          <div className="flex justify-center">
            <div className="w-full max-w-4xl bg-background rounded-2xl shadow-card overflow-hidden">
              <div id="apartmentIframeAll" style={{ minHeight: "180px", width: "100%" }} />
            </div>
          </div>

        </div>
      </section>

      <PromoBanner />

      {/* Apartments */}
      <section 
        ref={apartmentsRef.ref}
        className={`w-full py-20 bg-background transition-all duration-700 ${
          apartmentsRef.isVisible ? "animate-fade-up-in" : "will-animate-fade-up"
        }`}
      >
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground text-center mb-12">
            {t("home.apartments.title")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apartments.map((apt, index) => (
              <div
                key={apt.id}
                className="transition-all duration-700"
                style={{
                  animation: apartmentsRef.isVisible ? `fadeUpIn 0.6s ease-out ${0.1 * index}s forwards` : "none",
                  opacity: apartmentsRef.isVisible ? 1 : 0,
                  transform: apartmentsRef.isVisible ? "translateY(0)" : "translateY(40px)",
                }}
              >
                <ApartmentCard {...apt} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section 
        ref={featuresRef.ref}
        className={`w-full py-20 bg-background transition-all duration-700 ${
          featuresRef.isVisible ? "animate-fade-up-in" : "will-animate-fade-up"
        }`}
      >
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground text-center mb-4">
            {t("home.features.title")}
          </h2>

          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            {t("home.features.subtitle")}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {features.map((f, i) => (
              <div 
                key={i} 
                className="text-center group transition-all duration-700"
                style={{
                  animation: featuresRef.isVisible ? `fadeUpIn 0.6s ease-out ${0.05 * i}s forwards` : "none",
                  opacity: featuresRef.isVisible ? 1 : 0,
                  transform: featuresRef.isVisible ? "translateY(0)" : "translateY(30px)",
                }}
              >
                <div className="flex items-center justify-center mb-3">
                  <img
                    src={f.image}
                    alt={t(f.titleKey)}
                    className="w-10 h-10 sm:w-12 sm:h-12 object-contain transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>

                <h3 className="text-sm font-semibold text-foreground font-sans">
                  {t(f.titleKey)}
                </h3>

                <p className="text-xs text-muted-foreground mt-1">
                  {t(f.titleKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability CTA */}
      <section 
        ref={sustainabilityRef.ref}
        className={`bg-primary text-primary-foreground py-16 transition-all duration-700 ${
          sustainabilityRef.isVisible ? "animate-fade-in-scale" : "will-animate-scale"
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            {t("home.sustainability.title")}
          </h2>

          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            {t("home.sustainability.subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={`${langPrefix}/apartments`}
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium bg-background text-foreground rounded-full transition-smooth hover:opacity-90"
            >
              {t("home.sustainability.cta_discover")}
            </Link>

            <Link
              to={`${langPrefix}/about`}
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-primary-foreground border border-primary-foreground/30 rounded-full transition-smooth hover:bg-primary-foreground/10"
            >
              {t("home.hero.cta_about")}
            </Link>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section 
        ref={whyUsRef.ref}
        className={`w-full py-20 bg-background transition-all duration-700 ${
          whyUsRef.isVisible ? "animate-fade-up-in" : "will-animate-fade-up"
        }`}
      >
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground text-center mb-4">
            {t("home.why_us.title")}
          </h2>

          <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            {t("home.why_us.subtitle")}
          </p>

          <p className="text-center text-muted-foreground max-w-3xl mx-auto">
            {t("home.why_us.description")}
          </p>
        </div>
      </section>

      {/* Reviews */}
      <section 
        ref={reviewsRef.ref}
        className={`bg-card py-20 transition-all duration-700 ${
          reviewsRef.isVisible ? "animate-fade-up-in" : "will-animate-fade-up"
        }`}
      >
        <div className="container-modern">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground text-center mb-4">
            {t("home.reviews.title")}
          </h2>

          <p className="text-center text-muted-foreground mb-12">
            {t("home.reviews.subtitle")}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((r, i) => (
              <div 
                key={i} 
                className="bg-background p-6 rounded-2xl shadow-card transition-all duration-700"
                style={{
                  animation: reviewsRef.isVisible ? `fadeUpIn 0.6s ease-out ${0.1 * i}s forwards` : "none",
                  opacity: reviewsRef.isVisible ? 1 : 0,
                  transform: reviewsRef.isVisible ? "translateY(0)" : "translateY(30px)",
                }}
              >
                <h3 className="text-lg font-semibold text-foreground mb-3 font-sans">
                  "{t(r.textKey)}"
                </h3>

                <p className="text-sm text-muted-foreground mb-4">
                  {t(r.quoteKey)}
                </p>

                <div>
                  <p className="text-sm font-medium text-foreground">
                    {r.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t(r.locationKey)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection />

      {/* Final CTA */}
      <section className="w-full py-20 bg-background">
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={`${langPrefix}/apartments`}
              className="inline-flex items-center justify-center px-8 py-3.5 text-base font-medium text-primary-foreground bg-primary rounded-full shadow-card hover:shadow-card-hover transition-smooth"
            >
              {t("home.hero.cta_book")}
            </Link>

            <Link
              to={`${langPrefix}/about`}
              className="inline-flex items-center justify-center px-8 py-3.5 text-base font-medium text-foreground bg-muted rounded-full transition-smooth hover:bg-muted/80"
            >
              {t("home.hero.cta_about")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
