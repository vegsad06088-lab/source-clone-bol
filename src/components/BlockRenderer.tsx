/**
 * BlockRenderer — draws a single block based on its type.
 * This is the heart of the JSON-driven system: one component handles every block type.
 */
import { lazy, Suspense, useEffect } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { gallery as galleryHelper, siteConfig } from "@/config/site.config";
import { apartments as apartmentData, instructions as guideData, features as featureData, reviews as reviewData, faqs as faqData } from "@/lib/data";
import ApartmentCard from "@/components/ApartmentCard";
import type { Block, LocalizedText } from "@/lib/content-types";
import { useNewsList } from "@/lib/content-loader";
import { Mail, Phone, MapPin } from "lucide-react";

const PromoBanner = lazy(() => import("@/components/promo/PromoBanner"));

/** Pick text for the current language, fallback to "de", then to the first value. */
function useLocalized() {
  const { lang } = useI18n();
  return (text?: LocalizedText): string => {
    if (!text) return "";
    return text[lang] ?? text["de"] ?? Object.values(text)[0] ?? "";
  };
}

/** Render text that may be plain or HTML. Detects HTML by leading "<". */
function RichText({ text, className }: { text: string; className?: string }) {
  if (!text) return null;
  const isHtml = text.trimStart().startsWith("<");
  if (isHtml) {
    return <div className={className} dangerouslySetInnerHTML={{ __html: text }} />;
  }
  return <p className={className}>{text}</p>;
}

