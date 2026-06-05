import { motion, AnimatePresence } from "framer-motion";
import { useAntigravity, type AgentId } from "@/lib/antigravity-core";
import { useMemo } from "react";

/**
 * AntigravityBrain — live cognitive brain visualization wired to the
 * Antigravity Neural Core. Each lobe represents one of the 6 agents and
 * pulses, fires synapses, and emits its current reasoning in real time.
 */

const COLOR: Record<AgentId, string> = {
  sentinel: "oklch(0.85 0.18 200)", // cyan
  hydra:    "oklch(0.65 0.26 25)",  // red
  athena:   "oklch(0.72 0.22 305)", // violet
  cortex:   "oklch(0.70 0.20 250)", // blue
  ghost:    "oklch(0.78 0.20 155)", // emerald
  eclipse:  "oklch(0.82 0.18 75)",  // amber
};

const ORDER: AgentId[] = ["sentinel", "hydra", "athena", "cortex", "ghost", "eclipse"];

export function AntigravityBrain({ size = 260 }: { size?: number }) {
  const agents = useAntigravity((s) => s.agents);
  const cognition = useAntigravity((s) => s.cognitionLoad);
  const coherence = useAntigravity((s) => s.swarmCoherence);
  const posture = useAntigravity((s) => s.defensePosture);
  const model = useAntigravity((s) => s.modelVersion);
  const timeline = useAntigravity((s) => s.timeline);
  const lastEvent = timeline[0];

  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.36;

  const lobes = useMemo(
    () =>
      ORDER.map((id, i) => {
        const angle = (i / ORDER.length) * Math.PI * 2 - Math.PI / 2;
        return {
          id,
          x: cx + Math.cos(angle) * r,
          y: cy + Math.sin(angle) * r,
        };
      }),
    [cx, cy, r],
  );

  return (
    <div className="relative w-full" style={{ minHeight: size + 80 }}>
      <div className="relative grid place-items-center mx-auto" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="absolute inset-0 overflow-visible">
          <defs>
            <radialGradient id="ag-core" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="oklch(0.92 0.18 200)" stopOpacity="0.95" />
              <stop offset="55%" stopColor="oklch(0.65 0.22 250)" stopOpacity="0.45" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <radialGradient id="ag-halo" cx="50%" cy="50%" r="50%">
              <stop offset="60%" stopColor="transparent" />
              <stop offset="100%" stopColor="oklch(0.85 0.18 200)" stopOpacity="0.25" />
            </radialGradient>
          </defs>

          {/* outer halo */}
          <circle cx={cx} cy={cy} r={size * 0.48} fill="url(#ag-halo)" />

          {/* synapse links — central core to each lobe */}
          {lobes.map((l) => {
            const a = agents[l.id];
            return (
              <line
                key={`core-${l.id}`}
                x1={cx} y1={cy} x2={l.x} y2={l.y}
                stroke={COLOR[l.id]}
                strokeOpacity={0.15 + a.activity * 0.55}
                strokeWidth={0.8 + a.activity * 1.2}
              />
            );
          })}

          {/* inter-lobe synapses (swarm coherence) */}
          {lobes.map((l, i) =>
            lobes.slice(i + 1).map((m) => (
              <line
                key={`${l.id}-${m.id}`}
                x1={l.x} y1={l.y} x2={m.x} y2={m.y}
                stroke="oklch(0.85 0.18 200)"
                strokeOpacity={0.04 + coherence * 0.12}
                strokeWidth={0.5}
              />
            )),
          )}

          {/* pulsing core */}
          <motion.circle
            cx={cx} cy={cy}
            r={size * 0.14}
            fill="url(#ag-core)"
            animate={{ scale: [1, 1.12, 1], opacity: [0.75, 1, 0.75] }}
            transition={{ duration: 2.2 - cognition * 1.2, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: `${cx}px ${cy}px` }}
          />

          {/* lobes */}
          {lobes.map((l) => {
            const a = agents[l.id];
            const firing = a.status === "ENGAGING" || a.status === "REASONING";
            return (
              <g key={l.id}>
                {/* firing pulse ring */}
                {firing && (
                  <motion.circle
                    cx={l.x} cy={l.y}
                    r={10}
                    fill="none"
                    stroke={COLOR[l.id]}
                    strokeWidth={1.5}
                    initial={{ opacity: 0.8, scale: 0.6 }}
                    animate={{ opacity: 0, scale: 2.6 }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                    style={{ transformOrigin: `${l.x}px ${l.y}px` }}
                  />
                )}
                <motion.circle
                  cx={l.x} cy={l.y}
                  r={6 + a.activity * 4}
                  fill={COLOR[l.id]}
                  animate={{ opacity: [0.55, 1, 0.55] }}
                  transition={{ duration: 1.4 + (l.x % 5) * 0.2, repeat: Infinity }}
                  style={{ filter: `drop-shadow(0 0 8px ${COLOR[l.id]})` }}
                />
                <text
                  x={l.x}
                  y={l.y + 22}
                  textAnchor="middle"
                  className="font-mono"
                  style={{ fill: COLOR[l.id], fontSize: 9, letterSpacing: "0.18em" }}
                >
                  {a.codename}
                </text>
              </g>
            );
          })}

          {/* traveling synapse particles — random firings */}
          {lobes.map((l) => {
            const a = agents[l.id];
            if (a.activity < 0.55) return null;
            return (
              <motion.circle
                key={`p-${l.id}-${a.lastActionAt}`}
                r={2}
                fill={COLOR[l.id]}
                initial={{ cx: l.x, cy: l.y, opacity: 1 }}
                animate={{ cx: cx, cy: cy, opacity: 0 }}
                transition={{ duration: 0.9, ease: "easeIn" }}
                style={{ filter: `drop-shadow(0 0 6px ${COLOR[l.id]})` }}
              />
            );
          })}
        </svg>

        <div className="relative z-10 text-center pointer-events-none">
          <div className="font-display text-3xl text-cyber-cyan text-glow-cyan tabular-nums">
            {Math.round(posture * 100)}%
          </div>
          <div className="text-[9px] tracking-[0.3em] text-muted-foreground font-mono mt-1">
            ANTIGRAVITY CORE
          </div>
          <div className="text-[9px] tracking-[0.2em] text-cyber-emerald font-mono mt-0.5">
            MODEL v{model.major}.{model.minor.toString().padStart(2, "0")}
          </div>
        </div>
      </div>

      {/* live cognition readout */}
      <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] font-mono">
        <div className="flex items-center justify-between rounded border border-border/60 bg-card/40 px-2 py-1.5">
          <span className="text-muted-foreground tracking-widest">COGNITION</span>
          <span className="text-cyber-cyan tabular-nums">{(cognition * 100).toFixed(0)}%</span>
        </div>
        <div className="flex items-center justify-between rounded border border-border/60 bg-card/40 px-2 py-1.5">
          <span className="text-muted-foreground tracking-widest">COHERENCE</span>
          <span className="text-cyber-emerald tabular-nums">{(coherence * 100).toFixed(0)}%</span>
        </div>
      </div>

      <div className="mt-2 rounded border border-cyber-cyan/30 bg-cyber-cyan/[0.04] px-2.5 py-2 min-h-[44px]">
        <div className="text-[9px] tracking-[0.3em] text-cyber-cyan/80 font-mono">CURRENT THOUGHT</div>
        <AnimatePresence mode="wait">
          {lastEvent ? (
            <motion.div
              key={lastEvent.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="text-[11px] font-mono text-foreground/90 leading-snug mt-1"
            >
              <span style={{ color: COLOR[lastEvent.agent] }}>
                [{agents[lastEvent.agent].codename}]
              </span>{" "}
              {lastEvent.message}
            </motion.div>
          ) : (
            <div className="text-[11px] font-mono text-muted-foreground mt-1">standing by…</div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
