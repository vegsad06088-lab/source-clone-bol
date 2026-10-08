import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { faqs } from "@/lib/data";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function FAQSection() {
  const { t } = useI18n();
  const [open, setOpen] = useState<number | null>(null);
  const sectionRef = useScrollAnimation({ threshold: 0.1 });

  return (
    <section 
      ref={sectionRef.ref}
      className={`w-full px-4 sm:px-6 lg:px-8 py-20 transition-all duration-700 ${
        sectionRef.isVisible ? "animate-fade-up-in" : "will-animate-fade-up"
      }`}
    >
      <div className="mx-auto max-w-xl">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground text-center mb-4">
          {t("faq.section.title")}
        </h2>

        <p className="text-center text-muted-foreground mb-12">
          {t("faq.section.subtitle")}
        </p>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div 
              key={i} 
              className="rounded-2xl shadow-card overflow-hidden transition-all duration-700"
              style={{
                animation: sectionRef.isVisible ? `fadeUpIn 0.6s ease-out ${0.08 * i}s forwards` : "none",
                opacity: sectionRef.isVisible ? 1 : 0,
                transform: sectionRef.isVisible ? "translateY(0)" : "translateY(20px)",
              }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full text-left p-5 flex justify-between items-center bg-background hover:bg-card transition-smooth"
              >
                <span className="text-base font-medium text-foreground font-sans">
                  {t(faq.qKey)}
                </span>

                <svg
                  className={`w-5 h-5 text-muted-foreground transition-transform ${
                    open === i ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {open === i && (
                <div className="px-5 pb-5 bg-background animate-fade-up-in">
                  <p className="text-sm text-muted-foreground">{t(faq.aKey)}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
