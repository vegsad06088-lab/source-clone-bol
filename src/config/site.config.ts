/**
 * SITE CONFIG — the single file to edit when adapting this template to a new property.
 * All photos live in projects/<active>/content/** with FIXED file names.
 * Replace the photo files, edit the values below, and the whole site updates.
 */
import { contentFiles } from "virtual:content-manifest";
import { projectName } from "virtual:active-project";
import site from "../../projects/apzurquelle/config/site.json";
import pagesJson from "../../projects/apzurquelle/config/pages.json";

export type PageKey = keyof typeof pagesJson.pages;
/** true if a page is switched on in the active project's config/pages.json */
export const isPageOn = (k: PageKey) => pagesJson.pages[k] !== false;
export const isFeatureOn = (k: keyof typeof pagesJson.features) => pagesJson.features[k] !== false;

export { projectName };

const c = (p: string) => `/content/${p}`;

/** Lists numbered gallery files in a folder, e.g. gallery("apartments/x/gallery") */
export function gallery(folder: string): string[] {
  const prefix = `/content/${folder.replace(/\/$/, "")}/`;
  return contentFiles
    .filter((f) => f.startsWith(prefix) && /\.(avif|jpe?g|png|webp)$/i.test(f) && !f.slice(prefix.length).includes("/"))
    .sort();
}

export const siteConfig = {
  brand: {
    name: site.brand.name,
    logo: c("common/logo.avif"),
  },
  contact: site.contact,
  booking: site.booking,
  images: {
    viatorBg: c("common/viator-bg.avif"),
    voucher: c("common/voucher.png"),
    homeHero: c("home/hero.avif"),
    aboutHero: c("about/hero.jpg"),
    aboutLocation: c("about/location.avif"),
    aboutGallery: () => gallery("about/gallery"),
    aboutWhy: {
      location: c("about/why/location.avif"),
      personality: c("about/why/personality.avif"),
      service: c("about/why/service.avif"),
      detail: c("about/why/detail.avif"),
    },
    apartmentsHero: c("apartments-page/hero.avif"),
    guidesHero: c("guides-page/hero.avif"),
    contactHero: c("contact/hero.avif"),
    features: {
      elevator: c("home/features/elevator.avif"),
      tv: c("home/features/tv.avif"),
      hairDryer: c("home/features/hair-dryer.avif"),
      wifi: c("home/features/wifi.avif"),
      kitchen: c("home/features/kitchen.avif"),
      towels: c("home/features/towels.avif"),
    },
  },
  apartment: (id: string) => ({
    cover: c(`apartments/${id}/cover.avif`),
    hero: c(`apartments/${id}/hero.avif`),
    gallery: () => gallery(`apartments/${id}/gallery`),
  }),
  guide: (id: string) => ({
    cover: c(`guides/${id}/cover.avif`),
    pdf: (lang: "de" | "en") => {
      const f = c(`guides/${id}/${lang}.pdf`);
      return contentFiles.includes(f) ? f : undefined;
    },
  }),
  requiredFiles: [
    "common/logo.avif", "common/viator-bg.avif", "common/voucher.png",
    "home/hero.avif", "about/hero.jpg", "about/location.avif",
    "apartments-page/hero.avif", "guides-page/hero.avif", "contact/hero.avif",
  ],
};

export { contentFiles };
