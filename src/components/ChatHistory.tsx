import { useEffect, useRef, useState } from "react";
import { History, MessageSquare, Plus, Trash2 } from "lucide-react";

export type ChatSummary = {
  id: string;
  title: string;
  updatedAt: number;
};

export function ChatHistory({
  chats,
  activeId,
  onOpen,
  onDelete,
  onNew,
}: {
  chats: ChatSummary[];
  activeId: string | null;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onNew}
        aria-label="Neuer Chat"
        title="Neuer Chat"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:opacity-90 crumb-shadow"
      >
        <Plus className="h-5 w-5" />
      </button>

      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label="Bisherige Chats"
          title="Bisherige Chats"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground transition hover:bg-secondary/70 crumb-shadow"
        >
          <History className="h-5 w-5" />
        </button>

        {open && (
          <div className="absolute right-0 top-12 z-40 w-72 overflow-hidden rounded-2xl border border-border bg-card crumb-shadow">
            <p className="border-b border-border px-4 py-2 text-xs font-bold text-muted-foreground">
              Deine Keks-Dosen
            </p>
            <div className="max-h-72 overflow-y-auto">
              {chats.length === 0 ? (
                <p className="px-4 py-4 text-sm text-muted-foreground">
                  Noch keine Chats – fang oben einfach an zu backen!
                </p>
              ) : (
                chats.map((c) => (
                  <div
                    key={c.id}
                    className={`group flex items-center gap-2 px-3 py-2 transition hover:bg-secondary ${
                      c.id === activeId ? "bg-secondary/70" : ""
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        onOpen(c.id);
                        setOpen(false);
                      }}
                      className="flex min-w-0 flex-1 items-center gap-2 text-left"
                    >
                      <MessageSquare className="h-4 w-4 shrink-0 text-primary" />
                      <span className="truncate text-sm">{c.title}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(c.id)}
                      aria-label="Chat löschen"
                      className="hidden shrink-0 rounded-full p-1 text-muted-foreground hover:text-destructive group-hover:block"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
