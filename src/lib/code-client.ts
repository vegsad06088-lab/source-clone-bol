/**
 * Client for the LOCAL-ONLY code editing API at /__code.
 * Lets the admin AI read, write, and undo source file changes.
 * Only available while running `npm run dev` and logged in.
 */
import { isLocal } from "@/components/admin/localApi";

async function json(res: Response) {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || res.statusText);
  return body;
}

export const readSourceFile = async (file: string): Promise<string> => {
  if (!isLocal) throw new Error("Code editing is only available locally");
  const res = await fetch(`/__code?file=${encodeURIComponent(file)}`);
  return (await json(res)).content;
};

export const writeSourceFile = async (file: string, content: string): Promise<{ ok: boolean; backup?: string }> => {
  if (!isLocal) throw new Error("Code editing is only available locally");
  const res = await fetch(`/__code?file=${encodeURIComponent(file)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
  return json(res);
};

export const undoSourceFile = async (file: string): Promise<{ ok: boolean; restored?: boolean }> => {
  if (!isLocal) throw new Error("Code editing is only available locally");
  const res = await fetch(`/__code?file=${encodeURIComponent(file)}`, { method: "DELETE" });
  return json(res);
};
