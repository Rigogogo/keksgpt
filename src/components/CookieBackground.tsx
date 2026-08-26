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

function Cookie({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="20" r="18" fill="var(--dough)" />
      <circle cx="20" cy="20" r="18" fill="none" stroke="var(--crumb)" strokeOpacity="0.35" />
      <circle cx="14" cy="14" r="3" fill="var(--crumb)" />
      <circle cx="26" cy="17" r="2.4" fill="var(--crumb)" />
      <circle cx="19" cy="26" r="2.8" fill="var(--crumb)" />
      <circle cx="28" cy="27" r="1.8" fill="var(--crumb)" />
      <circle cx="10" cy="24" r="1.6" fill="var(--crumb)" />
    </svg>
  );
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
          <Cookie size={c.size} />
        </span>
      ))}
    </div>
  );
}
