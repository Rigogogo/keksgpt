const SHAPES = ["round", "star", "square", "heart", "ring", "bone"] as const;
export type CookieShape = (typeof SHAPES)[number];

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

export function Cookie({ size, shape }: { size: number; shape?: CookieShape }) {
  const s = shape ?? "round";
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
            <circle cx={cx} cy={cy} r="7.5" fill="var(--dough-hole, var(--bg))" />
          </g>
        );
      case "bone":
        return <g fill="var(--dough)"><Bone cx={cx} cy={cy} r={16} /></g>;
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

  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      {body}
      {outline}
      {dots.map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill={i % 2 === 0 ? "var(--cookie-dot-a, var(--crumb))" : "var(--cookie-dot-b, var(--crumb))"} />
      ))}
    </svg>
  );
}

export { SHAPES };

export function pickShape(i: number): CookieShape {
  return SHAPES[(i * 7 + 3) % SHAPES.length];
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
