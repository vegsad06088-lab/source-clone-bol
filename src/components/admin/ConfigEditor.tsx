import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

/**
 * Local-only settings editor. Talks to the /__config API from vite.config.ts,
 * which exists only while running `npm run dev`. Saving writes the JSON file directly
 * on disk and the preview reloads automatically.
 */
const isLocal = import.meta.env.DEV;

const DESCRIPTIONS: Record<string, string> = {
  "config/pages.json": "Seiten und Funktionen ein-/ausschalten",
  "config/site.json": "Firmenname, Kontakt, Links",
  "config/offers.json": "Rabatt-Banner und Gutschein",
};

async function api(file?: string, body?: string) {
  const res = await fetch(`/__config${file ? `?file=${encodeURIComponent(file)}` : ""}`, {
    method: body === undefined ? "GET" : "POST",
    body,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || res.statusText);
  return json;
}

export default function ConfigEditor() {
  const [files, setFiles] = useState<string[]>([]);
  const [file, setFile] = useState("config/pages.json");
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isLocal) return;
    api().then((r) => setFiles(r.files)).catch((e) => setError(String(e.message)));
  }, []);

  useEffect(() => {
    if (!isLocal || !file) return;
    api(file).then((r) => { setText(r.content); setError(null); }).catch((e) => setError(String(e.message)));
  }, [file]);

  const save = async (content = text) => {
    try {
      JSON.parse(content);
    } catch {
      setError("Ungültiges JSON – bitte Kommas und Anführungszeichen prüfen.");
      return;
    }
    setSaving(true);
    try {
      await api(file, content);
      setText(content);
      setError(null);
      toast.success("Gespeichert – Seite lädt neu");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  if (!isLocal) {
    return (
      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-lg font-semibold text-foreground">Einstellungen</h2>
        <p className="text-sm text-muted-foreground">
          Der Einstellungs-Editor funktioniert nur lokal (<code>npm run dev</code>). Auf der veröffentlichten Seite kann nichts geändert werden.
        </p>
      </section>
    );
  }

  let parsed: Record<string, Record<string, boolean>> | null = null;
  if (file === "config/pages.json") {
    try { parsed = JSON.parse(text); } catch { parsed = null; }
  }
  const toggle = (group: string, key: string, value: boolean) => {
    if (!parsed) return;
    const next = { ...parsed, [group]: { ...parsed[group], [key]: value } };
    save(JSON.stringify(next, null, 2));
  };

  return (
    <section className="rounded-xl border border-border bg-card p-5 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Einstellungen (lokal)</h2>
        <p className="text-sm text-muted-foreground">Änderungen werden direkt in die Projektdateien gespeichert.</p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <ul className="md:w-72 shrink-0 space-y-1 max-h-[480px] overflow-auto">
          {files.map((f) => (
            <li key={f}>
              <button
                onClick={() => setFile(f)}
                className={`w-full text-left rounded-lg px-3 py-2 text-sm ${f === file ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"}`}
              >
                <span className="block truncate">{f}</span>
                {DESCRIPTIONS[f] && <span className="block text-xs opacity-75">{DESCRIPTIONS[f]}</span>}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex-1 min-w-0 space-y-3">
          {parsed && (
            <div className="grid gap-2 sm:grid-cols-2">
              {Object.entries(parsed).map(([group, items]) =>
                Object.entries(items).map(([key, value]) => (
                  <label key={group + key} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
                    <span className="text-foreground">{group === "pages" ? "Seite" : "Funktion"}: <strong>{key}</strong></span>
                    <Switch checked={value !== false} disabled={saving} onCheckedChange={(v) => toggle(group, key, v)} />
                  </label>
                )),
              )}
            </div>
          )}
          <Textarea value={text} onChange={(e) => setText(e.target.value)} className="font-mono text-xs min-h-[360px]" spellCheck={false} />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button onClick={() => save()} disabled={saving}>{saving ? "Speichern…" : "Speichern"}</Button>
        </div>
      </div>
    </section>
  );
}
