import { isPageOn } from "@/config/site.config";
import { Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n";

export default function Footer() {
  const { t, langPrefix } = useI18n();

  return (
    <footer className="bg-card pt-16 pb-8 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h2 className="text-xl font-serif text-foreground mb-4">AP Zur Quelle</h2>
            <p className="text-muted-foreground text-sm max-w-xs">
              {t("footer.brand_description")}
            </p>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Absberggasse 6, 1100 Wien</p>
              <a href="mailto:info@ap-zur-quelle.at" className="text-sm text-primary hover:underline transition-smooth">
                info@ap-zur-quelle.at
              </a>
              <br />
              <a href="tel:+43676842287105" className="text-sm text-primary hover:underline transition-smooth">
                +43 676 842 287 105
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-4 uppercase tracking-wider font-sans">
              {t("footer.quick_links")}
            </h3>
            <ul className="space-y-2 text-sm">
              {isPageOn("apartments") && <li><Link to={`${langPrefix}/apartments`} className="text-muted-foreground hover:text-primary transition-smooth">Apartments</Link></li>}
              {isPageOn("about") && <li><Link to={`${langPrefix}/about`} className="text-muted-foreground hover:text-primary transition-smooth">{t("footer.about")}</Link></li>}
              {isPageOn("contact") && <li><Link to={`${langPrefix}/contact`} className="text-muted-foreground hover:text-primary transition-smooth">{t("footer.contact")}</Link></li>}
              {isPageOn("anleitungen") && <li><Link to={`${langPrefix}/anleitungen`} className="text-muted-foreground hover:text-primary transition-smooth">{t("footer.instructions")}</Link></li>}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-4 uppercase tracking-wider font-sans">
              {t("footer.legal")}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to={`${langPrefix}/impressum`} className="text-muted-foreground hover:text-primary transition-smooth">
                  Impressum
                </Link>
              </li>
              <li>
                <Link to={`${langPrefix}/datenschutz`} className="text-muted-foreground hover:text-primary transition-smooth">
                  {t("footer.privacy_policy")}
                </Link>
              </li>
              <li>
                <Link
                  to={`${langPrefix}/agb`}
                  className="text-muted-foreground hover:text-primary transition-smooth"
                >
                  {t("footer.terms_conditions")}
                </Link>
              </li>
              <li>
                <Link
                  to={`${langPrefix}/booking-conditions`}
                  className="text-muted-foreground hover:text-primary transition-smooth"
                >
                  {t("footer.booking_conditions")}
                </Link>
              </li>
              <li>
                <Link to={`${langPrefix}/cookies`} className="text-muted-foreground hover:text-primary transition-smooth">
                  {t("footer.cookie_policy")}
                </Link>
              </li>
            </ul>

            <div className="mt-6">
              <a
                href="https://www.instagram.com/apartments_zur_quelle/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-smooth"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
                Instagram
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground">
          <div>
            <p>© {new Date().getFullYear()} AP Zur Quelle. All rights reserved.</p>
            <p className="text-[10px] opacity-70 mt-1">Website by Iseini Vegim</p>
          </div>
          <p className="mt-2 md:mt-0">
            {t("footer.design_programming")}{" "}
            <span className="font-medium text-foreground">ap-zur-quelle Team</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
