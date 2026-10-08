import { siteConfig } from "@/config/site.config";

async function loadGallery(id: string): Promise<string[]> {
  return siteConfig.apartment(id).gallery();
}

export const apartments = [
  {
    id: "twin-harmony-suite",
    name: "Twin Harmony Suite",
    image: siteConfig.apartment("twin-harmony-suite").cover,
    heroImage: siteConfig.apartment("twin-harmony-suite").hero,
    descriptionKey: "apartments.twin_harmony_suite.description",
    longDescriptionKey: "apartments.twin_harmony_suite.long_description",
    sectionTitleKey: "apartments.twin_harmony_suite.section_title",
    persons: "1-2",
    bedsKey: "apartments.twin_harmony_suite.beds",
    roomsKey: "apartments.twin_harmony_suite.rooms",
    size: "35m²",
    price: 50,
    galleryLoader: () => loadGallery("twin-harmony-suite"),
  },
  {
    id: "duo-deluxe-studio",
    name: "Duo Deluxe Studio",
    image: siteConfig.apartment("duo-deluxe-studio").cover,
    heroImage: siteConfig.apartment("duo-deluxe-studio").hero,
    descriptionKey: "apartments.duo_deluxe_studio.description",
    longDescriptionKey: "apartments.duo_deluxe_studio.long_description",
    sectionTitleKey: "apartments.duo_deluxe_studio.section_title",
    persons: "1-2",
    bedsKey: "apartments.duo_deluxe_studio.beds",
    roomsKey: "apartments.duo_deluxe_studio.rooms",
    size: "35m²",
    price: 50,
    galleryLoader: () => loadGallery("duo-deluxe-studio"),
  },
  {
    id: "cosy-couple-nest",
    name: "Cosy Couple Nest",
    image: siteConfig.apartment("cosy-couple-nest").cover,
    heroImage: siteConfig.apartment("cosy-couple-nest").hero,
    descriptionKey: "apartments.cosy_couple_nest.description",
    longDescriptionKey: "apartments.cosy_couple_nest.long_description",
    sectionTitleKey: "apartments.cosy_couple_nest.section_title",
    persons: "1-2",
    bedsKey: "apartments.cosy_couple_nest.beds",
    roomsKey: "apartments.cosy_couple_nest.rooms",
    size: "35m²",
    price: 55,
    galleryLoader: () => loadGallery("cosy-couple-nest"),
  },
  {
    id: "trio-harmony-suite",
    name: "Trio Harmony Suite",
    image: siteConfig.apartment("trio-harmony-suite").cover,
    heroImage: siteConfig.apartment("trio-harmony-suite").hero,
    descriptionKey: "apartments.trio_harmony_suite.description",
    longDescriptionKey: "apartments.trio_harmony_suite.long_description",
    sectionTitleKey: "apartments.trio_harmony_suite.section_title",
    persons: "1-3",
    bedsKey: "apartments.trio_harmony_suite.beds",
    roomsKey: "apartments.trio_harmony_suite.rooms",
    size: "35m²",
    price: 50,
    galleryLoader: () => loadGallery("trio-harmony-suite"),
  },
];

export const amenities = [
  { icon: "🔑", labelKey: "amenities.self_check_in" },
  { icon: "♿", labelKey: "amenities.accessible" },
  { icon: "🚭", labelKey: "amenities.non_smoking" },
  { icon: "📶", labelKey: "amenities.wifi_250_mbit" },
  { icon: "📺", labelKey: "amenities.tv" },
  { icon: "💨", labelKey: "amenities.hair_dryer" },
  { icon: "🚿", labelKey: "amenities.shower" },
  { icon: "🧴", labelKey: "amenities.soft_towels" },
  { icon: "❄️", labelKey: "amenities.refrigerator" },
  { icon: "📡", labelKey: "amenities.microwave" },
  { icon: "🍳", labelKey: "amenities.stove" },
  { icon: "☕", labelKey: "amenities.kettle" },
];

