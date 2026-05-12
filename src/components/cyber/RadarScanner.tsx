export function RadarScanner({ size = 220 }: { size?: number }) {
  return (
    <div
      className="relative rounded-full overflow-hidden"
      style={{ width: size, height: size, background: "radial-gradient(circle, oklch(0.85 0.18 200 / 0.1), transparent 70%)" }}
    >
      {[1, 2, 3, 4].map((r) => (
        <div
          key={r}
          className="absolute rounded-full border border-cyber-cyan/30"
          style={{ inset: `${(r * 12)}%` }}
        />
      ))}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-full bg-cyber-cyan/20" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-px w-full bg-cyber-cyan/20" />
      </div>
      <div
        className="absolute inset-0 origin-center animate-radar"
        style={{
          background: "conic-gradient(from 0deg, oklch(0.85 0.18 200 / 0.5), transparent 25%)",
          WebkitMaskImage: "radial-gradient(circle, black 60%, transparent 100%)",
        }}
      />
      {/* blips */}
      {[
        { t: 22, l: 30, c: "bg-cyber-red" },
        { t: 60, l: 70, c: "bg-cyber-amber" },
        { t: 75, l: 35, c: "bg-cyber-cyan" },
        { t: 40, l: 55, c: "bg-cyber-emerald" },
      ].map((b, i) => (
        <span
          key={i}
          className={`absolute size-2 rounded-full ${b.c} animate-pulse`}
          style={{ top: `${b.t}%`, left: `${b.l}%`, boxShadow: "0 0 8px currentColor" }}
        />
      ))}
      <div className="absolute inset-0 grid place-items-center pointer-events-none">
        <div className="size-1.5 rounded-full bg-cyber-cyan glow-cyan" />
      </div>
    </div>
  );
}
