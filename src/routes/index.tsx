import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { ArrowUp, Cookie, Mic, Phone, PhoneOff, Square } from "lucide-react";
import { CookieBackground } from "@/components/CookieBackground";
import { FlavorSettings } from "@/components/FlavorSettings";
import { ChatHistory, type ChatSummary } from "@/components/ChatHistory";
import { ALL_FLAVORS, DEFAULT_FLAVOR, type FlavorId } from "@/lib/flavors";
import { DEFAULT_LANG, langName, type LangId } from "@/lib/languages";

type StoredChat = ChatSummary & { messages: Msg[] };

function loadChats(): StoredChat[] {
  try {
    return JSON.parse(localStorage.getItem("keks-chats") ?? "[]");
  } catch {
    return [];
  }
}

function saveChats(chats: StoredChat[]) {
  localStorage.setItem("keks-chats", JSON.stringify(chats.slice(0, 30)));
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Keks GPT – dein knuspriger KI-Assistent" },
      {
        name: "description",
        content:
          "Keks GPT ist ein KI-Chat im Keksdesign: plaudere per Text oder Sprache und wähle deine Kekssorte für Farben und Hintergrund.",
      },
      { property: "og:title", content: "Keks GPT – dein knuspriger KI-Assistent" },
      {
        property: "og:description",
        content: "KI-Chat im Keksdesign mit Sprachmodus und wählbaren Kekssorten.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Erklär mir Quantenphysik mit Keksen",
  "Schreib mir ein Rezept für Matcha-Cookies",
  "Hilf mir bei einer E-Mail an meinen Chef",
  "Erzähl mir einen Keks-Witz",
];

function Index() {
  const [flavor, setFlavor] = useState<FlavorId>(DEFAULT_FLAVOR);
  const [lang, setLang] = useState<LangId>(DEFAULT_LANG);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [speak, setSpeak] = useState(false);
  const [callMode, setCallMode] = useState(false);
  const [listening, setListening] = useState(false);
  const [chats, setChats] = useState<StoredChat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const callModeRef = useRef(false);

  const activeFlavor = (ALL_FLAVORS.find((f) => f.id === flavor) ?? ALL_FLAVORS[0]!);

  useEffect(() => {
    const saved = localStorage.getItem("keks-flavor") as FlavorId | null;
    if (saved) setFlavor(saved);
    setSpeak(localStorage.getItem("keks-speak") === "1");
    const savedLang = localStorage.getItem("keks-lang") as LangId | null;
    if (savedLang) setLang(savedLang);
    setChats(loadChats());
  }, []);

  useEffect(() => {
    if (messages.length === 0 || loading) return;
    setChats((prev) => {
      const firstUser = messages.find((m) => m.role === "user");
      const title = firstUser ? firstUser.content.slice(0, 40) : "Neuer Chat";
      const id = activeChatId ?? crypto.randomUUID();
      if (!activeChatId) setActiveChatId(id);
      const next: StoredChat[] = [
        { id, title, updatedAt: Date.now(), messages },
        ...prev.filter((c) => c.id !== id),
      ];
      saveChats(next);
      return next;
    });
  }, [messages, loading, activeChatId]);

  function newChat() {
    recognitionRef.current?.stop();
    window.speechSynthesis?.cancel();
    setCallMode(false);
    callModeRef.current = false;
    setListening(false);
    setMessages([]);
    setActiveChatId(null);
    setError(null);
    setInput("");
  }

  function openChat(id: string) {
    const chat = chats.find((c) => c.id === id);
    if (!chat) return;
    setMessages(chat.messages);
    setActiveChatId(id);
    setError(null);
  }

  function deleteChat(id: string) {
    const next = chats.filter((c) => c.id !== id);
    saveChats(next);
    setChats(next);
    if (activeChatId === id) newChat();
  }

  useEffect(() => {
    document.documentElement.setAttribute("data-flavor", flavor);
    localStorage.setItem("keks-flavor", flavor);
  }, [flavor]);

  useEffect(() => {
    localStorage.setItem("keks-lang", lang);
    document.documentElement.setAttribute("data-language", lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem("keks-speak", speak ? "1" : "0");
  }, [speak]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  function say(text: string) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/[*#`_>]/g, ""));
    u.lang = lang;
    u.onend = () => {
      if (callModeRef.current) startListening();
    };
    window.speechSynthesis.speak(u);
  }

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;
    setError(null);
    setInput("");
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages([...next, { role: "assistant", content: "" }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next,
          flavor: activeFlavor.name,
          language: langName(lang),
        }),
      });
      if (!res.ok || !res.body) {
        throw new Error(await res.text());
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages([...next, { role: "assistant", content: acc }]);
      }
      if (speak || callModeRef.current) say(acc);
    } catch (e) {
      setMessages(next);
      setError(e instanceof Error ? e.message : "Da ist der Keks zerbröselt.");
    } finally {
      setLoading(false);
    }
  }

  function startListening() {
    const SR =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setError("Spracherkennung wird von diesem Browser nicht unterstützt.");
      setCallMode(false);
      callModeRef.current = false;
      return;
    }
    const rec = new SR();
    rec.lang = lang;
    rec.interimResults = false;
    rec.onresult = (e: any) => {
      const t = e.results[0][0].transcript;
      setListening(false);
      send(t);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recognitionRef.current = rec;
    setListening(true);
    rec.start();
  }

  function toggleCall() {
    const on = !callMode;
    setCallMode(on);
    callModeRef.current = on;
    if (on) startListening();
    else {
      recognitionRef.current?.stop();
      window.speechSynthesis?.cancel();
      setListening(false);
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <CookieBackground flavor={flavor} />

      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent crumb-shadow">
              <Cookie className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-xl font-extrabold leading-none">Keks GPT</h1>
              <p className="text-xs text-muted-foreground">
                {activeFlavor.emoji} {activeFlavor.name} · {activeFlavor.tagline}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ChatHistory
              chats={chats}
              activeId={activeChatId}
              onOpen={openChat}
              onDelete={deleteChat}
              onNew={newChat}
            />
            <FlavorSettings
              flavor={flavor}
              onChange={setFlavor}
              voice={speak}
              onVoiceChange={setSpeak}
              lang={lang}
              onLangChange={setLang}
            />
          </div>
        </div>
      </header>

      <main ref={scrollRef} className="mx-auto w-full max-w-3xl flex-1 overflow-y-auto px-4 py-6">
        {messages.length === 0 ? (
          <div className="mt-10 text-center">
            <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-card crumb-shadow">
              <span className="text-5xl">{activeFlavor.emoji}</span>
            </div>
            <h2 className="font-display text-3xl font-extrabold">Frisch aus dem Ofen</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Frag mich alles – ich antworte mit einer Prise Keks.
            </p>
            <div className="mx-auto mt-6 grid max-w-xl gap-2 sm:grid-cols-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-2xl border border-border bg-card px-4 py-3 text-left text-sm transition hover:bg-secondary crumb-shadow"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "assistant" && (
                  <div className="mr-2 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent">
                    <Cookie className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div
                  className={`markdown max-w-[80%] rounded-3xl px-4 py-3 text-sm leading-relaxed crumb-shadow ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-card text-card-foreground"
                  }`}
                >
                  {m.content ? (
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  ) : (
                    <span className="flex gap-1">
                      {[0, 1, 2].map((d) => (
                        <span
                          key={d}
                          className="typing-dot inline-block h-2 w-2 rounded-full bg-primary"
                          style={{ animationDelay: `${d * 0.15}s` }}
                        />
                      ))}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <p className="mt-4 rounded-2xl border border-destructive/40 bg-card px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        )}
      </main>

      <footer className="sticky bottom-0 z-30 border-t border-border/60 bg-background/85 backdrop-blur-md">
        <div className="mx-auto w-full max-w-3xl px-4 py-3">
          {callMode && (
            <p className="mb-2 text-center text-xs font-bold text-primary">
              {listening ? "Ich höre zu …" : "Keks GPT spricht …"}
            </p>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-end gap-2 rounded-3xl border border-border bg-card p-2 crumb-shadow"
          >
            <button
              type="button"
              onClick={() => (listening ? recognitionRef.current?.stop() : startListening())}
              aria-label="Diktieren"
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition ${
                listening ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
              }`}
            >
              {listening ? <Square className="h-4 w-4" /> : <Mic className="h-5 w-5" />}
            </button>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              rows={1}
              placeholder="Schreib Keks GPT etwas …"
              className="max-h-40 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground"
            />
            <button
              type="button"
              onClick={toggleCall}
              aria-label="Telefonmodus"
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition ${
                callMode ? "bg-destructive text-destructive-foreground" : "bg-secondary"
              }`}
            >
              {callMode ? <PhoneOff className="h-5 w-5" /> : <Phone className="h-5 w-5" />}
            </button>
            <button
              type="submit"
              disabled={!input.trim() || loading}
              aria-label="Senden"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition disabled:opacity-40"
            >
              <ArrowUp className="h-5 w-5" />
            </button>
          </form>
          <p className="mt-2 text-center text-[11px] text-muted-foreground">
            Keks GPT kann sich auch mal verkrümeln – bitte wichtige Infos prüfen.
          </p>
        </div>
      </footer>
    </div>
  );
}
