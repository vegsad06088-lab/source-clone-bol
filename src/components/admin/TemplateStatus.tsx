import { siteConfig, contentFiles, gallery } from "@/config/site.config";
import { apartments, instructions } from "@/lib/data";
import { CheckCircle2, XCircle } from "lucide-react";

type Row = { label: string; ok: boolean; detail?: string };

export default function TemplateStatus() {
  const has = (p: string) => contentFiles.includes(p);
  const rows: Row[] = [
    ...siteConfig.requiredFiles.map((f) => ({ label: f, ok: has(`/content/${f}`) })),
    ...Object.entries(siteConfig.images.features).map(([k, p]) => ({ label: `home/features/${k}`, ok: has(p) })),
    ...apartments.flatMap((a) => {
      const g = gallery(`apartments/${a.id}/gallery`).length;
      return [
        { label: `apartments/${a.id}/cover`, ok: has(a.image) },
        { label: `apartments/${a.id}/hero`, ok: has(a.heroImage) },
        { label: `apartments/${a.id}/gallery`, ok: g > 0, detail: `${g} Fotos` },
      ];
    }),
    ...instructions.map((i) => ({ label: `guides/${i.id}/cover`, ok: has(i.image) })),
  ];
  const missing = rows.filter((r) => !r.ok).length;

  return (
    <section className="rounded-xl border border-border bg-card p-5 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Template-Status</h2>
        <p className="text-sm text-muted-foreground">
          {missing === 0 ? "Alle erwarteten Fotos sind vorhanden." : `${missing} Datei(en) fehlen.`} Anleitung: docs/REBRAND_GUIDE.md im Projekt.
        </p>
      </div>
      <ul className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3 text-sm">
        {rows.map((r) => (
          <li key={r.label} className="flex items-center gap-2">
            {r.ok ? <CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> : <XCircle className="w-4 h-4 text-destructive shrink-0" />}
            <span className="truncate text-foreground">{r.label}</span>
            {r.detail && <span className="text-muted-foreground">({r.detail})</span>}
          </li>
        ))}
      </ul>
    </section>
  );
}
