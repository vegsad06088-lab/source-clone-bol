import { useI18n } from "@/lib/i18n";
import { instructions } from "@/lib/data";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";


// Content sections for each instruction page (real content from the original site)
type ContentBlock = { type: "text" | "quote" | "image" | "heading" | "link"; content?: string; translationKey?: string; href?: string; linkTextKey?: string };

const instructionContent: Record<string, ContentBlock[]> = {
  "check-in-anleitung": [
  { type: "quote", translationKey: "instructions.checkin.quote1" },
  { type: "image", content: "/content/guides/check-in-anleitung/steps/01.avif" },
  { type: "quote", translationKey: "instructions.checkin.quote2" },
  { type: "image", content: "/content/guides/check-in-anleitung/steps/02.avif" },
  { type: "quote", translationKey: "instructions.checkin.quote3" },
  { type: "image", content: "/content/guides/check-in-anleitung/steps/03.avif" },
  { type: "quote", translationKey: "instructions.checkin.quote4" },
  { type: "image", content: "/content/guides/check-in-anleitung/steps/04.avif" },
  { type: "quote", translationKey: "instructions.checkin.quote5" },
  { type: "image", content: "/content/guides/check-in-anleitung/steps/05.avif" },
  { type: "image", content: "/content/guides/check-in-anleitung/steps/06.avif" },
  { type: "quote", translationKey: "instructions.checkin.quote6" },
  { type: "image", content: "/content/guides/check-in-anleitung/steps/07.avif" },
  { type: "image", content: "/content/guides/check-in-anleitung/steps/08.avif" },
],
 "bugeleisen-bugelbrett": [
  { type: "quote", translationKey: "instructions.ironing.quote1" },
  { type: "image", content: "/content/guides/bugeleisen-bugelbrett/steps/01.avif" },
  { type: "image", content: "/content/guides/bugeleisen-bugelbrett/steps/02.avif" },
  { type: "quote", translationKey: "instructions.ironing.quote2" },
  { type: "image", content: "/content/guides/bugeleisen-bugelbrett/steps/03.avif" },
  { type: "image", content: "/content/guides/bugeleisen-bugelbrett/steps/04.avif" },
  { type: "quote", translationKey: "instructions.ironing.quote3" },
  { type: "image", content: "/content/guides/bugeleisen-bugelbrett/steps/05.avif" }
],
  "parkmoglichkeiten": [
  { type: "heading", translationKey: "instructions.parking.heading" },
  { type: "quote", translationKey: "instructions.parking.quote1" },
  { type: "quote", translationKey: "instructions.parking.quote2" },
  { type: "image", content: "/content/guides/parkmoglichkeiten/steps/01.avif" }
],
"check-out-anleitung": [
  { type: "text", translationKey: "instructions.checkout.text1" },
  { type: "quote", translationKey: "instructions.checkout.quote1" },
  { type: "quote", translationKey: "instructions.checkout.quote2" },
  { type: "quote", translationKey: "instructions.checkout.quote3" },
  { type: "quote", translationKey: "instructions.checkout.quote4" },
  { type: "text", translationKey: "instructions.checkout.text2" }
],
  "offentlichen-verkehrsmittel-in-wien": [
  { type: "heading", translationKey: "instructions.publictransport.heading" },
  { type: "text", translationKey: "instructions.publictransport.text1" },
  { type: "quote", translationKey: "instructions.publictransport.quote1", href: "https://www.wienerlinien.at/route-planen", linkTextKey: "instructions.publictransport.linktext1" },
  { type: "quote", translationKey: "instructions.publictransport.quote2" },
  { type: "quote", translationKey: "instructions.publictransport.quote3" },
  { type: "quote", translationKey: "instructions.publictransport.quote4" },
  { type: "quote", translationKey: "instructions.publictransport.quote5" },
  { type: "text", translationKey: "instructions.publictransport.text2" }
],
"gepackaufbewahrung-vor-dem-check-in": [
  { type: "text", translationKey: "instructions.baggagestorage_before.text1" },
  { type: "quote", translationKey: "instructions.baggagestorage_before.quote1" },
  { type: "quote", translationKey: "instructions.baggagestorage_before.quote2" },
  { type: "text", translationKey: "instructions.baggagestorage_before.text2" }
],
  "gepackaufbewahrung-nach-dem-check-out": [
  { type: "text", translationKey: "instructions.baggagestorage_after.text1" },
  { type: "quote", translationKey: "instructions.baggagestorage_after.quote1" },
  { type: "quote", translationKey: "instructions.baggagestorage_after.quote2" },
  { type: "quote", translationKey: "instructions.baggagestorage_after.quote3" },
  { type: "text", translationKey: "instructions.baggagestorage_after.text2" }
],
"anleitung-zur-steuerung-der-heizung": [
  { type: "text", translationKey: "instructions.heating.text1" },
  { type: "quote", translationKey: "instructions.heating.quote1" },
  { type: "quote", translationKey: "instructions.heating.quote2" },
  { type: "quote", translationKey: "instructions.heating.quote3" },
  { type: "quote", translationKey: "instructions.heating.quote4" },
  { type: "quote", translationKey: "instructions.heating.quote5" },
  { type: "quote", translationKey: "instructions.heating.quote6" },
  { type: "quote", translationKey: "instructions.heating.quote7" },
  { type: "text", translationKey: "instructions.heating.text2" }
],
"anleitung-tv": [
  { type: "text", translationKey: "instructions.tv.text1" },
  { type: "text", translationKey: "instructions.tv.text2" }
],
  "mit-kindern-wien-entdecken": [
  { type: "text", translationKey: "instructions.kids.text1" },
  { type: "quote", translationKey: "instructions.kids.quote1", href: "https://www.viator.com/tours/Vienna/Vienna-Skip-the-Line-Schonbrunn-Palace-and-Gardens-w-Guide/d454-265552P73?pid=P00290902&mcid=42383&medium=link&campaign=schoenbrunn", linkTextKey: "instructions.kids.linktext1" },
  { type: "quote", translationKey: "instructions.kids.quote2" },
  { type: "quote", translationKey: "instructions.kids.quote3" },
  { type: "quote", translationKey: "instructions.kids.quote4", href: "https://www.viator.com/tours/Vienna/Danube-Tower-The-Top-of-Vienna/d454-75971P1?pid=P00290902&mcid=42383&medium=link&campaign=Donauturm", linkTextKey: "instructions.kids.linktext2" },
  { type: "quote", translationKey: "instructions.kids.quote5" },
  { type: "quote", translationKey: "instructions.kids.quote6" },
  { type: "text", translationKey: "instructions.kids.text2" }
],
};