export const instructions = [
  {
    id: "check-in-anleitung",
    titleKey: "instructions.check_in_guide.title",
    descriptionKey: "instructions.check_in_guide.description",
    image: siteConfig.guide("check-in-anleitung").cover,
    category: "apartments",
    pdf: {
      de: siteConfig.guide("check-in-anleitung").pdf("de"),
      en: siteConfig.guide("check-in-anleitung").pdf("en"),
    },
  },
  {
    id: "bugeleisen-bugelbrett",
    titleKey: "instructions.iron_board.title",
    descriptionKey: "instructions.iron_board.description",
    image: siteConfig.guide("bugeleisen-bugelbrett").cover,
    category: "apartments",
    pdf: {
      de: siteConfig.guide("bugeleisen-bugelbrett").pdf("de"),
      en: siteConfig.guide("bugeleisen-bugelbrett").pdf("en"),
    },
  },
  {
    id: "parkmoglichkeiten",
    titleKey: "instructions.parking_options.title",
    descriptionKey: "instructions.parking_options.description",
    image: siteConfig.guide("parkmoglichkeiten").cover,
    category: "location",
  },
  {
    id: "check-out-anleitung",
    titleKey: "instructions.check_out_guide.title",
    descriptionKey: "instructions.check_out_guide.description",
    image: siteConfig.guide("check-out-anleitung").cover,
    category: "apartments",
  },
  {
    id: "offentlichen-verkehrsmittel-in-wien",
    titleKey: "instructions.public_transport_vienna.title",
    descriptionKey: "instructions.public_transport_vienna.description",
    image: siteConfig.guide("offentlichen-verkehrsmittel-in-wien").cover,
    category: "location",
  },
  {
    id: "gepackaufbewahrung-vor-dem-check-in",
    titleKey: "instructions.luggage_before_check_in.title",
    descriptionKey: "instructions.luggage_before_check_in.description",
    image: siteConfig.guide("gepackaufbewahrung-vor-dem-check-in").cover,
    category: "apartments",
  },
  {
    id: "gepackaufbewahrung-nach-dem-check-out",
    titleKey: "instructions.luggage_after_check_out.title",
    descriptionKey: "instructions.luggage_after_check_out.description",
    image: siteConfig.guide("gepackaufbewahrung-nach-dem-check-out").cover,
    category: "apartments",
  },
  {
    id: "anleitung-zur-steuerung-der-heizung",
    titleKey: "instructions.heating_control.title",
    descriptionKey: "instructions.heating_control.description",
    image: siteConfig.guide("anleitung-zur-steuerung-der-heizung").cover,
    category: "apartments",
    pdf: {
      de: siteConfig.guide("anleitung-zur-steuerung-der-heizung").pdf("de"),
      en: siteConfig.guide("anleitung-zur-steuerung-der-heizung").pdf("en"),
    },
  },
  {
    id: "anleitung-tv",
    titleKey: "instructions.tv_guide.title",
    descriptionKey: "instructions.tv_guide.description",
    image: siteConfig.guide("anleitung-tv").cover,
    category: "apartments",
    pdf: {
      de: siteConfig.guide("anleitung-tv").pdf("de"),
      en: siteConfig.guide("anleitung-tv").pdf("en"),
    },
  },
  {
    id: "anleitung-induktionskochplatte",
    titleKey: "instructions.induction_cooktop.title",
    descriptionKey: "instructions.induction_cooktop.description",
    image: siteConfig.guide("anleitung-induktionskochplatte").cover,
    category: "apartments",
    pdf: {
      de: siteConfig.guide("anleitung-induktionskochplatte").pdf("de"),
      en: siteConfig.guide("anleitung-induktionskochplatte").pdf("en"),
    },
  },
  {
    id: "mit-kindern-wien-entdecken",
    titleKey: "instructions.discover_vienna_kids.title",
    descriptionKey: "instructions.discover_vienna_kids.description",
    image: siteConfig.guide("mit-kindern-wien-entdecken").cover,
    category: "location",
  },
];

export const reviews = [
  { textKey: "reviews.petra.text", quoteKey: "reviews.petra.quote", name: "Petra", locationKey: "reviews.petra.location" },
  { textKey: "reviews.luca.text", quoteKey: "reviews.luca.quote", name: "Luca", locationKey: "reviews.luca.location" },
  { textKey: "reviews.sophie.text", quoteKey: "reviews.sophie.quote", name: "Sophie", locationKey: "reviews.sophie.location" },
  { textKey: "reviews.fam_welter.text", quoteKey: "reviews.fam_welter.quote", name: "Fam. Welter", locationKey: "reviews.fam_welter.location" },
  { textKey: "reviews.tomasz.text", quoteKey: "reviews.tomasz.quote", name: "Tomasz", locationKey: "reviews.tomasz.location" },
  { textKey: "reviews.laura_tom.text", quoteKey: "reviews.laura_tom.quote", name: "Laura & Tom", locationKey: "reviews.laura_tom.location" },
];

export const faqs = [
  { qKey: "faq.booking.q", aKey: "faq.booking.a" },
  { qKey: "faq.prices.q", aKey: "faq.prices.a" },
  { qKey: "faq.amenities.q", aKey: "faq.amenities.a" },
  { qKey: "faq.pets.q", aKey: "faq.pets.a" },
  { qKey: "faq.discounts.q", aKey: "faq.discounts.a" },
  { qKey: "faq.parking.q", aKey: "faq.parking.a" },
];

export const features = [
  { image: siteConfig.images.features.elevator, titleKey: "home.features.elevator" },
  { image: siteConfig.images.features.tv, titleKey: "home.features.tv" },
  { image: siteConfig.images.features.hairDryer, titleKey: "home.features.hair_dryer" },
  { image: siteConfig.images.features.wifi, titleKey: "home.features.wifi" },
  { image: siteConfig.images.features.kitchen, titleKey: "home.features.cooking" },
  { image: siteConfig.images.features.towels, titleKey: "home.features.towels" },
];

