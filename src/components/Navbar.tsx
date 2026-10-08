import { siteConfig, isPageOn, type PageKey } from "@/config/site.config";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { Menu, X } from "lucide-react";
import LanguageSelector from "@/components/LanguageSelector";

export default function Navbar() {
  const { t, langPrefix } = useI18n();
  const location = useLocation();
  const pathname = location.pathname;

  // Normalize paths for comparison - remove trailing slashes for consistent comparison
  const isActive = (path: string) => {
    const normalizedPath = path.replace(/\/$/, '') || '/';
    const normalizedPathname = pathname.replace(/\/$/, '') || '/';
    return normalizedPathname === normalizedPath;
  };

  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: "Home", path: `${langPrefix}/` },
    { label: "Apartments", path: `${langPrefix}/apartments`, key: "apartments" as PageKey },
    { label: t("footer.about"), path: `${langPrefix}/about`, key: "about" as PageKey },
    { label: t("footer.instructions"), path: `${langPrefix}/anleitungen`, key: "anleitungen" as PageKey },
    { label: t("footer.contact"), path: `${langPrefix}/contact`, key: "contact" as PageKey },
  ].filter((i) => !i.key || isPageOn(i.key));

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 w-full">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between rounded-2xl bg-background/95 backdrop-blur-sm px-6 py-3 shadow-card">
          
          <Link to={`${langPrefix}/`} className="flex-shrink-0">
            <img
              src={siteConfig.brand.logo}
              alt={siteConfig.brand.name}
              className="h-10 md:h-12"
            />
          </Link>

          <div className="hidden md:flex items-center">
            <LanguageSelector />
          </div>

          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path + item.label}
                to={item.path}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 relative ${
                  isActive(item.path)
                    ? "text-primary font-bold"
                    : "text-foreground/60 hover:text-foreground/80"
                }`}
              >
                {item.label}
                {isActive(item.path) && (
                  <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full blur-sm glow-effect" />
                )}
              </Link>
            ))}
          </div>

          <div className="hidden md:block">
            <Link
              to={`${langPrefix}/apartments`}
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-primary-foreground bg-primary/80 rounded-full shadow-card hover:shadow-card-hover transition-smooth hover:-translate-y-[1px] active:translate-y-[1px] active:scale-[0.98] hover:bg-primary"
            >
              {t("navbar.book_now")}
            </Link>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden mt-2 rounded-2xl bg-background/95 backdrop-blur-sm p-6 shadow-card animate-fade-in">
            
            <div className="mb-4 border-b border-border/50 pb-4">
              <p className="text-sm font-medium text-muted-foreground mb-2">Language</p>
              <LanguageSelector />
            </div>

            {navItems.map((item) => (
              <Link
                key={item.path + item.label}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`block py-3 px-4 text-base font-medium rounded-lg transition-all duration-300 relative ${
                  isActive(item.path)
                    ? "text-primary font-bold"
                    : "text-foreground/60 hover:text-foreground/80"
                }`}
              >
                {item.label}
                {isActive(item.path) && (
                  <div className="absolute bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full blur-sm" />
                )}
              </Link>
            ))}

            <Link
              to={`${langPrefix}/apartments`}
              onClick={() => setMobileOpen(false)}
              className="mt-4 w-full inline-flex items-center justify-center px-5 py-3 text-sm font-medium text-primary-foreground bg-primary/80 rounded-full hover:bg-primary transition-smooth"
            >
              {t("navbar.book_now")}
            </Link>
          </div>
        )}
        </div>
      </nav>
    );
  }
