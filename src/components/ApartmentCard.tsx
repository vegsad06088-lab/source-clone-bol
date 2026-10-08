import { Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n";

interface ApartmentCardProps {
  id: string;
  name: string;
  image: string;
  descriptionKey: string;
  persons: string;
  bedsKey: string;
  price: number;
  [key: string]: any;
}

export default function ApartmentCard({ id, name, image, descriptionKey, persons, bedsKey, price }: ApartmentCardProps) {
  const { t, langPrefix } = useI18n();

  return (
    <Link
      to={`${langPrefix}/${id}`}
      className="group block rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-smooth hover:-translate-y-1"
    >
      <div className="aspect-[4/3] overflow-hidden bg-card">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-smooth group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            console.error("Apartment card image failed to load:", image, e);
            e.currentTarget.style.backgroundColor = 'var(--card)';
          }}
        />
      </div>
      <div className="p-6 bg-background">
        <h3 className="text-xl font-serif font-semibold text-foreground mb-2">{name}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{t(descriptionKey)}</p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
          <span className="flex items-center gap-1">👤 {persons} {t("apartment.card.persons")}</span>
          <span className="flex items-center gap-1">🛏️ {t(bedsKey)}</span>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <span className="text-sm text-muted-foreground">{t("apartment.card.from")}</span>
            <span className="text-xl font-semibold text-foreground ml-1">€{price}</span>
            <span className="text-sm text-muted-foreground">/{t("apartment.card.night")}</span>
          </div>
          <button className="px-4 py-1.5 rounded-full font-medium text-xs text-white bg-primary hover:bg-primary/90 transition-smooth hover:shadow-lg active:scale-95 group-hover:shadow-lg">
            {t("apartment.card.view_details")}
          </button>
        </div>
      </div>
    </Link>
  );
}
