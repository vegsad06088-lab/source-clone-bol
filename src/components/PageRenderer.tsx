/**
 * PageRenderer — the master component.
 * Takes a PageDef JSON and renders all visible blocks top-to-bottom.
 * Also handles the edit-mode visibility toggles.
 */
import { lazy, Suspense } from "react";
import BlockRenderer from "./BlockRenderer";
import type { PageDef } from "@/lib/content-types";
import { toggleBlockVisible } from "@/lib/content-loader";
import { useAuth } from "@/lib/auth/client";
import { Eye, EyeOff } from "lucide-react";

export default function PageRenderer({ page }: { page: PageDef }) {
  const { user } = useAuth();
  const isLocal = typeof window !== "undefined" && window.location.hostname === "localhost";

  const visibleBlocks = page.blocks.filter((b) => b.visible !== false);
  const hiddenBlocks = page.blocks.filter((b) => b.visible === false);

  const handleToggle = async (blockId: string) => {
    const updated = await toggleBlockVisible(page, blockId);
    if (updated) {
      // Force reload to reflect changes
      setTimeout(() => window.location.reload(), 300);
    }
  };

  return (
    <div>
      {visibleBlocks.map((block) => (
        <div key={block.id} className="relative group">
          {isLocal && user && (
            <button
              onClick={() => handleToggle(block.id)}
              className="absolute top-2 right-2 z-50 opacity-0 group-hover:opacity-100 transition-opacity bg-background/90 border border-border rounded-lg p-1.5 shadow-card"
              title={block.visible ? "Hide block" : "Show block"}
            >
              <EyeOff className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
          <BlockRenderer block={block} />
        </div>
      ))}

      {/* Show hidden blocks as toggle buttons in edit mode */}
      {isLocal && user && hiddenBlocks.length > 0 && (
        <div className="py-4 bg-muted/30 border-2 border-dashed border-border">
          <p className="text-center text-xs text-muted-foreground mb-3">Hidden blocks (click to show):</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {hiddenBlocks.map((block) => (
              <button
                key={block.id}
                onClick={() => handleToggle(block.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border rounded-lg bg-background hover:bg-card transition-smooth"
              >
                <Eye className="w-3 h-3" />
                {block.id} ({block.type})
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
