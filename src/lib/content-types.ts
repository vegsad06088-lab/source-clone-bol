/**
 * Content schema types for the JSON-driven page system.
 * Each page and each content item (news, apartment, guide) is a JSON file
 * with a standard envelope: visible, lastChanged, and per-language text.
 */

export type Lang = string;

/** A text value that can be plain text or HTML. The renderer detects HTML by leading "<". */
export interface LocalizedText {
  [lang: string]: string;
}

/** A single image reference — path relative to /content/. */
export interface ImageRef {
  src: string;
  alt?: LocalizedText;
}

/** Block types the renderer knows how to draw. */
export type BlockType =
  | "hero"
  | "text"
  | "gallery"
  | "cards"
  | "features"
  | "cta"
  | "viator"
  | "booking"
  | "reviews"
  | "faq"
  | "promo"
  | "news-list"
  | "contact-info"
  | "map"
  | "apartment-list"
  | "guide-list"
  | "custom";

/** A single renderable block on a page. */
export interface Block {
  id: string;
  type: BlockType;
  visible: boolean;
  /** Heading text per language. */
  title?: LocalizedText;
  /** Subtitle / description per language. */
  subtitle?: LocalizedText;
  /** Body text per language — plain or HTML. */
  body?: LocalizedText;
  /** Image or images for this block. */
  images?: ImageRef[];
  /** Gallery folder relative to /content/ (auto-scanned). */
  galleryFolder?: string;
  /** Card items (e.g. features, why-us tiles). */
  items?: CardItem[];
  /** CTA buttons. */
  buttons?: CTAButton[];
  /** Background image path relative to /content/. */
  backgroundImage?: string;
  /** Extra CSS class for the section. */
  className?: string;
  /** Ordering weight — higher = earlier. */
  order?: number;
  /** Arbitrary data for custom block types. */
  data?: Record<string, unknown>;
}

/** A card item: icon image + title + description. */
export interface CardItem {
  id: string;
  visible: boolean;
  image?: string;
  title: LocalizedText;
  description?: LocalizedText;
}

/** A call-to-action button. */
export interface CTAButton {
  label: LocalizedText;
  href?: string;
  to?: string;
  variant?: "primary" | "outline";
}

/** A news / event item. */
export interface NewsItem {
  id: string;
  visible: boolean;
  lastChanged: string; // ISO date
  date: string; // ISO date for display ordering
  title: LocalizedText;
  summary: LocalizedText;
  body?: LocalizedText;
  image?: string;
  tags?: string[];
}

/** A page definition. */
export interface PageDef {
  id: string;
  visible: boolean;
  lastChanged: string;
  title: LocalizedText;
  /** Blocks rendered top-to-bottom. */
  blocks: Block[];
  /** If this is a detail page (apartment/guide), the item id. */
  itemId?: string;
}

/** Index of all pages in the project. */
export interface PagesIndex {
  pages: { id: string; visible: boolean; route: string; }[];
  news: { id: string; visible: boolean; date: string; }[];
  apartments: { id: string; visible: boolean; }[];
  guides: { id: string; visible: boolean; }[];
}
