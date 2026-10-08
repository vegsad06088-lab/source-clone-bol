/**
 * Runtime content loader: fetches page JSONs from /__pages/ (dev) or /__pages/ (build copy).
 * Lazy-loaded per page route.
 */
import { useState, useEffect, useCallback } from "react";
import type { PageDef, PagesIndex, NewsItem } from "./content-types";

async function fetchManifest(): Promise<PagesIndex | null> {
  try {
    const res = await fetch("/__pages/");
    if (!res.ok) return null;
    const data = await res.json();
    return data.manifest as PagesIndex;
  } catch {
    return null;
  }
}

async function fetchPage(file: string): Promise<PageDef | null> {
  try {
    const res = await fetch(`/__pages/?file=${encodeURIComponent(file)}`);
    if (!res.ok) return null;
    return (await res.json()) as PageDef;
  } catch {
    return null;
  }
}

async function fetchNewsItem(id: string): Promise<NewsItem | null> {
  try {
    const res = await fetch(`/__pages/?file=${encodeURIComponent(`news/${id}.json`)}`);
    if (!res.ok) return null;
    return (await res.json()) as NewsItem;
  } catch {
    return null;
  }
}

/** Load the page manifest (list of all pages, news, apartments, guides). */
export function usePagesManifest() {
  const [manifest, setManifest] = useState<PagesIndex | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchManifest().then((m) => {
      if (!cancelled) {
        setManifest(m);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  return { manifest, loading };
}

/** Lazy-load a single page definition by route id. */
export function usePage(pageId: string | undefined) {
  const [page, setPage] = useState<PageDef | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pageId) {
      setPage(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchPage(`${pageId}.json`).then((p) => {
      if (cancelled) return;
      setPage(p);
      setLoading(false);
      if (!p) setError("Page not found");
    });
    return () => { cancelled = true; };
  }, [pageId]);

  return { page, loading, error };
}

/** Lazy-load a news item by id. */
export function useNewsItem(id: string | undefined) {
  const [item, setItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) {
      setItem(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetchNewsItem(id).then((n) => {
      if (!cancelled) {
        setItem(n);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [id]);

  return { item, loading };
}

/** Load all visible news items sorted by date descending. */
export function useNewsList() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const manifest = await fetchManifest();
      if (!manifest || cancelled) return;
      const visible = manifest.news.filter((n) => n.visible);
      const loaded = await Promise.all(visible.map((n) => fetchNewsItem(n.id)));
      const valid = loaded.filter((n): n is NewsItem => n !== null);
      valid.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
      if (!cancelled) {
        setItems(valid);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return { items, loading };
}

/** Save a page JSON (admin only — dev server only). */
export async function savePage(file: string, data: PageDef): Promise<boolean> {
  try {
    const res = await fetch(`/__pages/?file=${encodeURIComponent(file)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** Toggle the visible flag on a block within a page and save. */
export async function toggleBlockVisible(page: PageDef, blockId: string): Promise<PageDef | null> {
  const updated: PageDef = {
    ...page,
    lastChanged: new Date().toISOString(),
    blocks: page.blocks.map((b) => (b.id === blockId ? { ...b, visible: !b.visible } : b)),
  };
  const ok = await savePage(`${page.id}.json`, updated);
  return ok ? updated : null;
}
