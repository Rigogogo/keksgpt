import { Settings } from "lucide-react";
import { useState } from "react";
import { FLAVORS, type FlavorId } from "@/lib/flavors";

export function FlavorSettings({
  flavor,
  onChange,
  voice,
  onVoiceChange,
}: {
  flavor: FlavorId;
  onChange: (f: FlavorId) => void;
  voice: boolean;
  onVoiceChange: (v: boolean) => void;
}) {
  const [open, setOpen] = useState(false);

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
          <div className="absolute right-0 z-20 mt-3 w-72 rounded-3xl border border-border bg-popover p-4 text-popover-foreground crumb-shadow">
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
