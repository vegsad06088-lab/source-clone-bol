import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Sparkles, Code, FileText, Undo2, Check, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth/client";
import { isLocal } from "@/components/admin/localApi";
import { aiChat, type ChatMessage } from "@/lib/ai-client";
import { readSourceFile, writeSourceFile, undoSourceFile } from "@/lib/code-client";
import { LANGUAGE_PACK } from "@/lib/i18n";
import { readJsonFile, writeJsonFile } from "@/components/admin/localApi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Msg {
  id: number;
  role: "user" | "assistant";
  text: string;
  pending?: boolean;
  action?: PendingAction;
}

interface PendingAction {
  type: "write_file" | "write_json" | "write_translation";
  file: string;
  content: string;
  description: string;
  translations?: Record<string, string>;
  key?: string;
}

const SYSTEM_PROMPT = `You are an AI assistant for a website admin. You help the admin edit their website directly from the browser.

You can:
1. Edit text content and translations (German, English, Albanian)
2. Modify source code (React/TypeScript components, pages, styles)
3. Suggest photos and layout changes
4. Copy and adapt pages

Rules:
- Always explain what you plan to do BEFORE doing it
- Ask the admin questions when unclear (e.g. "Is this photo okay or should I suggest a new one?")
- When editing code, show a summary of what will change
- For text changes, always provide all 3 languages (de, en, sq)
- Be concise in your responses
- When you want to write a file, format your response as:
  <ACTION type="write_file" file="path/to/file.tsx">
  description of what changes
  </ACTION>
  <CONTENT>
  the full new file content
  </CONTENT>
- When you want to write a translation, format as:
  <ACTION type="write_translation" key="some.translation.key">
  description
  </ACTION>
  <TRANSLATIONS>
  {"de": "German text", "en": "English text", "sq": "Albanian text"}
  </TRANSLATIONS>
- For simple text edits that only update JSON translation files:
  <ACTION type="write_json" file="translations/de.json">
  description
  </ACTION>
  <CONTENT>
  full JSON content
  </CONTENT>`;

function parseAction(text: string): { action: PendingAction | null; cleanText: string } {
  const actionMatch = text.match(/<ACTION\s+type="([^"]+)"\s+file="([^"]+)"(?:\s+key="([^"]+)")?>([\s\S]*?)<\/ACTION>/);
  if (!actionMatch) return { action: null, cleanText: text };

  const [, type, file, key, descRaw] = actionMatch;
  const description = descRaw.trim();

  if (type === "write_translation") {
    const transMatch = text.match(/<TRANSLATIONS>([\s\S]*?)<\/TRANSLATIONS>/);
    if (transMatch) {
      try {
        const translations = JSON.parse(transMatch[1].trim());
        return {
          action: { type: "write_translation", file: "", content: "", description, translations, key: key || "" },
          cleanText: text.replace(/<ACTION[\s\S]*?<\/ACTION>/, "").replace(/<TRANSLATIONS>[\s\S]*?<\/TRANSLATIONS>/, "").trim(),
        };
      } catch {}
    }
  }

  const contentMatch = text.match(/<CONTENT>([\s\S]*?)<\/CONTENT>/);
  const content = contentMatch ? contentMatch[1] : "";
  return {
    action: { type: type as any, file, content, description, key: key || "" },
    cleanText: text.replace(/<ACTION[\s\S]*?<\/ACTION>/, "").replace(/<CONTENT>[\s\S]*?<\/CONTENT>/, "").trim(),
  };
}

