import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n";

export default function CookieBanner() {
  const { t, langPrefix } = useI18n();
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem(
      "cookie-consent",
      JSON.stringify({ essential: true, marketing: true, analytics: true })
    );
    setVisible(false);
  };

  const acceptEssential = () => {
    localStorage.setItem(
      "cookie-consent",
      JSON.stringify({ essential: true, marketing: false, analytics: false })
    );
    setVisible(false);
  };

  const saveSettings = () => {
    localStorage.setItem(
      "cookie-consent",
      JSON.stringify({ essential: true, marketing, analytics })
    );
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-fade-in">
      {!showSettings ? (
        <div className="bg-background p-6 rounded-2xl shadow-elevated">
          <button
            onClick={() => setVisible(false)}
            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <h3 className="text-base font-medium text-foreground font-sans mb-2">
            {t("inline.cookiebanner.t1")}
          </h3>

          <p className="text-sm text-muted-foreground mb-4">
            {t({
              de: "Diese Website verwendet 🍪 Cookies. Durch die Nutzung unserer Website erklärst du dich mit der Verwendung von Cookies einverstanden.",
              en: "This website uses 🍪 cookies. By using our website, you agree to the use of cookies.",
            })}{" "}
            <Link
              to={`${langPrefix}/datenschutz`}
              className="text-primary hover:underline"
            >
              {t("inline.cookiebanner.t2")}
            </Link>
            {" · "}
            <Link
              to={`${langPrefix}/cookies`}
              className="text-primary hover:underline"
            >
              {t("inline.cookiebanner.t3")}
            </Link>
          </p>

          <div className="flex gap-3">
            <button
              onClick={acceptAll}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-primary-foreground bg-primary rounded-full transition-smooth hover:opacity-90"
            >
              {t("inline.cookiebanner.t4")}
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-foreground bg-muted rounded-lg transition-smooth hover:bg-muted/80"
            >
              {t("inline.cookiebanner.t5")}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-background p-6 rounded-2xl shadow-elevated">
          <h3 className="text-base font-medium text-foreground font-sans mb-3">
            {t("inline.cookiebanner.t6")}
          </h3>

          <p className="text-xs text-muted-foreground mb-4">
            {t({
              de: "Wir verwenden Cookies 🍪, um das korrekte Funktionieren und die Sicherheit der Website zu gewährleisten.",
              en: "We use cookies 🍪 to ensure the correct functioning and security of the website.",
            })}
          </p>

          <div className="space-y-3 mb-4">
            <label className="flex items-center justify-between">
              <span className="text-sm text-foreground">
                {t("inline.cookiebanner.t7")}
              </span>
              <input type="checkbox" checked disabled className="accent-primary" />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-foreground">
                {t("inline.cookiebanner.t8")}
              </span>
              <input
                type="checkbox"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
                className="accent-primary"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-foreground">
                {t("inline.cookiebanner.t9")}
              </span>
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                className="accent-primary"
              />
            </label>
          </div>

          <div className="flex gap-3">
            <button
              onClick={acceptAll}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-primary-foreground bg-primary rounded-full transition-smooth hover:opacity-90"
            >
              {t("inline.cookiebanner.t10")}
            </button>

            <button
              onClick={saveSettings}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-foreground bg-muted rounded-lg transition-smooth hover:bg-muted/80"
            >
              {t("inline.cookiebanner.t11")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
