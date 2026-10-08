/**
 * Client for the LOCAL-ONLY AI proxy at /__ai.
 * The AI provider key stays on the server side (in .env) and never reaches the browser.
 * Only available while running `npm run dev`.
 */
import { isLocal } from "@/components/admin/localApi";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AIResult {
  text: string;
  provider?: string;
  model?: string;
}

export async function aiChat(
  messages: ChatMessage[],
  systemPrompt?: string,
  opts?: { model?: string; temperature?: number },
): Promise<AIResult> {
  if (!isLocal) throw new Error("AI is only available in local development mode");
  const res = await fetch("/__ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages,
      systemPrompt,
      model: opts?.model,
      temperature: opts?.temperature,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "AI request failed");
  return { text: data.text, provider: data.provider, model: data.model };
}

export async function aiPrompt(prompt: string, systemPrompt?: string): Promise<AIResult> {
  return aiChat([{ role: "user", content: prompt }], systemPrompt);
}
