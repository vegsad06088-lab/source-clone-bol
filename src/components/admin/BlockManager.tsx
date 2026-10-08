import { useState, useEffect } from "react";
import { Eye, EyeOff, RefreshCw } from "lucide-react";
import { isLocal, readJsonFile, writeJsonFile } from "@/components/admin/localApi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { pageKey, hiddenBlocks } from "@/components/edit/blocks";

const PAGE_NAMES: Record<string, string> = {
  "/": "Home",
  "/about": "About",
  "/apartments": "Apartments",
  "/contact": "Contact",
  "/anleitungen": "Anleitungen",
  "/chat": "Chat",
  "/datenschutz": "Datenschutz",
  "/impressum": "Impressum",
  "/agb": "AGB",
  "/booking-conditions": "Booking Conditions",
  "/cookies": "Cookies",
};

export default function BlockManager() {
  const [hidden, setHidden] = useState<Record<string, number[]>>({});
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      if (isLocal) {
        const raw = await readJsonFile("config/blocks.json");
        const data = JSON.parse(raw);
        setHidden(data.hidden || {});
      }
    } catch {
      // file may not exist yet
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggle = async (page: string, blockNum: number) => {
    const current = hidden[page] || [];
    const next = current.includes(blockNum)
      ? current.filter((n) => n !== blockNum)
      : [...current, blockNum].sort((a, b) => a - b);
    const newHidden = { ...hidden };
    if (next.length) newHidden[page] = next;
    else delete newHidden[page];
    setHidden(newHidden);
    try {
      await writeJsonFile("config/blocks.json", JSON.stringify({ hidden: newHidden }, null, 2));
      toast.success(next.includes(blockNum) ? "Block ausgeblendet" : "Block wieder sichtbar");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const pages = Object.keys(PAGE_NAMES);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Block-Verwaltung</h2>
          <p className="text-sm text-muted-foreground">
            Blende Blöcke auf Seiten ein oder aus. Die Änderungen sind sofort für Besucher sichtbar.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Aktualisieren
        </Button>
      </div>

      <div className="space-y-4">
        {pages.map((page) => {
          const hiddenList = hidden[page] || [];
          return (
            <div key={page} className="rounded-lg border border-border p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-medium">
                  {PAGE_NAMES[page]} <code className="ml-2 text-xs text-muted-foreground">{page}</code>
                </h3>
                <span className="text-xs text-muted-foreground">
                  {hiddenList.length > 0 ? `${hiddenList.length} ausgeblendet` : "Alle sichtbar"}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 8 }, (_, i) => i + 1).map((n) => {
                  const isHidden = hiddenList.includes(n);
                  return (
                    <button
                      key={n}
                      onClick={() => toggle(page, n)}
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                        isHidden
                          ? "bg-destructive text-destructive-foreground"
                          : "bg-primary text-primary-foreground"
                      }`}
                    >
                      {isHidden ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      Block {n}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
