import { useMemo, useRef, useState } from "react";
import { contentFiles } from "@/config/site.config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { FileText, Plus, RefreshCw, Trash2, Upload } from "lucide-react";
import { deleteContent, uploadContent } from "./localApi";

const FOLDER_LABELS: Record<string, string> = {
  common: "Allgemein (Logo, Gutschein, Viator)",
  home: "Startseite",
  "home/features": "Startseite – Ausstattung",
  about: "Über uns",
  "about/gallery": "Über uns – Galerie",
  "about/why": "Über uns – Warum wir",
  "apartments-page": "Apartments-Seite",
  "guides-page": "Anleitungen-Seite",
  contact: "Kontakt",
};

const isList = (folder: string) => /\/(gallery|steps)$/.test(folder);
const isImage = (f: string) => /\.(avif|jpe?g|png|webp|gif|svg)$/i.test(f);

function label(folder: string) {
  if (FOLDER_LABELS[folder]) return FOLDER_LABELS[folder];
  const [kind, id, sub] = folder.split("/");
  const name = id?.replace(/-/g, " ");
  if (kind === "apartments") return `Apartment: ${name}${sub ? ` – ${sub === "gallery" ? "Galerie" : sub}` : ""}`;
  if (kind === "guides") return `Anleitung: ${name}${sub ? ` – ${sub === "steps" ? "Schritt-Fotos" : sub}` : ""}`;
  return folder;
}

export default function PhotoManager() {
  const [filter, setFilter] = useState("");
  const [bust, setBust] = useState(() => Date.now());
  const [busy, setBusy] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const target = useRef<{ path: string } | null>(null);

  const groups = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const f of contentFiles) {
      const rel = f.replace(/^\/content\//, "");
      const folder = rel.includes("/") ? rel.slice(0, rel.lastIndexOf("/")) : "";
      if (!map.has(folder)) map.set(folder, []);
      map.get(folder)!.push(rel);
    }
    return [...map.entries()]
      .map(([folder, files]) => ({ folder, files: files.sort() }))
      .sort((a, b) => a.folder.localeCompare(b.folder))
      .filter((g) => !filter || label(g.folder).toLowerCase().includes(filter.toLowerCase()) || g.folder.includes(filter.toLowerCase()));
  }, [filter]);

  const pick = (path: string) => {
    target.current = { path };
    inputRef.current?.click();
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !target.current) return;
    const path = target.current.path;
    setBusy(path);
    try {
      await uploadContent(path, file);
      toast.success(`Gespeichert: ${path}`);
      setBust(Date.now());
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(null);
    }
  };

  const addToList = (folder: string, files: string[]) => {
    const nums = files.map((f) => parseInt(f.split("/").pop() || "0", 10)).filter((n) => !isNaN(n));
    const next = String((nums.length ? Math.max(...nums) : 0) + 1).padStart(2, "0");
    const ext = files[0]?.split(".").pop() || "avif";
    pick(`${folder}/${next}.${ext}`);
  };

  const remove = async (path: string) => {
    if (!confirm(`Datei löschen?\n${path}`)) return;
    setBusy(path);
    try {
      await deleteContent(path);
      toast.success("Gelöscht");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-6">
      <input ref={inputRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={onFile} />
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          „Ersetzen“ behält den Dateinamen, damit die Seite das neue Foto sofort zeigt. In Galerien kannst du Fotos hinzufügen oder löschen.
        </p>
        <Input placeholder="Bereich suchen…" value={filter} onChange={(e) => setFilter(e.target.value)} className="sm:w-64" />
      </div>

      {groups.map(({ folder, files }) => (
        <section key={folder} className="rounded-xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h3 className="font-semibold text-foreground">{label(folder)}</h3>
              <p className="text-xs text-muted-foreground">public/content/{folder}</p>
            </div>
            {isList(folder) && (
              <Button size="sm" variant="outline" onClick={() => addToList(folder, files)} className="gap-1">
                <Plus className="w-4 h-4" /> Foto hinzufügen
              </Button>
            )}
          </div>
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
            {files.map((f) => (
              <figure key={f} className="rounded-lg border border-border overflow-hidden bg-background">
                <div className="aspect-[4/3] bg-muted flex items-center justify-center">
                  {isImage(f) ? (
                    <img src={`/content/${f}?t=${bust}`} alt={f} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <a href={`/content/${f}`} target="_blank" rel="noreferrer" className="flex flex-col items-center text-muted-foreground">
                      <FileText className="w-8 h-8" /> PDF
                    </a>
                  )}
                </div>
                <figcaption className="p-2 space-y-2">
                  <p className="text-xs truncate text-foreground" title={f}>{f.split("/").pop()}</p>
                  <div className="flex gap-1">
                    <Button size="sm" variant="secondary" className="flex-1 h-8 gap-1" disabled={busy === f} onClick={() => pick(f)}>
                      {busy === f ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />} Ersetzen
                    </Button>
                    {isList(folder) && (
                      <Button size="sm" variant="ghost" className="h-8 px-2" disabled={busy === f} onClick={() => remove(f)} aria-label="Löschen">
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
