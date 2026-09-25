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
const SECRET_SHAPES = ["submarine", "bottle", "orange"] as const;
export type CookieShape = (typeof SHAPES)[number] | (typeof SECRET_SHAPES)[number];

// Welche Formen im Hintergrund schweben – Geheim-Designs bekommen eigene Motive
const FLAVOR_SHAPES: Record<string, readonly CookieShape[]> = {
  uboot: ["submarine"],
  fanta: ["bottle", "orange"],
  fantaexotik: ["orange", "bottle"],
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

export function pickShape(i: number): CookieShape {
  return SHAPES[(i * 7 + 3) % SHAPES.length] ?? "round";
}

export function CookieBackground() {
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
          <Cookie size={c.size} shape={pickShape(i)} />
        </span>
      ))}
    </div>
  );
}
