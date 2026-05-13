import { motion } from "framer-motion";
import { useCyberEngine } from "@/lib/cyber-engine";

/**
 * Stylized neural threat brain — pulses with current intensity & defense posture.
 * Pure SVG, no extra deps.
 */
export function NeuralBrain({ size = 240 }: { size?: number }) {
  const intensity = useCyberEngine((s) => s.intensity);
  const posture = useCyberEngine((s) => s.defensePosture);
  const evo = useCyberEngine((s) => s.defenseEvolution);

  // 12 neurons on two rings
  const neurons = Array.from({ length: 12 }, (_, i) => {
    const ring = i < 5 ? 0 : 1;
    const inRing = ring === 0 ? 5 : 7;
    const idx = ring === 0 ? i : i - 5;
    const r = ring === 0 ? size * 0.18 : size * 0.34;
    const angle = (idx / inRing) * Math.PI * 2 + (ring * 0.3);
    return { x: size / 2 + Math.cos(angle) * r, y: size / 2 + Math.sin(angle) * r, ring };
  });

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute inset-0">
        <defs>
          <radialGradient id="brain-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="oklch(0.85 0.18 200)" stopOpacity="0.9" />
            <stop offset="60%" stopColor="oklch(0.65 0.22 250)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* synapse links */}
        {neurons.map((n, i) =>
          neurons.slice(i + 1).map((m, j) => {
            const dist = Math.hypot(n.x - m.x, n.y - m.y);
            if (dist > size * 0.4) return null;
            return (
              <line
                key={`${i}-${j}`}
                x1={n.x} y1={n.y} x2={m.x} y2={m.y}
                stroke="oklch(0.85 0.18 200)"
                strokeOpacity={0.08 + intensity * 0.25}
                strokeWidth={0.6}
              />
            );
          }),
        )}

        {/* pulsing core */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={size * 0.16}
          fill="url(#brain-core)"
          animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2 - intensity, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: `${size / 2}px ${size / 2}px` }}
        />

        {/* neurons */}
        {neurons.map((n, i) => (
          <motion.circle
            key={i}
            cx={n.x} cy={n.y}
            r={n.ring === 0 ? 3.5 : 2.5}
            fill={n.ring === 0 ? "oklch(0.85 0.18 200)" : "oklch(0.78 0.2 155)"}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.6 + (i % 4) * 0.4, repeat: Infinity, delay: i * 0.12 }}
          />
        ))}
      </svg>

      <div className="relative z-10 text-center pointer-events-none">
        <div className="font-display text-3xl text-cyber-cyan text-glow-cyan tabular-nums">
          {Math.round(posture * 100)}%
        </div>
        <div className="text-[9px] tracking-[0.3em] text-muted-foreground font-mono mt-1">
          NEURAL DEFENSE
        </div>
        <div className="text-[9px] tracking-[0.2em] text-cyber-emerald font-mono mt-0.5">
          EVO · {evo}
        </div>
      </div>
    </div>
  );
}
