import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCyberEngine } from "@/lib/cyber-engine";

// Approximate continent anchor coordinates (in viewBox 1000x500, equirectangular)
const REGION_POINTS: Record<string, [number, number]> = {
  NA:    [220, 180],
  EU:    [510, 160],
  APAC:  [780, 220],
  LATAM: [320, 340],
  MEA:   [560, 260],
};

// HQ — protected infrastructure node
const HQ: [number, number] = [510, 160];

type Arc = { id: number; from: [number, number]; to: [number, number]; blocked: boolean; vector: string };

export function WorldMap() {
  const events = useCyberEngine((s) => s.events);
  const [arcs, setArcs] = useState<Arc[]>([]);

  useEffect(() => {
    if (!events.length) return;
    const e = events[0];
    const from = REGION_POINTS[e.region] ?? [400, 250];
    setArcs((prev) => [{ id: e.id, from, to: HQ, blocked: e.blocked, vector: e.vector }, ...prev].slice(0, 12));
  }, [events]);

  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-cyber-cyan/20 glass">
      <svg viewBox="0 0 1000 500" className="w-full h-auto">
        <defs>
          <radialGradient id="hq-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="oklch(0.78 0.2 155)" stopOpacity="0.7" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <linearGradient id="arc-cyan" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="oklch(0.85 0.18 200)" stopOpacity="0" />
            <stop offset="100%" stopColor="oklch(0.85 0.18 200)" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="arc-red" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="oklch(0.65 0.26 25)" stopOpacity="0" />
            <stop offset="100%" stopColor="oklch(0.65 0.26 25)" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* grid + faux landmasses */}
        <g opacity={0.25}>
          {Array.from({ length: 11 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 100} y1={0} x2={i * 100} y2={500} stroke="oklch(0.85 0.18 200)" strokeOpacity={0.12} />
          ))}
          {Array.from({ length: 6 }).map((_, i) => (
            <line key={`h${i}`} x1={0} y1={i * 100} x2={1000} y2={i * 100} stroke="oklch(0.85 0.18 200)" strokeOpacity={0.12} />
          ))}
        </g>
        <g fill="oklch(0.85 0.18 200)" fillOpacity={0.07} stroke="oklch(0.85 0.18 200)" strokeOpacity={0.25} strokeWidth={0.5}>
          <path d="M120 120 Q200 80 280 120 L320 200 Q260 260 180 240 Q120 220 110 180 Z" />
          <path d="M280 280 Q340 270 360 320 L340 400 Q300 420 270 380 Z" />
          <path d="M440 100 Q540 80 600 120 L580 220 Q500 240 440 200 Z" />
          <path d="M460 240 Q560 230 620 280 L600 360 Q520 380 460 340 Z" />
          <path d="M660 140 Q780 110 880 160 L900 260 Q820 320 720 280 Q660 240 660 200 Z" />
          <path d="M780 320 Q840 310 880 360 L860 420 Q800 430 780 390 Z" />
        </g>

        {/* region nodes */}
        {Object.entries(REGION_POINTS).map(([k, [x, y]]) => (
          <g key={k}>
            <circle cx={x} cy={y} r={4} fill="oklch(0.85 0.18 200)" />
            <text x={x + 8} y={y - 6} fontSize={11} fill="oklch(0.85 0.18 200)" fontFamily="monospace" letterSpacing={2}>{k}</text>
          </g>
        ))}

        {/* HQ — protected node */}
        <circle cx={HQ[0]} cy={HQ[1]} r={40} fill="url(#hq-glow)" />
        <motion.circle
          cx={HQ[0]} cy={HQ[1]} r={18}
          fill="none" stroke="oklch(0.78 0.2 155)" strokeWidth={1.5}
          animate={{ r: [18, 38, 18], opacity: [0.9, 0, 0.9] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
        />
        <circle cx={HQ[0]} cy={HQ[1]} r={6} fill="oklch(0.78 0.2 155)" />
        <text x={HQ[0] + 12} y={HQ[1] + 22} fontSize={10} fill="oklch(0.78 0.2 155)" fontFamily="monospace" letterSpacing={2}>HQ · SHIELDED</text>

        {/* attack arcs */}
        <AnimatePresence>
          {arcs.map((a) => {
            const mx = (a.from[0] + a.to[0]) / 2;
            const my = Math.min(a.from[1], a.to[1]) - 80;
            const d = `M ${a.from[0]} ${a.from[1]} Q ${mx} ${my} ${a.to[0]} ${a.to[1]}`;
            const stroke = a.blocked ? "url(#arc-cyan)" : "url(#arc-red)";
            return (
              <motion.g key={a.id}>
                <motion.path
                  d={d} fill="none" stroke={stroke} strokeWidth={1.5} strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: [0, 1, 0.6, 0] }}
                  transition={{ duration: 2.2, ease: "easeOut" }}
                />
                <motion.circle
                  r={3} fill={a.blocked ? "oklch(0.85 0.18 200)" : "oklch(0.65 0.26 25)"}
                  initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 2.2 }}
                >
                  <animateMotion dur="2.2s" path={d} />
                </motion.circle>
              </motion.g>
            );
          })}
        </AnimatePresence>
      </svg>

      <div className="absolute top-3 left-3 text-[10px] font-mono tracking-[0.25em] text-cyber-cyan text-glow-cyan">
        GLOBAL CYBER WAR MAP · LIVE
      </div>
      <div className="absolute top-3 right-3 flex items-center gap-3 text-[10px] font-mono">
        <span className="flex items-center gap-1 text-cyber-red"><span className="size-2 rounded-full bg-cyber-red animate-pulse" /> ATTACK</span>
        <span className="flex items-center gap-1 text-cyber-cyan"><span className="size-2 rounded-full bg-cyber-cyan animate-pulse" /> BLOCKED</span>
        <span className="flex items-center gap-1 text-cyber-emerald"><span className="size-2 rounded-full bg-cyber-emerald animate-pulse" /> SHIELDED</span>
      </div>
    </div>
  );
}
