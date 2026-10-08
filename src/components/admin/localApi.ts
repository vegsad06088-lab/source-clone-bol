/**
 * Client for the LOCAL-ONLY editing API defined in vite.config.ts.
 * These endpoints exist only while running `npm run dev`; on the published site they don't exist.
 */
export const isLocal = import.meta.env.DEV;

async function json(res: Response) {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || res.statusText);
  return body;
}

export const readJsonFile = async (file: string): Promise<string> =>
  (await json(await fetch(`/__config?file=${encodeURIComponent(file)}`))).content;

export const writeJsonFile = async (file: string, content: string) =>
  json(await fetch(`/__config?file=${encodeURIComponent(file)}`, { method: "POST", body: content }));

/** path relative to public/content, e.g. "home/hero.avif" */
export const uploadContent = async (relPath: string, file: Blob) =>
  json(await fetch(`/__content?path=${encodeURIComponent(relPath)}`, { method: "POST", body: file }));

export const deleteContent = async (relPath: string) =>
  json(await fetch(`/__content?path=${encodeURIComponent(relPath)}`, { method: "DELETE" }));
