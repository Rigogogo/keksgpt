const COOKIES = Array.from({ length: 18 }, (_, i) => {
  const seed = (i * 137.508) % 100;
  return {
    left: (seed * 0.93 + (i % 5) * 3) % 96,
    top: ((i * 53) % 92) + 2,
    size: 22 + ((i * 17) % 42),
    dur: 7 + ((i * 3) % 9),
    delay: (i % 7) * 0.7,
    from: -12 + ((i * 11) % 24),
    opacity: 0.14 + ((i % 4) * 0.07),
  };
});

const SHAPES = ["round", "star", "square", "heart", "ring", "bone"] as const;
const SECRET_SHAPES = ["submarine", "bottle", "orange", "can", "doner", "skewer", "castle", "shield", "strawhat", "skull", "colabottle", "glass", "creeper", "pickaxe", "burger", "fries", "arches", "locomotive", "steamcloud"] as const;
export type CookieShape = (typeof SHAPES)[number] | (typeof SECRET_SHAPES)[number];

// Welche Formen im Hintergrund schweben – Geheim-Designs bekommen eigene Motive
const FLAVOR_SHAPES: Record<string, readonly CookieShape[]> = {
  uboot: ["submarine"],
  fanta: ["bottle", "can"],
  fantaexotik: ["can", "bottle"],
  doener: ["doner", "skewer"],
  mittelalter: ["castle", "shield"],
  onepiece: ["strawhat", "skull"],
  cola: ["colabottle", "glass"],
  colavanilla: ["glass", "colabottle"],
  colacherry: ["glass", "colabottle"],
  minecraft: ["creeper", "pickaxe"],
  mcdonalds: ["burger", "fries", "arches"],
  steam: ["locomotive", "steamcloud"],
};

function Star({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  // 5-point star path
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? r : r * 0.45;
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    pts.push(`${(cx + rad * Math.cos(angle)).toFixed(2)},${(cy + rad * Math.sin(angle)).toFixed(2)}`);
  }
  return <polygon points={pts.join(" ")} />;
}

