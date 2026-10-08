import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { searchKnowledge } from "@/lib/chatEngine";
import { useI18n } from "@/lib/i18n";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

const welcomeMessages: Record<string, string> = {
  de: "Hallo! 👋 Ich bin der digitale Assistent von Apartments zur Quelle. Stelle mir eine Frage zu unseren Apartments, Check-In, Anfahrt oder allem was Du wissen möchtest!",
  en: "Hello! 👋 I'm the digital assistant of Apartments zur Quelle. Ask me about our apartments, check-in, directions or anything you'd like to know!",
  sq: "Përshëndetje! 👋 Unë jam asistenti dixhital i Apartments zur Quelle. Më pyesni për apartamentet, check-in, udhëzimet ose çdo gjë tjetër!",
};

export default function ChatPage() {
  const { t, lang } = useI18n();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: Date.now(),
      text: welcomeMessages[lang] || welcomeMessages["de"],
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: Message = { id: Date.now(), text: trimmed, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const answer = searchKnowledge(trimmed, lang);
      const botMsg: Message = { id: Date.now() + 1, text: answer, sender: "bot" };
      setMessages((prev) => [...prev, botMsg]);
    }, 400);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-serif font-bold text-foreground text-center mb-2">
          {t("inline.chat.t1")}
        </h1>
        <p className="text-center text-muted-foreground mb-8 text-sm">
          {t("inline.chat.t2")}
        </p>

        {/* Messages */}
        <div className="bg-card rounded-2xl shadow-card p-4 min-h-[400px] max-h-[60vh] overflow-y-auto mb-4">
          <div className="space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm whitespace-pre-line ${
                    msg.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-muted text-foreground rounded-bl-md"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="flex items-center gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={lang === "de" ? "Deine Frage eingeben..." : "Type your question..."}
            className="flex-1 px-5 py-3 text-sm rounded-full bg-card text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-card"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-11 h-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-smooth disabled:opacity-40 shadow-card"
            aria-label="Send"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
