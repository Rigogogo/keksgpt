import { Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { FLAVORS, SECRET_FLAVORS, type FlavorId } from "@/lib/flavors";
import { LANGUAGES, type LangId } from "@/lib/languages";

export function FlavorSettings({
  flavor,
  onChange,
  voice,
  onVoiceChange,
  lang,
  onLangChange,
}: {
  flavor: FlavorId;
  onChange: (f: FlavorId) => void;
  voice: boolean;
  onVoiceChange: (v: boolean) => void;
  lang: LangId;
  onLangChange: (l: LangId) => void;
}) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState<FlavorId[]>([]);

  useEffect(() => {
    try {
      setUnlocked(JSON.parse(localStorage.getItem("keks-unlocked") ?? "[]"));
    } catch {}
  }, []);

  function redeem() {
    const c = code.trim().toLowerCase().replace(/\s/g, "");
    const found = SECRET_FLAVORS.filter((f) => f.code.includes(c));
    if (!found.length) {
      setMsg("Ungültiger Code 🍪");
      return;
    }
    const next = Array.from(new Set([...unlocked, ...found.map((f) => f.id)]));
    setUnlocked(next);
    localStorage.setItem("keks-unlocked", JSON.stringify(next));
    onChange(found[0]!.id);
    setMsg(`Freigeschaltet: ${found.map((f) => f.name).join(" & ")} 🎉`);
    setCode("");
  }

  const secret = SECRET_FLAVORS.filter((f) => unlocked.includes(f.id));

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Einstellungen"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground crumb-shadow transition hover:rotate-45 hover:bg-secondary"
      >
        <Settings className="h-5 w-5" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-3 max-h-[70vh] w-72 overflow-y-auto rounded-3xl border border-border bg-popover p-4 text-popover-foreground crumb-shadow">
            <h2 className="font-display text-lg font-extrabold">Kekssorte</h2>
            <p className="mb-3 text-xs text-muted-foreground">
              Wählt Farben & Kekse im Hintergrund.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {FLAVORS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => onChange(f.id)}
                  className={`rounded-2xl border px-3 py-2 text-left text-sm transition ${
                    flavor === f.id
                      ? "border-primary bg-accent font-bold text-accent-foreground"
                      : "border-border bg-card hover:bg-secondary"
                  }`}
                >
                  <span className="mr-1">{f.emoji}</span>
                  {f.name}
                </button>
              ))}
            </div>

            {secret.length > 0 && (
              <>
                <h2 className="mt-5 font-display text-lg font-extrabold">Geheime Designs</h2>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {secret.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => onChange(f.id)}
                      className={`rounded-2xl border px-3 py-2 text-left text-sm transition ${
                        flavor === f.id
                          ? "border-primary bg-accent font-bold text-accent-foreground"
                          : "border-border bg-card hover:bg-secondary"
                      }`}
                    >
                      <span className="mr-1">{f.emoji}</span>
                      {f.name}
                    </button>
                  ))}
                </div>
              </>
            )}

            <h2 className="mt-5 font-display text-lg font-extrabold">Code eingeben</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                redeem();
              }}
              className="mt-2 flex gap-2"
            >
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Geheimcode …"
                className="min-w-0 flex-1 rounded-2xl border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="rounded-2xl bg-primary px-3 py-2 text-sm font-bold text-primary-foreground"
              >
                OK
              </button>
            </form>
            {msg && <p className="mt-2 text-xs text-muted-foreground">{msg}</p>}

            <h2 className="mt-5 font-display text-lg font-extrabold">Land & Sprache</h2>
            <p className="mb-3 text-xs text-muted-foreground">
              In welcher Sprache Keks GPT spricht, versteht und antwortet.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {LANGUAGES.map((l) => (
                <button
                  key={l.id}
                  onClick={() => onLangChange(l.id)}
                  className={`rounded-2xl border px-3 py-2 text-left text-sm transition ${
                    lang === l.id
                      ? "border-primary bg-accent font-bold text-accent-foreground"
                      : "border-border bg-card hover:bg-secondary"
                  }`}
                >
                  <span className="mr-1">{l.flag}</span>
                  {l.name}
                </button>
              ))}
            </div>

            <label className="mt-4 flex cursor-pointer items-center justify-between rounded-2xl border border-border bg-card px-3 py-2 text-sm">
              <span>Antworten vorlesen</span>
              <input
                type="checkbox"
                checked={voice}
                onChange={(e) => onVoiceChange(e.target.checked)}
                className="h-4 w-4 accent-[var(--primary)]"
              />
            </label>
          </div>
        </>
      )}
    </div>
  );
}
