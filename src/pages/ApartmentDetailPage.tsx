import { Link, useLocation } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { apartments, amenities } from "@/lib/data";
import { useState, useEffect } from "react";
import Lightbox from "@/components/Lightbox";
import ModalPane from "@/components/ModalPane";
import BookingConditionsContent from "@/components/BookingConditionsContent";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export default function ApartmentDetailPage() {
  const { t, langPrefix } = useI18n();
  const location = useLocation();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [conditionsOpen, setConditionsOpen] = useState(false);
  const [gallery, setGallery] = useState<string[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(true);

  // Extract slug from URL path - get the last segment
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const slug = pathSegments[pathSegments.length - 1] || "";

  const apartment = apartments.find((a) => a.id === slug);

  // Load gallery dynamically on component mount
  useEffect(() => {
    if (apartment && "galleryLoader" in apartment) {
      setGalleryLoading(true);
      const loader = (apartment as any).galleryLoader;
      loader()
        .then((images: string[]) => {
          console.log(`✅ Gallery loaded for ${apartment.id}:`, images);
          setGallery(images);
        })
        .catch((error) => {
          console.error(`❌ Failed to load gallery for ${apartment.id}:`, error);
          setGallery([]);
        })
        .finally(() => {
          setGalleryLoading(false);
        });
    }
  }, [apartment]);

  if (!apartment) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-card">
        <h1 className="text-4xl font-serif font-bold text-foreground mb-4">
          {t("apartment.not_found")}
        </h1>
        <p className="text-lg text-muted-foreground mb-8">Slug: {slug}</p>
        <Link
          to={`${langPrefix}/apartments`}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-smooth"
        >
          {t("apartment.back_to_apartments")}
        </Link>
      </div>
    );
  }

  // Load Smoobu widget dynamically
  const openBookingWidget = () => {
    setBookingOpen(true);

    setTimeout(() => {
      const script = document.createElement("script");
      script.src = "https://login.smoobu.com/js/Settings/BookingToolIframe.js";
      script.onload = () => {
        // @ts-expect-error BookingToolIframe is from external script
        BookingToolIframe.initialize({
          url: "https://login.smoobu.com/en/booking-tool/iframe/1656615",
          baseUrl: "https://login.smoobu.com",
          target: "#apartmentIframeAll",
        });
      };
      document.body.appendChild(script);
    }, 50);
  };

  return (
    <div>
      {/* Hero */}
      <section 
        className="relative h-[60vh] min-h-[500px] overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800"
        style={{
          backgroundImage: `url(${apartment.heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <img
          src={apartment.heroImage}
          alt={apartment.name}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            console.error("Apartment detail hero image failed to load:", e);
            e.currentTarget.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mb-3">
                {apartment.name}
              </h1>
              <p className="text-white/80 max-w-lg text-sm sm:text-base">
                {t(apartment.descriptionKey)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout with Sticky Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-40 grid grid-cols-1 lg:grid-cols-3 gap-8 pb-32 lg:pb-12">
        {/* Left Content Column */}
          <div className="lg:col-span-2 pl-0 md:pl-12 lg:pl-20 mt-48">
          {/* Quick Info */}
          <section className="mb-12 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-4 border border-primary/20 -mt-8">
            <div className="grid grid-cols-4 gap-2">
              <div className="flex flex-col items-center gap-0.5 p-2 bg-background rounded-lg text-center hover:shadow-card transition-smooth">
                <span className="text-base">👤</span>
                <span className="text-xs font-medium text-foreground">{apartment.persons}</span>
              </div>
              <div className="flex flex-col items-center gap-0.5 p-2 bg-background rounded-lg text-center hover:shadow-card transition-smooth">
                <span className="text-base">🛏️</span>
                <span className="text-xs font-medium text-foreground">{t(apartment.bedsKey)}</span>
              </div>
              <div className="flex flex-col items-center gap-0.5 p-2 bg-background rounded-lg text-center hover:shadow-card transition-smooth">
                <span className="text-base">🏠</span>
                <span className="text-xs font-medium text-foreground">{t(apartment.roomsKey)}</span>
              </div>
              <div className="flex flex-col items-center gap-0.5 p-2 bg-background rounded-lg text-center hover:shadow-card transition-smooth">
                <span className="text-base">📐</span>
                <span className="text-xs font-medium text-foreground">{apartment.size}</span>
              </div>
            </div>
          </section>

          {/* Description */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-6">
              {t(apartment.sectionTitleKey)}
            </h2>
            <div className="prose prose-slate max-w-none">
              {t(apartment.longDescriptionKey)
                .split("\n\n")
                .map((p, i) => (
                  <p
                    key={i}
                    className="text-muted-foreground leading-relaxed mb-4"
                  >
                    {p}
                  </p>
                ))}
            </div>
          </section>

          {/* Amenities */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-8">
              {t("apartment.amenities")}
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {amenities.map((a, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-2 p-4 bg-card rounded-xl shadow-card text-center"
                >
                  <span className="text-2xl">{a.icon}</span>
                  <span className="text-xs font-medium text-foreground">
                    {t(a.labelKey)}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Gallery */}
          <section>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-8 flex items-center gap-3">
              {t("apartment.gallery")}
              {galleryLoading && <span className="text-sm text-muted-foreground animate-pulse">(loading...)</span>}
            </h2>

            {gallery.length === 0 && !galleryLoading && (
              <div className="text-center py-8 bg-card rounded-lg">
                <p className="text-muted-foreground">No gallery images available</p>
              </div>
            )}

            {gallery.length > 0 && (
              <>
                {/* Expand / Collapse Button */}
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="flex items-center gap-2 text-primary font-medium mb-6"
                >
                  {expanded
                    ? t("apartment.show_less")
                    : t("apartment.show_all_images")}
                </button>

                {/* Collapsed: Swiper Carousel */}
                {!expanded && (
                  <Swiper
                    modules={[Navigation]}
                    navigation
                    spaceBetween={16}
                    slidesPerView={1.2}
                    breakpoints={{
                      640: { slidesPerView: 2.2 },
                      1024: { slidesPerView: 3.2 },
                    }}
                    className="w-full"
                  >
                    {gallery.map((img, i) => (
                      <SwiperSlide key={i}>
                        <div
                          className="aspect-[4/3] rounded-xl overflow-hidden shadow-card cursor-pointer hover:shadow-card-hover transition-smooth"
                          onClick={() => setLightboxIndex(i)}
                        >
                          <img
                            src={img as string}
                            alt={`${apartment.name} ${i + 1}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                )}

                {/* Expanded: Full Grid */}
                {expanded && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {gallery.map((img, i) => (
                      <div
                        key={i}
                        className="aspect-[4/3] rounded-xl overflow-hidden shadow-card cursor-pointer hover:shadow-card-hover transition-smooth bg-card"
                        onClick={() => setLightboxIndex(i)}
                      >
                        <img
                          src={img as string}
                          alt={`${apartment.name} ${i + 1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            console.error(`[Gallery Grid] Image failed to load:`, {
                              src: (e.currentTarget as HTMLImageElement).src,
                              apartment: apartment.id,
                              index: i,
                            });
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </section>
        </div>

        {/* Right Sidebar: Sticky Booking Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-background rounded-2xl shadow-elevated p-6">
            <h3 className="text-lg font-semibold text-foreground font-sans">
              {apartment.name}
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              {apartment.persons} {t("apartment.persons")}
            </p>
            <div className="border-t border-border pt-3 mb-4">
              <p className="text-sm text-muted-foreground">
                {t("apartment.from")}
              </p>
              <p className="text-2xl font-bold text-foreground">
                € {apartment.price}.00 EUR{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  /{t("apartment.night")}
                </span>
              </p>
            </div>

            {/* Open booking modal */}
            <button
              onClick={openBookingWidget}
              className="w-full inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-primary-foreground bg-primary rounded-full shadow-card hover:shadow-card-hover transition-smooth hover:-translate-y-[1px] active:translate-y-[1px] active:scale-[0.98] mb-6"
            >
              {t("apartment.book_now")}
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={gallery as string[]}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
          altPrefix={apartment.name}
        />
      )}

      {/* NEW BOOKING MODAL (shared modal) */}
      <ModalPane open={bookingOpen} onClose={() => setBookingOpen(false)}>
        <h2 className="text-xl font-semibold mb-4">
          {t("apartment.book_now_modal")}
        </h2>

        <div id="apartmentIframeAll"></div>

        <p
          className="text-center mt-4 text-sm text-primary underline cursor-pointer"
          onClick={() => setConditionsOpen(true)}
        >
          {t("apartment.booking_conditions")}
        </p>
      </ModalPane>

      {/* NEW BOOKING CONDITIONS MODAL */}
      <ModalPane open={conditionsOpen} onClose={() => setConditionsOpen(false)}>
        <BookingConditionsContent />
      </ModalPane>

      {/* Sticky Mobile Booking */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-background border-t border-border p-4 z-50">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-muted-foreground">
              {t("apartment.from")}
            </span>
            <span className="text-lg font-bold text-foreground ml-1">
              €{apartment.price}
            </span>
            <span className="text-sm text-muted-foreground">
              /{t("apartment.night")}
            </span>
          </div>

          {/* Mobile booking button */}
          <button
            onClick={openBookingWidget}
            className="px-6 py-2.5 text-sm font-medium text-primary-foreground bg-primary rounded-full shadow-card transition-smooth"
          >
            {t("apartment.book_now")}
          </button>
        </div>
      </div>
    </div>
  );
}
