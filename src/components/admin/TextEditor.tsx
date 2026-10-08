import { useEffect, useMemo, useState } from "react";
import { LANGUAGE_PACK } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { readJsonFile, writeJsonFile } from "./localApi";

const ALL_LANGS = ["de", "en", "sq", "fr", "it", "es", "tr", "ru", "ja", "zh"];
type Dict = Record<string, string>;
const PAGE_SIZE = 60;

/** Edit all website texts side by side, per language. Saves straight into the active project's translations/<lang>.json */
export default function TextEditor() {
  const [langs, setLangs] = useState<string[]>(() => [...LANGUAGE_PACK].slice(0, 2));
  const [data, setData] = useState<Record<string, Dict>>({});
  const [dirty, setDirty] = useState<Record<string, Dict>>({});
  const [query, setQuery] = useState("");
  const [section, setSection] = useState("");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    langs.filter((l) => !data[l]).forEach(async (l) => {
      try {
        const d = JSON.parse(await readJsonFile(`translations/${l}.json`));
        setData((p) => ({ ...p, [l]: d }));
      } catch (e) {
        toast.error(`${l}.json: ${(e as Error).message}`);
      }
    });
  }, [langs, data]);

  // keys without the language prefix ("home.hero.title")
  const keys = useMemo(() => {
    const set = new Set<string>();
    for (const l of langs) for (const k of Object.keys(data[l] || {})) set.add(k.slice(l.length + 1));
    return [...set];
  }, [data, langs]);

  const sections = useMemo(() => [...new Set(keys.map((k) => k.split(".")[0]))].sort(), [keys]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return keys.filter((k) => {
      if (section && !k.startsWith(section + ".")) return false;
      if (!q) return true;
      return k.toLowerCase().includes(q) || langs.some((l) => (data[l]?.[`${l}.${k}`] || "").toLowerCase().includes(q));
    });
  }, [keys, query, section, langs, data]);

  const value = (l: string, k: string) => dirty[l]?.[`${l}.${k}`] ?? data[l]?.[`${l}.${k}`] ?? "";
  const change = (l: string, k: string, v: string) => setDirty((p) => ({ ...p, [l]: { ...p[l], [`${l}.${k}`]: v } }));
  const dirtyCount = Object.values(dirty).reduce((n, d) => n + Object.keys(d).length, 0);

  const save = async () => {
    setSaving(true);
    try {
      for (const [l, changes] of Object.entries(dirty)) {
        // re-read from disk so we never overwrite edits made in another window/IDE
        const fresh = JSON.parse(await readJsonFile(`translations/${l}.json`));
        const next = { ...fresh, ...changes };
        await writeJsonFile(`translations/${l}.json`, JSON.stringify(next, null, 2));
        setData((p) => ({ ...p, [l]: next }));
      }
      setDirty({});
      toast.success("Texte gespeichert");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Sprachen:</span>
        {ALL_LANGS.map((l) => (
          <button
            key={l}
            onClick={() => setLangs((p) => (p.includes(l) ? p.filter((x) => x !== l) : [...p, l]))}
            className={`rounded-full px-3 py-1 text-xs font-medium border ${langs.includes(l) ? "bg-primary text-primary-foreground border-primary" : "border-border text-foreground"}`}
          >
            {l.toUpperCase()}
            {(LANGUAGE_PACK as readonly string[]).includes(l) ? "" : " (inaktiv)"}
          </button>
        ))}
      </div>

      <div className="sticky top-0 z-10 flex flex-col gap-2 bg-background py-2 sm:flex-row sm:items-center">
        <Input placeholder="Text oder Schlüssel suchen…" value={query} onChange={(e) => { setQuery(e.target.value); setLimit(PAGE_SIZE); }} className="sm:w-80" />
        <select
          value={section}
          onChange={(e) => { setSection(e.target.value); setLimit(PAGE_SIZE); }}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground"
        >
          <option value="">Alle Bereiche ({keys.length})</option>
          {sections.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <div className="sm:ml-auto flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{filtered.length} Texte · {dirtyCount} geändert</span>
          <Button onClick={save} disabled={!dirtyCount || saving}>{saving ? "Speichern…" : "Speichern"}</Button>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.slice(0, limit).map((k) => (
          <div key={k} className="rounded-lg border border-border bg-card p-3 space-y-2">
            <code className="text-xs text-muted-foreground">{k}</code>
            <div className={`grid gap-2 ${langs.length > 1 ? "md:grid-cols-2" : ""} ${langs.length > 2 ? "xl:grid-cols-3" : ""}`}>
              {langs.map((l) => {
                const v = value(l, k);
                const changed = dirty[l]?.[`${l}.${k}`] !== undefined;
                return (
                  <label key={l} className="space-y-1">
                    <span className="text-xs font-medium text-foreground">{l.toUpperCase()}{changed && " •"}</span>
                    <Textarea
                      value={v}
                      onChange={(e) => change(l, k, e.target.value)}
                      rows={Math.min(6, Math.max(1, Math.ceil(v.length / 70)))}
                      className={`text-sm ${changed ? "border-primary" : ""} ${!v ? "border-destructive" : ""}`}
                      placeholder="(fehlt)"
                    />
                  </label>
                );
              })}
            </div>
          </div>
        ))}
        {filtered.length > limit && (
          <Button variant="outline" className="w-full" onClick={() => setLimit((n) => n + PAGE_SIZE)}>Mehr anzeigen</Button>
        )}
      </div>
    </div>
  );
}
