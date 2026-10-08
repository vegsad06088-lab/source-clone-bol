import { siteConfig } from "@/config/site.config";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { Mail, Phone, MapPin } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function ContactPage() {
  const { t, langPrefix } = useI18n();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const viatorRef = useScrollAnimation({ threshold: 0.2, delay: 150 });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;
    // mailto fallback
    const mailBody = `Name: ${formData.name}%0D%0AEmail: ${formData.email}%0D%0APhone: ${formData.phone}%0D%0A%0D%0A${formData.message}`;
    window.location.href = `mailto:info@ap-zur-quelle.at?subject=${encodeURIComponent(formData.subject)}&body=${mailBody}`;
    setStatus("success");
  };

  return (
    <div>
      {/* Hero */}
      <section 
        className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800"
        style={{
          backgroundImage: `url(${siteConfig.images.contactHero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <img
          src={siteConfig.images.contactHero}
          alt="Contact"
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            console.error("Contact hero image failed to load:", e);
            e.currentTarget.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 text-center px-4 pt-24">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white mb-4">
            {t("contact.hero.title")}
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            {t("contact.hero.subtitle")}
          </p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-16 -mt-12 relative z-20">
        <div className="mx-auto max-w-xl">
          <div className="bg-background rounded-2xl shadow-elevated p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2 font-sans">
                  {t("contact.form.name")}
                </label>
                <input
                  type="text"
                  required
                  placeholder={t("contact.form.name_placeholder")}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-smooth"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2 font-sans">
                  {t("contact.form.email")}
                </label>
                <input
                  type="email"
                  required
                  placeholder="max@email.at"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-smooth"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2 font-sans">
                  {t("contact.form.phone")}
                </label>
                <input
                  type="tel"
                  placeholder="+43 123 456 789"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-smooth"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2 font-sans">
                  {t("contact.form.subject")}
                </label>
                <input
                  type="text"
                  placeholder={t("contact.form.subject_placeholder")}
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-smooth"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2 font-sans">
                {t("contact.form.message")}
              </label>
              <textarea
                rows={5}
                required
                placeholder={t("contact.form.message_placeholder")}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-smooth resize-none"
              />
            </div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-border text-primary focus:ring-primary/50"
              />
              <span className="text-sm text-muted-foreground">
                {t("contact.form.privacy_agreement_part1")}
                <Link to={`${langPrefix}/datenschutz`} className="text-primary hover:underline">
                  {t("footer.privacy_policy")}
                </Link>
                {t("contact.form.privacy_agreement_part2")}
              </span>
            </label>
            <button
              type="submit"
              disabled={!agreed}
              className="w-full px-6 py-3.5 text-sm font-medium text-primary-foreground bg-primary rounded-full shadow-card hover:shadow-card-hover transition-smooth hover:-translate-y-[1px] active:translate-y-[1px] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("contact.form.submit")}
            </button>
            {status === "success" && (
              <p className="text-sm text-green-600 text-center">
                {t("contact.success_message")}
              </p>
            )}
          </form>
        </div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="w-full px-4 sm:px-6 lg:px-8 pb-16">
        <div className="mx-auto max-w-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <a href="mailto:info@ap-zur-quelle.at" className="flex flex-col items-center gap-3 p-8 bg-card rounded-2xl shadow-card hover:shadow-card-hover transition-smooth text-center group">
            <Mail className="w-8 h-8 text-primary" />
            <h3 className="text-base font-semibold text-foreground font-sans">
              {t("contact.write_us")}
            </h3>
            <p className="text-sm text-primary group-hover:underline">info@ap-zur-quelle.at</p>
          </a>
          <a href="tel:+43676842287105" className="flex flex-col items-center gap-3 p-8 bg-card rounded-2xl shadow-card hover:shadow-card-hover transition-smooth text-center group">
            <Phone className="w-8 h-8 text-primary" />
            <h3 className="text-base font-semibold text-foreground font-sans">
              {t("contact.call_us")}
            </h3>
            <p className="text-sm text-primary group-hover:underline">+43 676 842 287 105</p>
          </a>
            <a
              href="https://www.google.com/maps/place/Apartments+zur+Quelle/@48.1735058,16.3894297,646m/data=!3m3!1e3!4b1!5s0x476da9e9bb558713:0x62207c3e1bf1362d!4m6!3m5!1s0x2ad883a0300fc9ed:0xed842bf85b14b5dc!8m2!3d48.1735058!4d16.3894297!16s%2Fg%2F11vc6dg9hv?entry=ttu"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 p-8 bg-card rounded-2xl shadow-card hover:shadow-card-hover transition-smooth text-center group"
            >
            <MapPin className="w-8 h-8 text-primary" />
            <h3 className="text-base font-semibold text-foreground font-sans">
              {t("contact.visit_us")}
            </h3>
            <p className="text-sm text-primary group-hover:underline">Absberggasse 6, 1100 Wien</p>
          </a>
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
          <a
            href={siteConfig.booking.viatorUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-2 text-sm font-medium bg-white text-primary rounded-full shadow-lg hover:shadow-xl transition-smooth hover:opacity-95 active:scale-95"
          >
            {t("anleitungen.viator.cta")}
          </a>
        </div>
      </section>
    </div>
  );
}