function HeroBlock({ block }: { block: Block }) {
  const L = useLocalized();
  const { langPrefix } = useI18n();
  const title = L(block.title);
  const subtitle = L(block.subtitle);
  const bg = block.backgroundImage ? `/content/${block.backgroundImage}` : block.images?.[0]?.src;
  const heightClass = block.className?.includes("min-h") || block.className?.includes("h-[") ? block.className : "h-[85vh]";

  return (
    <section
      className={`relative w-screen ${heightClass} flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800`}
      style={bg ? { backgroundImage: `url(${bg})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
    >
      {bg && <img src={bg} alt={title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />}
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto animate-fade-up-in">
        {title && <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white mb-6">{title}</h1>}
        {subtitle && <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto">{subtitle}</p>}
        {block.buttons?.map((btn, i) => (
          <span key={i}>
            {btn.to ? (
              <Link to={btn.to.startsWith("/") ? btn.to : `${langPrefix}${btn.to}`} className={`inline-flex items-center justify-center px-8 py-3.5 text-base font-medium rounded-full shadow-card hover:-translate-y-[1px] transition-smooth mx-2 ${btn.variant === "outline" ? "text-background bg-background/20 backdrop-blur-sm border border-background/30" : "text-primary-foreground bg-primary"}`}>
                {L(btn.label)}
              </Link>
            ) : btn.href ? (
              <a href={btn.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-8 py-3.5 text-base font-medium text-primary-foreground bg-primary rounded-full shadow-card hover:-translate-y-[1px] transition-smooth mx-2">
                {L(btn.label)}
              </a>
            ) : null}
          </span>
        ))}
      </div>
    </section>
  );
}

function TextBlock({ block }: { block: Block }) {
  const L = useLocalized();
  const title = L(block.title);
  const body = L(block.body);
  return (
    <section className={`py-20 bg-background ${block.className ?? ""}`}>
      <div className="max-w-3xl mx-auto px-4 text-center">
        {title && <h2 className="text-3xl font-serif font-bold text-foreground mb-6">{title}</h2>}
        <RichText text={body} className="text-muted-foreground leading-relaxed text-lg" />
        {block.subtitle && <p className="text-muted-foreground mt-4">{L(block.subtitle)}</p>}
      </div>
    </section>
  );
}

function GalleryBlock({ block }: { block: Block }) {
  const L = useLocalized();
  const anim = useScrollAnimation({ threshold: 0.15 });
  const imgs = block.galleryFolder ? galleryHelper(block.galleryFolder) : (block.images?.map((i) => i.src) ?? []);
  return (
    <section ref={anim.ref} className={`container-modern pb-20 ${block.className ?? ""} ${anim.isVisible ? "animate-fade-up-in" : "will-animate-fade-up"}`}>
      {block.title && <h2 className="text-3xl font-serif font-bold text-foreground text-center mb-8">{L(block.title)}</h2>}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {imgs.map((src, i) => (
          <div key={i} className={`rounded-2xl shadow-card overflow-hidden ${i === 0 ? "col-span-2 md:col-span-2" : ""}`}>
            <img src={src} alt="" className="w-full h-48 object-cover hover:scale-110 transition-transform duration-300" loading="lazy" />
          </div>
        ))}
      </div>
    </section>
  );
}

function CardsBlock({ block }: { block: Block }) {
  const L = useLocalized();
  const anim = useScrollAnimation({ threshold: 0.15 });
  const cards = (block.items ?? []).filter((c) => c.visible);
  return (
    <section ref={anim.ref} className={`bg-card py-20 ${anim.isVisible ? "animate-fade-up-in" : "will-animate-fade-up"}`}>
      <div className="max-w-6xl mx-auto px-4">
        {block.title && <h2 className="text-3xl font-serif font-bold text-foreground text-center mb-12">{L(block.title)}</h2>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, i) => (
            <div key={card.id} className="text-center" style={{ animation: anim.isVisible ? `fadeUpIn 0.6s ease-out ${0.1 * i}s forwards` : "none", opacity: anim.isVisible ? 1 : 0 }}>
              {card.image && (
                <div className="aspect-square rounded-2xl overflow-hidden shadow-card mb-4">
                  <img src={card.image.startsWith("/content/") ? card.image : `/content/${card.image}`} alt={L(card.title)} className="w-full h-full object-cover" loading="lazy" />
                </div>
              )}
              <h3 className="text-lg font-semibold text-foreground font-sans mb-1">{L(card.title)}</h3>
              {card.description && <p className="text-sm text-muted-foreground">{L(card.description)}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesBlock({ block }: { block: Block }) {
  const L = useLocalized();
  const anim = useScrollAnimation({ threshold: 0.15 });
  const items = (block.items ?? []).filter((c) => c.visible);
  return (
    <section ref={anim.ref} className={`w-full py-20 bg-background ${anim.isVisible ? "animate-fade-up-in" : "will-animate-fade-up"}`}>
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-6xl">
        {block.title && <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground text-center mb-4">{L(block.title)}</h2>}
        {block.subtitle && <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">{L(block.subtitle)}</p>}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {items.map((f, i) => (
            <div key={f.id} className="text-center group" style={{ animation: anim.isVisible ? `fadeUpIn 0.6s ease-out ${0.05 * i}s forwards` : "none", opacity: anim.isVisible ? 1 : 0 }}>
              {f.image && (
                <div className="flex items-center justify-center mb-3">
                  <img src={f.image.startsWith("/content/") ? f.image : `/content/${f.image}`} alt={L(f.title)} className="w-10 h-10 sm:w-12 sm:h-12 object-contain transition-transform duration-300 group-hover:scale-110" loading="lazy" />
                </div>
              )}
              <h3 className="text-sm font-semibold text-foreground font-sans">{L(f.title)}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaBlock({ block }: { block: Block }) {
  const L = useLocalized();
  const { langPrefix } = useI18n();
  const anim = useScrollAnimation({ threshold: 0.2 });
  return (
    <section ref={anim.ref} className={`bg-primary text-primary-foreground py-16 ${anim.isVisible ? "animate-fade-in-scale" : "will-animate-scale"}`}>
      <div className="max-w-4xl mx-auto px-4 text-center">
        {block.title && <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">{L(block.title)}</h2>}
        {block.subtitle && <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">{L(block.subtitle)}</p>}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {block.buttons?.map((btn, i) => (
            <span key={i}>
              {btn.to ? (
                <Link to={btn.to.startsWith("/") ? btn.to : `${langPrefix}${btn.to}`} className={`inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-full transition-smooth mx-2 ${btn.variant === "outline" ? "text-primary-foreground border border-primary-foreground/30 hover:bg-primary-foreground/10" : "bg-background text-foreground hover:opacity-90"}`}>
                  {L(btn.label)}
                </Link>
              ) : btn.href ? (
                <a href={btn.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium bg-background text-foreground rounded-full transition-smooth hover:opacity-90 mx-2">{L(btn.label)}</a>
              ) : null}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function ViatorBlock({ block }: { block: Block }) {
  const L = useLocalized();
  const anim = useScrollAnimation({ threshold: 0.2, delay: 150 });
  return (
    <section ref={anim.ref} className={`bg-primary text-white py-10 bg-cover bg-center bg-no-repeat relative ${anim.isVisible ? "animate-fade-up-in" : "will-animate-fade-up"}`} style={{ backgroundImage: `url(/content/common/viator-bg.avif)` }}>
      <div className="absolute inset-0 bg-black/50" />
      <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
        {block.title && <h2 className="text-xl font-serif font-bold mb-2 text-white">{L(block.title)}</h2>}
        {block.subtitle && <p className="text-white/90 mb-4 text-sm">{L(block.subtitle)}</p>}
        {block.buttons?.[0]?.href && (
          <a href={block.buttons[0].href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-6 py-2 text-sm font-medium bg-white text-primary rounded-full shadow-lg hover:shadow-xl transition-smooth hover:opacity-95 active:scale-95">
            {L(block.buttons[0].label)}
          </a>
        )}
      </div>
    </section>
  );
}

function BookingBlock({ block }: { block: Block }) {
  const L = useLocalized();
  const anim = useScrollAnimation({ threshold: 0.2 });
  const { langPrefix } = useI18n();
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://login.smoobu.com/js/Settings/BookingToolIframe.js";
    script.async = true;
    script.onload = () => {
      if ((window as any).BookingToolIframe) {
        (window as any).BookingToolIframe.initialize({
          url: "https://login.smoobu.com/en/booking-tool/iframe/1656615?newTabAfterSearch=true",
          baseUrl: "https://login.smoobu.com",
          target: "#apartmentIframeAll",
        });
      }
    };
    document.body.appendChild(script);
  }, []);
  return (
    <section ref={anim.ref} className={`bg-card py-12 sm:py-16 lg:py-20 ${anim.isVisible ? "animate-fade-up-in" : "will-animate-fade-up"}`}>
      <div className="container-modern">
        {block.title && <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-foreground text-center mb-4">{L(block.title)}</h2>}
        {block.subtitle && <p className="text-center text-muted-foreground mb-6 max-w-2xl mx-auto">{L(block.subtitle)}</p>}
        {block.body && <p className="text-center text-yellow-600 font-medium mb-4 sm:mb-6 text-xs sm:text-sm">{L(block.body)}</p>}
        <div className="flex justify-center">
          <div className="w-full max-w-4xl bg-background rounded-2xl shadow-card overflow-hidden">
            <div id="apartmentIframeAll" style={{ minHeight: "180px", width: "100%" }} />
          </div>
        </div>
      </div>
    </section>
  );
}

function PromoBlock({ block }: { block: Block }) {
  return (
    <Suspense fallback={null}>
      <PromoBanner />
    </Suspense>
  );
}

function ReviewsBlock({ block }: { block: Block }) {
  const L = useLocalized();
  const anim = useScrollAnimation({ threshold: 0.15 });
  const items = (block.items ?? []).filter((c) => c.visible);
  return (
    <section ref={anim.ref} className={`bg-card py-20 ${anim.isVisible ? "animate-fade-up-in" : "will-animate-fade-up"}`}>
      <div className="container-modern">
        {block.title && <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground text-center mb-4">{L(block.title)}</h2>}
        {block.subtitle && <p className="text-center text-muted-foreground mb-12">{L(block.subtitle)}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((r, i) => (
            <div key={r.id} className="bg-background p-6 rounded-2xl shadow-card" style={{ animation: anim.isVisible ? `fadeUpIn 0.6s ease-out ${0.1 * i}s forwards` : "none", opacity: anim.isVisible ? 1 : 0 }}>
              <h3 className="text-lg font-semibold text-foreground mb-3 font-sans">"{L(r.title)}"</h3>
              {r.description && <p className="text-sm text-muted-foreground mb-4">{L(r.description)}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqBlock({ block }: { block: Block }) {
  const L = useLocalized();
  const items = (block.items ?? []).filter((c) => c.visible);
  return (
    <section className="py-20 bg-background">
      <div className="max-w-3xl mx-auto px-4">
        {block.title && <h2 className="text-3xl font-serif font-bold text-foreground text-center mb-12">{L(block.title)}</h2>}
        <div className="space-y-3">
          {items.map((item) => (
            <details key={item.id} className="rounded-2xl shadow-card overflow-hidden group">
              <summary className="w-full text-left p-5 flex justify-between items-center bg-background hover:bg-card transition-smooth cursor-pointer list-none">
                <span className="text-base font-medium text-foreground font-sans">{L(item.title)}</span>
                <svg className="w-5 h-5 text-muted-foreground transition-transform duration-300 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </summary>
              <div className="px-5 py-4 bg-background border-t border-border/20">
                <p className="text-sm text-muted-foreground leading-relaxed">{L(item.description)}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function NewsListBlock({ block }: { block: Block }) {
  const L = useLocalized();
  const { items, loading } = useNewsList();
  const anim = useScrollAnimation({ threshold: 0.15 });
  if (loading) return null;
  return (
    <section ref={anim.ref} className={`bg-card py-20 ${anim.isVisible ? "animate-fade-up-in" : "will-animate-fade-up"}`}>
      <div className="max-w-4xl mx-auto px-4">
        {block.title && <h2 className="text-3xl font-serif font-bold text-foreground text-center mb-12">{L(block.title)}</h2>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((n, i) => (
            <article key={n.id} className="bg-background rounded-2xl shadow-card overflow-hidden" style={{ animation: anim.isVisible ? `fadeUpIn 0.6s ease-out ${0.1 * i}s forwards` : "none", opacity: anim.isVisible ? 1 : 0 }}>
              {n.image && <img src={`/content/${n.image}`} alt={L(n.title)} className="w-full h-48 object-cover" loading="lazy" />}
              <div className="p-6">
                <time className="text-xs text-muted-foreground">{n.date}</time>
                <h3 className="text-lg font-semibold text-foreground mt-2 mb-2">{L(n.title)}</h3>
                <RichText text={L(n.summary)} className="text-sm text-muted-foreground" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactInfoBlock({ block }: { block: Block }) {
  const L = useLocalized();
  const items = (block.items ?? []).filter((c) => c.visible);
  const iconMap: Record<string, typeof Mail> = { mail: Mail, phone: Phone, map: MapPin };
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 pb-16">
      <div className="mx-auto max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {items.map((item) => {
            const Icon = iconMap[item.id] ?? Mail;
            const link = item.description ? L(item.description) : "#";
            return (
              <a key={item.id} href={link} className="flex flex-col items-center gap-3 p-8 bg-card rounded-2xl shadow-card hover:shadow-card-hover transition-smooth text-center group">
                <Icon className="w-8 h-8 text-primary" />
                <h3 className="text-base font-semibold text-foreground font-sans">{L(item.title)}</h3>
                {item.image && <p className="text-sm text-primary group-hover:underline">{item.image}</p>}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function MapBlock({ block }: { block: Block }) {
  const L = useLocalized();
  const mapUrl = block.data?.mapUrl as string | undefined;
  const img = block.backgroundImage ? `/content/${block.backgroundImage}` : undefined;
  return (
    <section className="container-modern py-20">
      {block.title && <h2 className="text-3xl font-serif font-bold text-foreground text-center mb-4">{L(block.title)}</h2>}
      {block.subtitle && <p className="text-center text-muted-foreground mb-12">{L(block.subtitle)}</p>}
      <div className="max-w-2xl mx-auto text-center">
        {mapUrl ? (
          <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="mb-6 inline-block rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-smooth cursor-pointer transform hover:scale-105">
            {img && <img src={img} alt={L(block.title)} className="w-full h-96 object-cover" loading="lazy" />}
          </a>
        ) : img ? (
          <img src={img} alt={L(block.title)} className="w-full h-96 object-cover rounded-2xl shadow-card" loading="lazy" />
        ) : null}
        {block.body && <RichText text={L(block.body)} className="text-muted-foreground" />}
      </div>
    </section>
  );
}

function ApartmentListBlock({ block }: { block: Block }) {
  const L = useLocalized();
  const anim = useScrollAnimation({ threshold: 0.1 });
  const apts = apartmentData.filter(() => true);
  return (
    <section ref={anim.ref} className={`w-full py-20 bg-background ${anim.isVisible ? "animate-fade-up-in" : "will-animate-fade-up"}`}>
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-5xl">
        {block.title && <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground text-center mb-12">{L(block.title)}</h2>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {apts.map((apt, index) => (
            <div key={apt.id} className="transition-all duration-700" style={{ animation: anim.isVisible ? `fadeUpIn 0.6s ease-out ${0.1 * index}s forwards` : "none", opacity: anim.isVisible ? 1 : 0 }}>
              <ApartmentCard {...apt} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GuideListBlock({ block }: { block: Block }) {
  const L = useLocalized();
  const anim = useScrollAnimation({ threshold: 0.1 });
  const { langPrefix } = useI18n();
  return (
    <section ref={anim.ref} className={`w-full py-20 bg-background ${anim.isVisible ? "animate-fade-up-in" : "will-animate-fade-up"}`}>
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-5xl">
        {block.title && <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground text-center mb-12">{L(block.title)}</h2>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {guideData.map((g, i) => (
            <Link key={g.id} to={`${langPrefix}/anleitungen-post/${g.id}`} className="group" style={{ animation: anim.isVisible ? `fadeUpIn 0.6s ease-out ${0.1 * i}s forwards` : "none", opacity: anim.isVisible ? 1 : 0 }}>
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-card mb-3">
                <img src={g.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" loading="lazy" />
              </div>
              <h3 className="text-sm font-semibold text-foreground font-sans">{L({ de: g.titleKey })}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

const blockRenderers: Record<string, (props: { block: Block }) => JSX.Element> = {
  hero: HeroBlock,
  text: TextBlock,
  gallery: GalleryBlock,
  cards: CardsBlock,
  features: FeaturesBlock,
  cta: CtaBlock,
  viator: ViatorBlock,
  booking: BookingBlock,
  promo: PromoBlock,
  reviews: ReviewsBlock,
  faq: FaqBlock,
  "news-list": NewsListBlock,
  "contact-info": ContactInfoBlock,
  map: MapBlock,
  "apartment-list": ApartmentListBlock,
  "guide-list": GuideListBlock,
};

export default function BlockRenderer({ block }: { block: Block }) {
  if (block.visible === false) return null;
  const Renderer = blockRenderers[block.type];
  if (!Renderer) {
    return <TextBlock block={block} />;
  }
  return <Renderer block={block} />;
}