export { instructionContent };

export default function AnleitungDetailPage() {
  const { t, langPrefix } = useI18n();
  const { slug } = useParams<{ slug: string }>();

  const instruction = instructions.find((i) => i.id === slug);
  const content = instructionContent[slug] || [];

  if (!instruction) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-card">
        <h1 className="text-4xl font-serif font-bold text-foreground mb-4">
          {t("inline.anleitungdetail.t1")}
        </h1>
        <p className="text-lg text-muted-foreground mb-8">Slug: {slug}</p>
        <Link 
          to={`${langPrefix}/anleitungen`} 
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-smooth"
        >
          {t("inline.anleitungdetail.t2")}
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Image */}
      <section 
        className="relative h-[40vh] min-h-[300px] bg-gradient-to-br from-gray-700 to-gray-800"
        style={{
          backgroundImage: `url(${instruction.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0">
          <img 
            src={instruction.image} 
            alt={t(instruction.titleKey)}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error("Instruction hero image failed to load:", e);
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            <span className="text-xs font-medium text-white/80 uppercase tracking-wider font-sans">
i              {instruction.category === "apartments" ? t("anleitungen.category.apartments") : t("anleitungen.category.location")}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mt-2">
              {t(instruction.titleKey)}
            </h1>
          </div>
        </div>
      </section>

      {/* Back link */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link to={`${langPrefix}/anleitungen`} className="inline-flex items-center gap-2 text-sm text-primary hover:underline transition-smooth">
          <ArrowLeft className="w-4 h-4" />
          {t("anleitungen.back_to_all")}
        </Link>
      </div>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6">
          {content.map((block, i) => {
            if (block.type === "image") {
              return (
                <div key={i} className="rounded-xl overflow-hidden shadow-card">
                  <img src={block.content as string} alt="" className="w-full h-auto" loading="lazy" />
                </div>
              );
            }
            if (block.type === "heading") {
              return (
                <h3 key={i} className="text-xl font-serif font-bold text-foreground mt-8">
                  {t(block.translationKey!)}
                </h3>
              );
            }
            if (block.type === "text") {
              return (
                <p key={i} className="text-foreground">
                  {t(block.translationKey!)}
                </p>
              );
            }
            if (block.type === "quote") {
              const translatedText = t(block.translationKey!);
              return (
                <blockquote key={i} className="bg-card border-l-4 border-primary rounded-r-xl p-6 shadow-card">
                  {translatedText.split("\n\n").map((p, j) => (
                    <p key={j} className={`text-foreground ${j > 0 ? "mt-3" : ""}`}>{p}</p>
                  ))}
                  {block.href && block.linkTextKey && (
                    <a
                      href={block.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-5 py-2 mt-4 text-sm font-medium text-primary-foreground bg-primary rounded-full transition-smooth hover:opacity-90"
                    >
                      {t(block.linkTextKey)}
                    </a>
                  )}
                </blockquote>
              );
            }
            return null;
          })}
        </div>

        {/* PDF Downloads */}
        {instruction.pdf && (
          <div className="mt-12 bg-card rounded-2xl p-8 shadow-card">
            <h3 className="text-lg font-semibold text-foreground font-sans mb-2">
              {t("anleitungen.pdf_download")}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t("anleitungen.pdf_description")}
            </p>
            <div className="flex flex-wrap gap-3">
              {instruction.pdf.de && (
                <a href={instruction.pdf.de} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-primary-foreground bg-primary rounded-full transition-smooth hover:opacity-90">
                  📄 PDF Deutsch
                </a>
              )}
              {instruction.pdf.en && (
                <a href={instruction.pdf.en} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-primary-foreground bg-primary rounded-full transition-smooth hover:opacity-90">
                  📄 PDF English
                </a>
              )}
            </div>
          </div>
        )}
      </article>

      {/* More Instructions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-serif font-bold text-foreground">
            {t("anleitungen.more_instructions")}
          </h2>
          <Link to={`${langPrefix}/anleitungen`} className="text-sm text-primary hover:underline transition-smooth">
            {t("anleitungen.show_all")}
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {instructions.filter((i) => i.id !== slug).slice(0, 3).map((inst) => (
            <Link
              key={inst.id}
              to={`${langPrefix}/anleitungen-post/${inst.id}`}
              className="group rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-smooth block"
            >
              <div className="aspect-video overflow-hidden">
                <img src={inst.image} alt={t(inst.titleKey)} className="w-full h-full object-cover transition-smooth group-hover:scale-105" loading="lazy" />
              </div>
              <div className="p-4 bg-background">
                <span className="text-xs font-medium text-primary uppercase tracking-wider mb-1 block font-sans">
                  {inst.category === "apartments" ? t("anleitungen.category.apartments") : t("anleitungen.category.location")}
                </span>
                <h3 className="text-base font-semibold text-foreground font-sans">{t(inst.titleKey)}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