function Heart({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const d = [
    `M ${cx} ${cy + r * 0.85}`,
    `C ${cx - r * 1.6} ${cy - r * 0.1} ${cx - r * 0.55} ${cy - r * 1.25} ${cx} ${cy - r * 0.35}`,
    `C ${cx + r * 0.55} ${cy - r * 1.25} ${cx + r * 1.6} ${cy - r * 0.1} ${cx} ${cy + r * 0.85}`,
  ].join(" ");
  return <path d={d} />;
}

function Bone({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  // horizontal bone: rounded bar with four knobs
  return (
    <g>
      <rect x={cx - r * 0.62} y={cy - r * 0.22} width={r * 1.24} height={r * 0.44} rx={r * 0.22} />
      <circle cx={cx - r * 0.62} cy={cy - r * 0.3} r={r * 0.3} />
      <circle cx={cx - r * 0.62} cy={cy + r * 0.3} r={r * 0.3} />
      <circle cx={cx + r * 0.62} cy={cy - r * 0.3} r={r * 0.3} />
      <circle cx={cx + r * 0.62} cy={cy + r * 0.3} r={r * 0.3} />
    </g>
  );
}

function Submarine({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  // kleines U-Boot: Rumpf, Turm, Periskop, Heckflosse, Bullaugen
  return (
    <g>
      <ellipse cx={cx} cy={cy + 2} rx={r} ry={r * 0.45} fill="var(--dough)" />
      <rect x={cx - r * 0.25} y={cy - r * 0.55} width={r * 0.5} height={r * 0.55} rx={r * 0.12} fill="var(--dough)" />
      <rect x={cx - r * 0.06} y={cy - r * 0.95} width={r * 0.12} height={r * 0.45} fill="var(--dough)" />
      <rect x={cx - r * 0.06} y={cy - r * 0.95} width={r * 0.4} height={r * 0.14} rx={r * 0.07} fill="var(--dough)" />
      <polygon
        points={`${cx + r},${cy + 2} ${cx + r * 1.35},${cy - r * 0.25} ${cx + r * 1.35},${cy + 2 + r * 0.25}`}
        fill="var(--dough)"
      />
      <circle cx={cx - r * 0.45} cy={cy + 2} r={r * 0.14} fill="var(--cookie-dot-a, var(--crumb))" />
      <circle cx={cx - r * 0.05} cy={cy + 2} r={r * 0.14} fill="var(--cookie-dot-a, var(--crumb))" />
      <circle cx={cx + r * 0.35} cy={cy + 2} r={r * 0.14} fill="var(--cookie-dot-a, var(--crumb))" />
    </g>
  );
}

function Bottle({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  // kleine Flasche mit Verschluss und Label
  return (
    <g>
      <rect x={cx - r * 0.14} y={cy - r} width={r * 0.28} height={r * 0.22} rx={r * 0.05} fill="var(--dough)" />
      <path
        d={`M ${cx - r * 0.16} ${cy - r * 0.78} L ${cx - r * 0.38} ${cy - r * 0.3} L ${cx - r * 0.38} ${cy + r * 0.85} Q ${cx - r * 0.38} ${cy + r} ${cx - r * 0.2} ${cy + r} L ${cx + r * 0.2} ${cy + r} Q ${cx + r * 0.38} ${cy + r} ${cx + r * 0.38} ${cy + r * 0.85} L ${cx + r * 0.38} ${cy - r * 0.3} L ${cx + r * 0.16} ${cy - r * 0.78} Z`}
        fill="var(--dough)"
      />
      <rect x={cx - r * 0.38} y={cy - r * 0.05} width={r * 0.76} height={r * 0.45} fill="var(--cookie-dot-a, var(--crumb))" />
    </g>
  );
}

function Orange({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  // Orange mit Blatt und Stiel
  return (
    <g>
      <circle cx={cx} cy={cy + r * 0.15} r={r * 0.8} fill="var(--dough)" />
      <rect x={cx - r * 0.06} y={cy - r * 0.95} width={r * 0.12} height={r * 0.35} rx={r * 0.06} fill="var(--cookie-dot-b, var(--crumb))" />
      <ellipse cx={cx + r * 0.35} cy={cy - r * 0.75} rx={r * 0.35} ry={r * 0.18} transform={`rotate(-25 ${cx + r * 0.35} ${cy - r * 0.75})`} fill="var(--cookie-dot-b, var(--crumb))" />
    </g>
  );
}

function Can({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  // kleine Fanta-Dose: Deckel, Lasche, Label-Band, Glanzkante
  return (
    <g>
      {/* Dosenkörper */}
      <rect x={cx - r * 0.55} y={cy - r * 0.62} width={r * 1.1} height={r * 1.5} rx={r * 0.22} fill="var(--dough)" />
      {/* Deckel-Ellipse */}
      <ellipse cx={cx} cy={cy - r * 0.62} rx={r * 0.55} ry={r * 0.18} fill="var(--dough)" />
      {/* Deckelrand */}
      <ellipse cx={cx} cy={cy - r * 0.62} rx={r * 0.55} ry={r * 0.18} fill="none" stroke="var(--cookie-dot-a, var(--crumb))" strokeWidth={r * 0.06} />
      {/* Lasche (Ringpull) */}
      <ellipse cx={cx} cy={cy - r * 0.68} rx={r * 0.14} ry={r * 0.07} fill="none" stroke="var(--cookie-dot-b, var(--crumb))" strokeWidth={r * 0.07} />
      {/* Label-Band mit Fanta-Schriftzugeffekt (zwei Punkte als "Wellen") */}
      <rect x={cx - r * 0.55} y={cy - r * 0.18} width={r * 1.1} height={r * 0.62} fill="var(--cookie-dot-a, var(--crumb))" />
      <circle cx={cx - r * 0.18} cy={cy + r * 0.13} r={r * 0.1} fill="var(--dough)" />
      <circle cx={cx + r * 0.18} cy={cy + r * 0.13} r={r * 0.1} fill="var(--dough)" />
      {/* Glanzkante links */}
      <rect x={cx - r * 0.45} y={cy - r * 0.45} width={r * 0.08} height={r * 1.2} rx={r * 0.04} fill="var(--cookie-dot-b, var(--crumb))" opacity="0.5" />
      {/* Boden-Schattenlinie */}
      <rect x={cx - r * 0.55} y={cy + r * 0.7} width={r * 1.1} height={r * 0.16} rx={r * 0.08} fill="var(--cookie-dot-a, var(--crumb))" opacity="0.55" />
    </g>
  );
}

function Doner() {
  return (
    <g>
      <path d="M 4 16 Q 20 3 36 16 L 29 36 Q 20 39 11 36 Z" fill="var(--dough)" stroke="var(--crumb)" strokeWidth="1.5" />
      <path d="M 7 16 Q 20 9 33 16 L 30 21 Q 20 15 10 21 Z" fill="var(--cookie-dot-a, var(--crumb))" />
      <path d="M 10 18 Q 17 21 20 18 T 30 18" fill="none" stroke="var(--cookie-dot-b, var(--crumb))" strokeWidth="3" />
      <path d="M 14 24 Q 20 21 26 24 M 16 29 Q 20 27 24 29" fill="none" stroke="var(--crumb)" strokeWidth="1.5" />
    </g>
  );
}

function Skewer() {
  return (
    <g>
      <path d="M 20 3 V 38" stroke="var(--crumb)" strokeWidth="2" />
      <path d="M 12 10 Q 20 5 28 10 L 30 24 Q 27 30 20 32 Q 13 30 10 24 Z" fill="var(--dough)" stroke="var(--crumb)" strokeWidth="1.5" />
      <path d="M 11 16 Q 20 20 29 16 M 11 23 Q 20 27 29 22" fill="none" stroke="var(--cookie-dot-a, var(--crumb))" strokeWidth="3" />
      <path d="M 11 33 H 29" stroke="var(--crumb)" strokeWidth="2" />
    </g>
  );
}

function Castle() {
  return (
    <g fill="var(--dough)" stroke="var(--crumb)" strokeWidth="1.5" strokeLinejoin="round">
      <path d="M 5 33 V 12 H 9 V 9 H 13 V 12 H 16 V 17 H 24 V 12 H 27 V 9 H 31 V 12 H 35 V 33 Z" />
      <path d="M 15 33 V 27 A 5 5 0 0 1 25 27 V 33" fill="var(--cookie-dot-a, var(--crumb))" />
      <path d="M 8 19 H 11 M 29 19 H 32 M 19 21 H 21" stroke="var(--cookie-dot-b, var(--crumb))" />
    </g>
  );
}

function Shield() {
  return (
    <g>
      <path d="M 20 4 L 34 9 V 20 Q 33 30 20 37 Q 7 30 6 20 V 9 Z" fill="var(--dough)" stroke="var(--crumb)" strokeWidth="1.5" />
      <path d="M 20 7 V 34 M 9 18 H 31" stroke="var(--cookie-dot-a, var(--crumb))" strokeWidth="3" />
      <circle cx="20" cy="18" r="3" fill="var(--cookie-dot-b, var(--crumb))" />
    </g>
  );
}

function StrawHat() {
  // Strohhut: runde Krempe, gewölbte Krone, rotes Band
  return (
    <g>
      <ellipse cx="20" cy="24" rx="16" ry="5.5" fill="var(--dough)" stroke="var(--crumb)" strokeWidth="1.5" />
      <path d="M 9 23 Q 9 8 20 8 Q 31 8 31 23 Z" fill="var(--dough)" stroke="var(--crumb)" strokeWidth="1.5" />
      <path d="M 9.5 20 Q 20 24.5 30.5 20 L 30.5 23.5 Q 20 28 9.5 23.5 Z" fill="var(--cookie-dot-a, var(--crumb))" />
      <path d="M 14 10 Q 13 15 13.5 19 M 26 10 Q 27 15 26.5 19" fill="none" stroke="var(--cookie-dot-b, var(--crumb))" strokeWidth="1.2" />
    </g>
  );
}

function Skull() {
  // kleiner Totenkopf (Piratenflagge) mit gekreuzten Knochen
  return (
    <g>
      <path d="M 8 30 L 14 33 M 32 30 L 26 33 M 8 34 L 32 30 M 8 30 L 32 34" stroke="var(--crumb)" strokeWidth="2" strokeLinecap="round" />
      <path d="M 20 5 Q 30 5 30 15 Q 30 21 26 23 L 26 27 L 14 27 L 14 23 Q 10 21 10 15 Q 10 5 20 5 Z" fill="var(--dough)" stroke="var(--crumb)" strokeWidth="1.5" />
      <circle cx="15.5" cy="14" r="2.6" fill="var(--cookie-dot-a, var(--crumb))" />
      <circle cx="24.5" cy="14" r="2.6" fill="var(--cookie-dot-a, var(--crumb))" />
      <path d="M 20 17 L 18.5 21 L 21.5 21 Z" fill="var(--cookie-dot-a, var(--crumb))" />
      <path d="M 16 27 V 24.5 M 20 27 V 24.5 M 24 27 V 24.5" stroke="var(--crumb)" strokeWidth="1.2" />
    </g>
  );
}

function ColaBottle() {
  // Cola-Glasflasche mit Wellen-Silhouette und Label
  return (
    <g>
      <rect x="17.5" y="3" width="5" height="3" rx="1" fill="var(--cookie-dot-a, var(--crumb))" />
      <path
        d="M 17 6 L 17 10 Q 14 12 14 16 Q 14 19 16 21 Q 14.5 24 14.5 28 Q 14.5 34 20 34 Q 25.5 34 25.5 28 Q 25.5 24 24 21 Q 26 19 26 16 Q 26 12 23 10 L 23 6 Z"
        fill="var(--dough)" stroke="var(--crumb)" strokeWidth="1.5"
      />
      <rect x="14.8" y="16" width="10.4" height="5.5" fill="var(--cookie-dot-a, var(--crumb))" />
      <path d="M 15.5 18.7 Q 20 16.5 24.5 18.7" fill="none" stroke="var(--dough)" strokeWidth="1.3" />
    </g>
  );
}

function Glass() {
  // Glas mit Cola, Eiswürfeln und Strohhalm
  return (
    <g>
      <path d="M 11 8 L 13.5 33 Q 13.7 35 16 35 L 24 35 Q 26.3 35 26.5 33 L 29 8 Z" fill="var(--dough)" stroke="var(--crumb)" strokeWidth="1.5" />
      <path d="M 12.2 14 L 27.8 14 L 26.2 33.4 L 13.8 33.4 Z" fill="var(--cookie-dot-a, var(--crumb))" />
      <rect x="16" y="17" width="4.5" height="4.5" rx="0.8" transform="rotate(12 18.2 19.2)" fill="var(--dough)" opacity="0.85" />
      <rect x="21" y="23" width="4.5" height="4.5" rx="0.8" transform="rotate(-15 23.2 25.2)" fill="var(--dough)" opacity="0.85" />
      <path d="M 24 4 L 21.5 14" stroke="var(--cookie-dot-b, var(--crumb))" strokeWidth="2.2" strokeLinecap="round" />
    </g>
  );
}

function Creeper() {
  // Creeper-Gesicht: grüner Block mit Pixel-Gesicht
  return (
    <g>
      <rect x="8" y="8" width="24" height="24" rx="2" fill="var(--dough)" stroke="var(--crumb)" strokeWidth="1.5" />
      <rect x="12" y="13" width="5" height="5" fill="var(--cookie-dot-a, var(--crumb))" />
      <rect x="23" y="13" width="5" height="5" fill="var(--cookie-dot-a, var(--crumb))" />
      <rect x="17.5" y="18" width="5" height="4" fill="var(--cookie-dot-a, var(--crumb))" />
      <rect x="14.5" y="22" width="3" height="6" fill="var(--cookie-dot-a, var(--crumb))" />
      <rect x="22.5" y="22" width="3" height="6" fill="var(--cookie-dot-a, var(--crumb))" />
      <rect x="17.5" y="22" width="5" height="3" fill="var(--cookie-dot-a, var(--crumb))" />
    </g>
  );
}

function Pickaxe() {
  // Spitzhacke im Pixel-Look
  return (
    <g>
      <path d="M 6 14 Q 20 4 34 14 L 31 18 Q 20 10 9 18 Z" fill="var(--cookie-dot-a, var(--crumb))" stroke="var(--crumb)" strokeWidth="1.2" />
      <rect x="18" y="12" width="4" height="22" rx="1" fill="var(--dough)" stroke="var(--crumb)" strokeWidth="1.2" />
    </g>
  );
}

function Burger() {
  // Burger von der Seite: Brötchen oben mit Sesam, Welle, Patty, Brötchen unten
  return (
    <g>
      <path d="M 6 21 Q 6 8 20 8 Q 34 8 34 21 Z" fill="var(--dough)" stroke="var(--crumb)" strokeWidth="1.5" />
      <ellipse cx="15" cy="13" rx="1.6" ry="1" transform="rotate(-15 15 13)" fill="var(--cookie-dot-b, var(--crumb))" />
      <ellipse cx="21" cy="12" rx="1.6" ry="1" transform="rotate(10 21 12)" fill="var(--cookie-dot-b, var(--crumb))" />
      <ellipse cx="26" cy="15" rx="1.6" ry="1" transform="rotate(-10 26 15)" fill="var(--cookie-dot-b, var(--crumb))" />
      <path d="M 6.5 22.5 L 12 24.5 L 16 22.5 L 20 24.5 L 24 22.5 L 28 24.5 L 33.5 22.5" fill="none" stroke="var(--cookie-dot-a, var(--crumb))" strokeWidth="2.4" strokeLinecap="round" />
      <rect x="7" y="26" width="26" height="5" rx="2.5" fill="var(--cookie-dot-a, var(--crumb))" />
      <path d="M 6 31 L 34 31 Q 34 35.5 28 35.5 L 12 35.5 Q 6 35.5 6 31 Z" fill="var(--dough)" stroke="var(--crumb)" strokeWidth="1.5" />
    </g>
  );
}

function Fries() {
  // Pommes: roter Karton mit gelben Stäbchen
  return (
    <g>
      <rect x="11" y="9" width="4.2" height="14" rx="1" fill="var(--dough)" stroke="var(--crumb)" strokeWidth="1" />
      <rect x="17.9" y="7" width="4.2" height="16" rx="1" fill="var(--dough)" stroke="var(--crumb)" strokeWidth="1" />
      <rect x="24.8" y="9" width="4.2" height="14" rx="1" fill="var(--dough)" stroke="var(--crumb)" strokeWidth="1" />
      <path d="M 8.5 17 L 31.5 17 L 28.8 35 L 11.2 35 Z" fill="var(--cookie-dot-a, var(--crumb))" stroke="var(--crumb)" strokeWidth="1.2" />
      <path d="M 15.5 32 L 15.5 23.5 L 20 28.5 L 24.5 23.5 L 24.5 32" fill="none" stroke="var(--dough)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </g>
  );
}

function Arches() {
  // Goldene Bögen (M) als Doppelschwung
  const d = "M 8 32 C 8 12 16 10 20 20 C 24 10 32 12 32 32";
  return (
    <g>
      <path d={d} fill="none" stroke="var(--crumb)" strokeWidth="9.5" strokeLinecap="round" />
      <path d={d} fill="none" stroke="var(--dough)" strokeWidth="7" strokeLinecap="round" />
    </g>
  );
}

function Locomotive() {
  // Dampflokomotive von der Seite: Kessel, Führerstand, Schornstein, Räder
  return (
    <g>
      <rect x="6" y="16" width="18" height="10" rx="4.5" fill="var(--dough)" stroke="var(--crumb)" strokeWidth="1.2" />
      <path d="M 24 26 L 24 10 L 34 10 L 34 26 Z" fill="var(--dough)" stroke="var(--crumb)" strokeWidth="1.2" />
      <rect x="27" y="13" width="4.5" height="4.5" fill="var(--cookie-dot-a, var(--crumb))" />
      <path d="M 10 16 L 10 12.5 L 14 12.5 L 14 16 Z" fill="var(--cookie-dot-a, var(--crumb))" />
      <path d="M 9 12.5 L 15 12.5 L 13.5 10 L 10.5 10 Z" fill="var(--dough)" stroke="var(--crumb)" strokeWidth="1" />
      <circle cx="12" cy="28" r="4" fill="var(--cookie-dot-b, var(--crumb))" stroke="var(--crumb)" strokeWidth="1.2" />
      <circle cx="21" cy="28" r="4" fill="var(--cookie-dot-b, var(--crumb))" stroke="var(--crumb)" strokeWidth="1.2" />
      <circle cx="30.5" cy="28" r="3.4" fill="var(--cookie-dot-b, var(--crumb))" stroke="var(--crumb)" strokeWidth="1.2" />
      <rect x="5" y="25.5" width="30" height="2.5" rx="1.2" fill="var(--cookie-dot-a, var(--crumb))" />
      <circle cx="17" cy="6.5" r="2.6" fill="var(--dough)" opacity="0.75" />
    </g>
  );
}

function SteamCloud() {
  // Dampfcloud mit weichen Bögen
  return (
    <g>
      <path d="M 8 28 A 6 6 0 0 1 9 16 A 8 8 0 0 1 24 12 A 7 7 0 0 1 33 20 A 5 5 0 0 1 31 28 Z" fill="var(--dough)" stroke="var(--crumb)" strokeWidth="1.5" />
      <circle cx="16" cy="21" r="1.6" fill="var(--cookie-dot-a, var(--crumb))" opacity="0.45" />
      <circle cx="25" cy="20" r="1.3" fill="var(--cookie-dot-a, var(--crumb))" opacity="0.45" />
    </g>
  );
}

export function Cookie({ size, shape = "round" }: { size: number; shape?: CookieShape }) {
  const s = shape;
  const cx = 20;
  const cy = 20;

  const outline =
    s === "round" ? (
      <circle cx={cx} cy={cy} r="18" fill="none" stroke="var(--crumb)" strokeOpacity="0.35" />
    ) : null;

  const body = (() => {
    switch (s) {
      case "star":
        return (
          <g fill="var(--dough)">
            <Star cx={cx} cy={cy} r={18.5} />
          </g>
        );
      case "square":
        return <rect x="4" y="4" width="32" height="32" rx="7" fill="var(--dough)" />;
      case "heart":
        return <g fill="var(--dough)"><Heart cx={cx} cy={cy} r={18} /></g>;
      case "ring":
        // donut: outer circle with hole
        return (
          <g>
            <circle cx={cx} cy={cy} r="18" fill="var(--dough)" />
            <circle cx={cx} cy={cy} r="7.5" fill="var(--dough-hole, var(--color-background))" />
          </g>
        );
      case "bone":
        return <g fill="var(--dough)"><Bone cx={cx} cy={cy} r={16} /></g>;
      case "submarine":
        return <Submarine cx={cx} cy={cy} r={14} />;
      case "bottle":
        return <Bottle cx={cx} cy={cy} r={14} />;
      case "orange":
        return <Orange cx={cx} cy={cy} r={16} />;
      case "can":
        return <Can cx={cx} cy={cy} r={14} />;
      case "doner":
        return <Doner />;
      case "skewer":
        return <Skewer />;
      case "castle":
        return <Castle />;
      case "shield":
        return <Shield />;
      case "strawhat":
        return <StrawHat />;
      case "skull":
        return <Skull />;
      case "colabottle":
        return <ColaBottle />;
      case "glass":
        return <Glass />;
      case "creeper":
        return <Creeper />;
      case "pickaxe":
        return <Pickaxe />;
      case "burger":
        return <Burger />;
      case "fries":
        return <Fries />;
      case "arches":
        return <Arches />;
      case "locomotive":
        return <Locomotive />;
      case "steamcloud":
        return <SteamCloud />;
      default:
        return <circle cx={cx} cy={cy} r="18" fill="var(--dough)" />;
    }
  })();

  const dots: Array<[number, number, number]> = [
    [14, 14, 3],
    [26, 17, 2.4],
    [19, 26, 2.8],
    [28, 27, 1.8],
    [10, 24, 1.6],
  ];

  const isSecret = (SECRET_SHAPES as readonly string[]).includes(s);

  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      {body}
      {outline}
      {!isSecret &&
        dots.map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill={i % 2 === 0 ? "var(--cookie-dot-a, var(--crumb))" : "var(--cookie-dot-b, var(--crumb))"} />
        ))}
    </svg>
  );
}

export { SHAPES };

export function pickShape(i: number, flavor?: string): CookieShape {
  const set = (flavor && FLAVOR_SHAPES[flavor]) || SHAPES;
  return set[(i * 7 + 3) % set.length] ?? "round";
}

export function CookieBackground({ flavor }: { flavor?: string }) {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {COOKIES.map((c, i) => (
        <span
          key={i}
          className="cookie-float absolute"
          style={
            {
              left: `${c.left}%`,
              top: `${c.top}%`,
              opacity: c.opacity,
              animationDelay: `${c.delay}s`,
              "--dur": `${c.dur}s`,
              "--spin-from": `${c.from}deg`,
              "--spin-to": `${c.from + 22}deg`,
            } as React.CSSProperties
          }
        >
          <Cookie size={c.size} shape={pickShape(i, flavor)} />
        </span>
      ))}
    </div>
  );
}