export default function AdminAIChat() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          id: Date.now(),
          role: "assistant",
          text: "Hi! I'm your AI assistant. I can help you edit text, change code, translate content, or copy pages. What would you like to do?",
        },
      ]);
    }
  }, [open]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || busy) return;

    const userMsg: Msg = { id: Date.now(), role: "user", text: trimmed };
    setMessages((p) => [...p, userMsg]);
    setInput("");
    setBusy(true);

    const history: ChatMessage[] = [...messages, userMsg]
      .filter((m) => !m.pending && !m.action)
      .map((m) => ({ role: m.role, content: m.text }))
      .slice(-10);

    try {
      const result = await aiChat(history, SYSTEM_PROMPT, { temperature: 0.7 });
      const { action, cleanText } = parseAction(result.text);
      setMessages((p) => [
        ...p,
        { id: Date.now() + 1, role: "assistant", text: cleanText || result.text, action: action || undefined },
      ]);
    } catch (err: any) {
      setMessages((p) => [
        ...p,
        { id: Date.now() + 1, role: "assistant", text: `Error: ${err.message}. Make sure AI_PROVIDER_API_KEY is set in .env` },
      ]);
    } finally {
      setBusy(false);
    }
  }, [input, busy, messages]);

  const acceptAction = async (msg: Msg) => {
    if (!msg.action) return;
    setBusy(true);
    try {
      if (msg.action.type === "write_translation" && msg.action.translations && msg.action.key) {
        for (const lang of LANGUAGE_PACK) {
          const file = `translations/${lang}.json`;
          const d = JSON.parse(await readJsonFile(file));
          d[`${lang}.${msg.action.key}`] = msg.action.translations[lang] || "";
          await writeJsonFile(file, JSON.stringify(d, null, 2));
        }
        toast.success("Translations saved in all languages");
      } else if (msg.action.type === "write_json") {
        await writeJsonFile(msg.action.file, msg.action.content);
        toast.success(`Updated ${msg.action.file}`);
      } else if (msg.action.type === "write_file") {
        await writeSourceFile(msg.action.file, msg.action.content);
        toast.success(`Updated ${msg.action.file}`);
      }
      setMessages((p) => p.map((m) => (m.id === msg.id ? { ...m, action: undefined } : m)));
      setTimeout(() => location.reload(), 600);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  const rejectAction = (msg: Msg) => {
    setMessages((p) => p.map((m) => (m.id === msg.id ? { ...m, action: undefined } : m)));
  };

  const undoLast = async () => {
    const file = prompt("Which file to undo? (e.g. pages/AboutPage.tsx)");
    if (!file) return;
    try {
      await undoSourceFile(`src/${file}`);
      toast.success("Undone — restoring previous version");
      setTimeout(() => location.reload(), 600);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (!isLocal || !user) return null;

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-[100] flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-3 text-sm font-medium text-white shadow-lg hover:scale-105 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          AI Assistant
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 z-[100] flex w-[420px] max-w-[calc(100vw-2rem)] flex-col rounded-2xl border border-border bg-background shadow-2xl" style={{ height: "min(600px, calc(100vh - 6rem))" }}>
          {/* Header */}
          <div className="flex items-center justify-between rounded-t-2xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold text-sm">AI Command Center</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={undoLast} title="Undo last code change" className="rounded-full p-1.5 hover:bg-white/20">
                <Undo2 className="w-4 h-4" />
              </button>
              <button onClick={() => setOpen(false)} className="rounded-full p-1.5 hover:bg-white/20">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className="max-w-[85%]">
                  <div
                    className={`whitespace-pre-line rounded-2xl px-3 py-2 text-sm ${
                      msg.role === "user"
                        ? "rounded-br-md bg-blue-600 text-white"
                        : "rounded-bl-md bg-muted text-foreground"
                    }`}
                  >
                    {msg.text}
                    {msg.pending && <Loader2 className="ml-1 inline h-3 w-3 animate-spin" />}
                  </div>

                  {/* Action approval UI */}
                  {msg.action && (
                    <div className="mt-2 rounded-lg border border-blue-300 bg-blue-50 p-3 dark:border-blue-700 dark:bg-blue-950">
                      <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-blue-700 dark:text-blue-300">
                        {msg.action.type === "write_file" ? <Code className="h-3 w-3" /> : <FileText className="h-3 w-3" />}
                        Proposed change
                      </div>
                      <p className="mb-2 text-xs text-foreground">{msg.action.description}</p>
                      {msg.action.file && (
                        <code className="mb-2 block text-xs text-muted-foreground">{msg.action.file}</code>
                      )}
                      {msg.action.translations && (
                        <div className="mb-2 space-y-1 text-xs">
                          {Object.entries(msg.action.translations).map(([lang, val]) => (
                            <div key={lang} className="flex gap-2">
                              <span className="font-medium uppercase text-muted-foreground">{lang}</span>
                              <span className="flex-1 text-foreground">{val}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => acceptAction(msg)} disabled={busy} className="h-7 gap-1 text-xs">
                          <Check className="h-3 w-3" /> Apply
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => rejectAction(msg)} disabled={busy} className="h-7 text-xs">
                          Reject
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border p-3">
            <div className="flex items-end gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder="Ask AI to edit text, change code, translate..."
                className="min-h-[40px] flex-1 resize-none text-sm"
                rows={1}
              />
              <button
                onClick={send}
                disabled={!input.trim() || busy}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
