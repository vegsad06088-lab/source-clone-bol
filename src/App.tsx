import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, useParams } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider, LANGUAGE_PACK, Lang, DEFAULT_LANGUAGE } from "@/lib/i18n";
import RedirectWithParams from "@/components/RedirectWithParams";
import Layout from "@/components/Layout";
import PageRouter from "@/components/PageRouter";
import NotFound from "@/pages/NotFound";
import ScrollToTop from "@/components/ScrollToTop";
import ChatPage from "@/pages/ChatPage";
import RegistrierungPage from "@/pages/RegistrierungPage";
import AdminPage from "@/pages/AdminPage";

const queryClient = new QueryClient();

function LangWrapper() {
  const { lang } = useParams();

  const selectedLang: Lang = LANGUAGE_PACK.includes(lang as Lang)
    ? (lang as Lang)
    : "de";

  return (
    <I18nProvider initialLang={selectedLang}>
      <Layout />
    </I18nProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <BrowserRouter>
          <ScrollToTop />

          <Routes>
            {/* Redirect root to default language */}
            <Route path="/" element={<Navigate to={`/${DEFAULT_LANGUAGE}`} replace />} />

            {/* Direct apartment routes (redirect to language-prefixed version) */}
            <Route path="/twin-harmony-suite" element={<Navigate to={`/${DEFAULT_LANGUAGE}/twin-harmony-suite`} replace />} />
            <Route path="/duo-deluxe-studio" element={<Navigate to={`/${DEFAULT_LANGUAGE}/duo-deluxe-studio`} replace />} />
            <Route path="/cosy-couple-nest" element={<Navigate to={`/${DEFAULT_LANGUAGE}/cosy-couple-nest`} replace />} />
            <Route path="/trio-harmony-suite" element={<Navigate to={`/${DEFAULT_LANGUAGE}/trio-harmony-suite`} replace />} />

            {/* Direct instruction routes (redirect to language-prefixed version) */}
            <Route path="/anleitungen" element={<Navigate to={`/${DEFAULT_LANGUAGE}/anleitungen`} replace />} />
            <Route path="/anleitungen-post/:slug" element={<RedirectWithParams basePath="/anleitungen-post/:slug" />} />

            {/* Direct page routes (redirect to language-prefixed version) */}
            <Route path="/apartments" element={<Navigate to={`/${DEFAULT_LANGUAGE}/apartments`} replace />} />
            <Route path="/about" element={<Navigate to={`/${DEFAULT_LANGUAGE}/about`} replace />} />
            <Route path="/contact" element={<Navigate to={`/${DEFAULT_LANGUAGE}/contact`} replace />} />
            <Route path="/news" element={<Navigate to={`/${DEFAULT_LANGUAGE}/news`} replace />} />
            <Route path="/datenschutz" element={<Navigate to={`/${DEFAULT_LANGUAGE}/datenschutz`} replace />} />
            <Route path="/cookies" element={<Navigate to={`/${DEFAULT_LANGUAGE}/cookies`} replace />} />
            <Route path="/impressum" element={<Navigate to={`/${DEFAULT_LANGUAGE}/impressum`} replace />} />
            <Route path="/agb" element={<Navigate to={`/${DEFAULT_LANGUAGE}/agb`} replace />} />
            <Route path="/booking-conditions" element={<Navigate to={`/${DEFAULT_LANGUAGE}/booking-conditions`} replace />} />
            <Route path="/chat" element={<Navigate to={`/${DEFAULT_LANGUAGE}/chat`} replace />} />
            <Route path="/registrierung" element={<RegistrierungPage />} />
            <Route path="/admin" element={<AdminPage />} />

            {/* All language-specific routes — PageRouter handles everything */}
            <Route path="/:lang" element={<LangWrapper />}>
              <Route index element={<PageRouter />} />
              <Route path="apartments" element={<PageRouter />} />
              <Route path="twin-harmony-suite" element={<PageRouter />} />
              <Route path="duo-deluxe-studio" element={<PageRouter />} />
              <Route path="cosy-couple-nest" element={<PageRouter />} />
              <Route path="trio-harmony-suite" element={<PageRouter />} />
              <Route path="about" element={<PageRouter />} />
              <Route path="contact" element={<PageRouter />} />
              <Route path="news" element={<PageRouter />} />
              <Route path="anleitungen" element={<PageRouter />} />
              <Route path="anleitungen-post/:slug" element={<PageRouter />} />
              <Route path="datenschutz" element={<PageRouter />} />
              <Route path="cookies" element={<PageRouter />} />
              <Route path="impressum" element={<PageRouter />} />
              <Route path="agb" element={<PageRouter />} />
              <Route path="booking-conditions" element={<PageRouter />} />
              <Route path="chat" element={<ChatPage />} />
            </Route>

            {/* Fallback 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>

        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
