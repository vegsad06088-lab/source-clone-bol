import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { LANGUAGE_PACK, Lang } from "@/lib/i18n";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LanguageInfo {
  code: Lang;
  name: string;
  flag: string;
  nativeName: string;
}

// ============================================
// LANGUAGE METADATA
// ============================================
// Add all available languages here with their display information.
// These will be automatically mapped to LANGUAGE_PACK in the language selector.
// When adding a new language:
// 1. Add entry here with name, flag, and native name
// 2. Add language code to LANGUAGE_PACK in src/lib/i18n.tsx
// 3. Create translation JSON file in src/translations/{code}.json
// That's it! The selector will automatically include the new language.
// ============================================

const LANGUAGE_METADATA: Record<string, Omit<LanguageInfo, "code">> = {
  de: { name: "German", flag: "🇩🇪", nativeName: "Deutsch" },
  en: { name: "English", flag: "🇬🇧", nativeName: "English" },
  sq: { name: "Albanian", flag: "🇦🇱", nativeName: "Shqip" },
  fr: { name: "French", flag: "🇫🇷", nativeName: "Français" },
  it: { name: "Italian", flag: "🇮🇹", nativeName: "Italiano" },
  es: { name: "Spanish", flag: "🇪🇸", nativeName: "Español" },
  tr: { name: "Turkish", flag: "🇹🇷", nativeName: "Türkçe" },
  ru: { name: "Russian", flag: "🇷🇺", nativeName: "Русский" },
  ja: { name: "Japanese", flag: "🇯🇵", nativeName: "日本語" },
  zh: { name: "Chinese", flag: "🇨🇳", nativeName: "中文" },
};

// Auto-generate LANGUAGE_INFO from LANGUAGE_PACK and LANGUAGE_METADATA
const LANGUAGE_INFO: Record<Lang, LanguageInfo> = Object.fromEntries(
  LANGUAGE_PACK.map((code) => [
    code,
    {
      code,
      ...(LANGUAGE_METADATA[code] || { name: code, flag: "🌍", nativeName: code }),
    },
  ])
) as Record<Lang, LanguageInfo>;

export default function LanguageSelector() {
  const { lang, setLang } = useI18n();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const currentLang = LANGUAGE_INFO[lang];

  const switchLang = (newLang: Lang) => {
    setLang(newLang);

    const parts = location.pathname.split("/");
    let rest = parts.slice(2).join("/");
    if (rest === "") rest = "";

    const newPath =
      newLang === "de"
        ? `/${rest}`
        : `/${newLang}/${rest}`;

    window.history.replaceState(null, "", newPath);
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-foreground rounded-lg hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Select language"
          title={`Switch language - ${currentLang.nativeName}`}
        >
          <Globe size={18} className="mr-2" />
          <span className="text-lg leading-none font-emoji" style={{ fontFamily: 'Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, sans-serif' }}>{currentLang.flag}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {LANGUAGE_PACK.map((lng) => (
          <DropdownMenuItem
            key={lng}
            onClick={() => switchLang(lng)}
            className={`cursor-pointer flex items-center gap-3 ${
              lng === lang ? "bg-accent" : ""
            }`}
          >
            <span className="text-xl" style={{ fontFamily: 'Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, sans-serif', letterSpacing: 0 }}>{LANGUAGE_INFO[lng].flag}</span>
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {LANGUAGE_INFO[lng].nativeName}
              </span>
              <span className="text-xs text-muted-foreground">
                {LANGUAGE_INFO[lng].name}
              </span>
            </div>
            {lng === lang && (
              <span className="ml-auto text-primary text-lg">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

