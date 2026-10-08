import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import { Eye, EyeOff, Pencil, X } from "lucide-react";
import { toast } from "sonner";
import { useI18n, LANGUAGE_PACK } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { isLocal, readJsonFile, uploadContent, writeJsonFile } from "@/components/admin/localApi";
import { BLOCK_SELECTOR, blockCss, hiddenBlocks, pageKey } from "./blocks";

/**
 * On-page editor. Only active when running locally AND logged in at /admin.
 * - every page section gets a toolbar: show / hide (saved in src/config/blocks.json)
 * - click a text → edit it in every language (saved in src/translations/*.json)
 * - click a photo → replace the file in public/content
 */
const isAdmin = () => isLocal && sessionStorage.getItem("localAdmin") === "1";

export function BlockStyles() {
  const { pathname } = useLocation();
  const edit = isAdmin() && sessionStorage.getItem("editMode") === "1";
  const css = blockCss(pathname, edit);
  return css ? <style>{css}</style> : null;
}

type TextTarget = { key: string; values: Record<string, string> };

export default function EditMode() {
  const { pathname } = useLocation();
  const { lang, translations } = useI18n();
  const [on, setOnState] = useState(() => sessionStorage.getItem("editMode") === "1");
  const [sections, setSections] = useState<HTMLElement[]>([]);
  const [text, setText] = useState<TextTarget | null>(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const imgPath = useRef<string | null>(null);

  const setOn = (v: boolean) => {
    sessionStorage.setItem("editMode", v ? "1" : "0");
    setOnState(v);
  };

  // collect the page sections
  useEffect(() => {
    if (!on) return setSections([]);
    const scan = () => setSections(Array.from(document.querySelectorAll<HTMLElement>(BLOCK_SELECTOR)));
    scan();
    const t = setInterval(scan, 1500);
    return () => clearInterval(t);
  }, [on, pathname]);

  const findKeys = useCallback(
    (value: string) => {
      const v = value.trim();
      if (!v) return [];
      return Object.keys(translations).filter((k) => k.startsWith(lang + ".") && String(translations[k]).trim() === v);
    },
    [translations, lang],
  );

  // click handling in edit mode
  useEffect(() => {
    if (!on) return;
    const onClick = async (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest("[data-edit-ui]")) return;
      if (!el.closest("main, nav, footer")) return;
      e.preventDefault();
      e.stopPropagation();

      if (el instanceof HTMLImageElement) {
        const src = new URL(el.src, location.origin).pathname;
        if (!src.startsWith("/content/")) return toast.error("Dieses Bild liegt nicht in public/content und kann hier nicht ersetzt werden.");
        imgPath.current = decodeURIComponent(src.replace(/^\/content\//, ""));
        fileRef.current?.click();
        return;
      }

      // walk up until an element's text matches a translation
      let node: HTMLElement | null = el;
      for (let i = 0; node && i < 4; i++, node = node.parentElement) {
        const keys = findKeys(node.innerText || "");
        if (keys.length) {
          const key = keys[0].slice(lang.length + 1);
          const values: Record<string, string> = {};
          for (const l of LANGUAGE_PACK) values[l] = translations[`${l}.${key}`] ?? "";
          setText({ key, values });
          return;
        }
      }
      toast.error("Kein bearbeitbarer Text gefunden. Klicke direkt auf eine Überschrift oder einen Absatz.");
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [on, findKeys, lang, translations]);

  const saveText = async () => {
    if (!text) return;
    setSaving(true);
    try {
      for (const l of LANGUAGE_PACK) {
        const file = `src/translations/${l}.json`;
        const d = JSON.parse(await readJsonFile(file));
        d[`${l}.${text.key}`] = text.values[l];
        await writeJsonFile(file, JSON.stringify(d, null, 2));
      }
      toast.success("Text gespeichert");
      setText(null);
      setTimeout(() => location.reload(), 400);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const onImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f || !imgPath.current) return;
    try {
      await uploadContent(imgPath.current, f);
      toast.success(`Foto ersetzt: ${imgPath.current}`);
      setTimeout(() => location.reload(), 400);
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const toggleBlock = async (index: number) => {
    const key = pageKey(pathname);
    const current = hiddenBlocks[key] || [];
    const next = current.includes(index) ? current.filter((n) => n !== index) : [...current, index].sort((a, b) => a - b);
    const hidden = { ...hiddenBlocks, [key]: next };
    if (!next.length) delete hidden[key];
    try {
      await writeJsonFile("src/config/blocks.json", JSON.stringify({ hidden }, null, 2));
      toast.success(next.includes(index) ? "Block ausgeblendet" : "Block wieder sichtbar");
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  if (!isAdmin()) return null;
  const hiddenHere = hiddenBlocks[pageKey(pathname)] || [];

  return (
    <div data-edit-ui>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onImage} />

      <button
        onClick={() => setOn(!on)}
        className={`fixed bottom-5 left-5 z-[100] flex items-center gap-2 rounded-full px-4 py-3 text-sm font-medium shadow-lg ${on ? "bg-destructive text-destructive-foreground" : "bg-primary text-primary-foreground"}`}
      >
        {on ? <X className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
        {on ? "Bearbeiten beenden" : "Seite bearbeiten"}
      </button>

      {on && (
        <div className="fixed top-24 left-1/2 z-[100] -translate-x-1/2 rounded-full bg-foreground/90 px-4 py-2 text-xs text-background shadow-lg">
          Klicke auf Text oder Foto zum Bearbeiten · Blöcke mit dem Auge ein-/ausblenden
        </div>
      )}

      {on &&
        sections.map((sec, i) => {
          const n = i + 1;
          const hidden = hiddenHere.includes(n);
          if (getComputedStyle(sec).position === "static") sec.style.position = "relative";
          const title = sec.querySelector("h1,h2,h3")?.textContent?.trim().slice(0, 40) || `Block ${n}`;
          return createPortal(
            <div data-edit-ui className="absolute right-3 top-3 z-[60] flex items-center gap-2 rounded-full bg-background/95 px-3 py-1.5 text-xs shadow-lg border border-border">
              <span className="max-w-[160px] truncate text-foreground">{n}. {title}</span>
              <button
                onClick={(e) => { e.stopPropagation(); toggleBlock(n); }}
                className={`flex items-center gap-1 rounded-full px-2 py-1 font-medium ${hidden ? "bg-destructive text-destructive-foreground" : "bg-primary text-primary-foreground"}`}
              >
                {hidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                {hidden ? "Ausgeblendet" : "Sichtbar"}
              </button>
            </div>,
            sec,
            `edit-${n}`,
          );
        })}

      <Dialog open={!!text} onOpenChange={(o) => !o && setText(null)}>
        <DialogContent data-edit-ui className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Text bearbeiten</DialogTitle>
          </DialogHeader>
          {text && (
            <div className="space-y-3">
              <code className="text-xs text-muted-foreground">{text.key}</code>
              {LANGUAGE_PACK.map((l) => (
                <label key={l} className="block space-y-1">
                  <span className="text-xs font-medium text-foreground">{l.toUpperCase()}</span>
                  <Textarea
                    value={text.values[l]}
                    onChange={(e) => setText({ ...text, values: { ...text.values, [l]: e.target.value } })}
                    rows={Math.min(8, Math.max(2, Math.ceil((text.values[l] || "").length / 70)))}
                  />
                </label>
              ))}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setText(null)}>Abbrechen</Button>
                <Button onClick={saveText} disabled={saving}>{saving ? "Speichern…" : "Speichern"}</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
