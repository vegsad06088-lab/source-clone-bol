/**
 * PageRouter — sits inside the Layout outlet, maps the URL to a page JSON id,
 * lazy-loads the page definition, and hands it to PageRenderer.
 *
 * This is the single route component that replaces all individual page imports.
 * Header and footer stay fixed (they're in Layout); only this body swaps.
 */
import { lazy, Suspense } from "react";
import { useParams, useLocation } from "react-router-dom";
import { usePage } from "@/lib/content-loader";
import NotFound from "@/pages/NotFound";

const PageRenderer = lazy(() => import("@/components/PageRenderer"));

/** Map URL path segments to page JSON file ids. */
function resolvePageId(location: string, aptSlug?: string, guideSlug?: string): string {
  // Apartment detail pages
  if (aptSlug) return `apartments/${aptSlug}`;
  // Guide detail pages
  if (guideSlug) return `guides/${guideSlug}`;
  // Top-level pages — strip leading slash, use first segment
  const seg = location.replace(/^\//, "").split("/")[0];
  return seg || "home";
}

export default function PageRouter() {
  const { lang } = useParams();
  const location = useLocation();

  // Extract the page path after the language prefix
  const fullPath = location.pathname;
  const afterLang = lang ? fullPath.split(`/${lang}`)[1] || "" : fullPath;
  const cleanPath = afterLang.replace(/^\//, "");

  // Check if this is an apartment detail route
  const aptSlugs = ["twin-harmony-suite", "duo-deluxe-studio", "cosy-couple-nest", "trio-harmony-suite"];
  const guideMatch = cleanPath.match(/^anleitungen-post\/(.+)$/);

  const pageId = resolvePageId(
    cleanPath,
    aptSlugs.includes(cleanPath) ? cleanPath : undefined,
    guideMatch ? guideMatch[1] : undefined,
  );

  const { page, loading, error } = usePage(pageId);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !page || page.visible === false) {
    return <NotFound />;
  }

  return (
    <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
      <PageRenderer page={page} />
    </Suspense>
  );
}
