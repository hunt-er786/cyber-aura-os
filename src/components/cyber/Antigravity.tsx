import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Eye, Flame, Crown, Database, Ghost, Telescope, Zap } from "lucide-react";
import { Panel } from "@/components/cyber/Panel";
import {
  useAntigravity,
  ensureAntigravityRunning,
  type Agent,
  type AgentId,
} from "@/lib/antigravity-core";

const ICONS: Record<AgentId, typeof Eye> = {
  sentinel: Eye,
  hydra: Flame,
  athena: Crown,
  cortex: Database,
  ghost: Ghost,
  eclipse: Telescope,
};

const COLOR_MAP: Record<Agent["color"], { text: string; ring: string; dot: string; glow: string; bar: string }> = {
  cyan:    { text: "text-cyber-cyan",    ring: "border-cyber-cyan/40",    dot: "bg-cyber-cyan",    glow: "oklch(0.85 0.18 200)", bar: "bg-cyber-cyan" },
  emerald: { text: "text-cyber-emerald", ring: "border-cyber-emerald/40", dot: "bg-cyber-emerald", glow: "oklch(0.78 0.2 155)",  bar: "bg-cyber-emerald" },
  amber:   { text: "text-cyber-amber",   ring: "border-cyber-amber/40",   dot: "bg-cyber-amber",   glow: "oklch(0.82 0.18 75)",  bar: "bg-cyber-amber" },
  red:     { text: "text-cyber-red",     ring: "border-cyber-red/40",     dot: "bg-cyber-red",     glow: "oklch(0.65 0.26 25)",  bar: "bg-cyber-red" },
  violet:  { text: "text-[oklch(0.78_0.2_300)]", ring: "border-[oklch(0.78_0.2_300_/_0.4)]", dot: "bg-[oklch(0.78_0.2_300)]", glow: "oklch(0.78 0.2 300)", bar: "bg-[oklch(0.78_0.2_300)]" },
  blue:    { text: "text-[oklch(0.7_0.2_250)]",  ring: "border-[oklch(0.7_0.2_250_/_0.4)]",  dot: "bg-[oklch(0.7_0.2_250)]",  glow: "oklch(0.7 0.2 250)",  bar: "bg-[oklch(0.7_0.2_250)]" },
};

function AgentCard({ agent }: { agent: Agent }) {
  const Icon = ICONS[agent.id];
  const c = COLOR_MAP[agent.color];
  return (
    <motion.div
      layout
      className={`relative rounded-lg border ${c.ring} bg-card/40 p-3 overflow-hidden`}
      style={{ boxShadow: `inset 0 0 30px ${c.glow.replace(")", " / 0.06)")}` }}
    >
      <motion.span
        className={`absolute -top-px left-0 h-px ${c.bar}`}
        animate={{ width: ["0%", "100%", "0%"] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="flex items-center gap-2.5">
        <div className={`size-8 grid place-items-center rounded-md border ${c.ring} ${c.text}`} style={{ boxShadow: `0 0 14px ${c.glow}` }}>
          <Icon className="size-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className={`text-[11px] font-display tracking-[0.25em] ${c.text}`}>{agent.codename}</div>
          <div className="text-[9px] text-muted-foreground font-mono truncate">{agent.role}</div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`size-1.5 rounded-full ${c.dot} animate-pulse`} />
          <span className={`text-[9px] font-mono ${c.text}`}>{agent.status}</span>
        </div>
      </div>

      <div className="mt-2.5 text-[10.5px] font-mono text-foreground/80 leading-snug min-h-[2.4em]">
        <span className="text-muted-foreground">{">"} </span>{agent.reasoning}
      </div>

      <div className="mt-3 grid grid-cols-4 gap-2 text-[9px] font-mono">
        <Metric label="CONF" value={`${Math.round(agent.confidence * 100)}%`} bar={agent.confidence} c={c.bar} />
        <Metric label="THRT" value={`${Math.round(agent.threatLevel)}`} bar={agent.threatLevel / 100} c={c.bar} />
        <Metric label="LAT" value={`${Math.round(agent.latencyMs)}ms`} bar={1 - agent.latencyMs / 420} c={c.bar} />
        <Metric label="MEM" value={`${Math.round(agent.memorySync * 100)}%`} bar={agent.memorySync} c={c.bar} />
      </div>
    </motion.div>
  );
}

function Metric({ label, value, bar, c }: { label: string; value: string; bar: number; c: string }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground tracking-widest">{label}</span>
        <span className="text-foreground/90 tabular-nums">{value}</span>
      </div>
      <div className="mt-1 h-0.5 rounded bg-border/60 overflow-hidden">
        <motion.div
          className={`h-full ${c}`}
          animate={{ width: `${Math.max(4, Math.min(100, bar * 100))}%` }}
          transition={{ duration: 0.6 }}
        />
      </div>
    </div>
  );
}

export function AntigravityAgentGrid() {
  useEffect(() => { ensureAntigravityRunning(); }, []);
  const agents = useAntigravity((s) => s.agents);
  const coherence = useAntigravity((s) => s.swarmCoherence);
  const cycle = useAntigravity((s) => s.simulationCycle);

  return (
    <Panel
      title="ANTIGRAVITY NEURAL CORE · SWARM"
      subtitle={`6 autonomous agents · coherence ${(coherence * 100).toFixed(0)}% · cycle ${cycle}`}
      tone="cyan"
      right={<Brain className="size-4 text-cyber-cyan" />}
    >
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {Object.values(agents).map((a) => <AgentCard key={a.id} agent={a} />)}
      </div>
    </Panel>
  );
}

export function ReasoningTimeline() {
  const timeline = useAntigravity((s) => s.timeline);
  const load = useAntigravity((s) => s.cognitionLoad);

  return (
    <Panel
      title="STRATEGIC REASONING CONSOLE"
      subtitle={`AI cognition timeline · load ${(load * 100).toFixed(0)}%`}
      tone="emerald"
      right={<Zap className="size-4 text-cyber-emerald" />}
    >
      <div className="h-64 overflow-auto rounded bg-black/50 border border-cyber-emerald/15 p-2 font-mono text-[10.5px] leading-relaxed space-y-1">
        <AnimatePresence initial={false}>
          {timeline.length === 0 ? (
            <div className="text-muted-foreground">// awaiting cognition stream…</div>
          ) : (
            timeline.map((e) => (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex gap-2 items-start"
              >
                <span className="text-muted-foreground shrink-0">{new Date(e.ts).toLocaleTimeString("en-GB", { hour12: false })}</span>
                <span className={`shrink-0 px-1 rounded text-[9px] tracking-widest ${
                  e.channel === "ACTION" ? "bg-cyber-red/20 text-cyber-red" :
                  e.channel === "SWARM"  ? "bg-cyber-cyan/20 text-cyber-cyan" :
                  e.channel === "MEMORY" ? "bg-[oklch(0.7_0.2_250_/_0.2)] text-[oklch(0.7_0.2_250)]" :
                                           "bg-cyber-emerald/20 text-cyber-emerald"
                }`}>{e.channel}</span>
                <span className="shrink-0 text-foreground/70 uppercase tracking-widest text-[9px]">{e.agent}</span>
                <span className="text-foreground/90">{e.message}</span>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </Panel>
  );
}

export function PredictiveThreatHorizon() {
  const predictions = useAntigravity((s) => s.predictions);
  return (
    <Panel title="PREDICTIVE THREAT HORIZON" subtitle="Eclipse forecast · T+90s" tone="amber">
      <div className="space-y-1.5">
        {predictions.length === 0 ? (
          <div className="text-[11px] font-mono text-muted-foreground">// scanning horizon…</div>
        ) : (
          predictions.map((p) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-[10.5px] font-mono border-b border-border/40 pb-1"
            >
              <span className="w-16 uppercase tracking-widest text-cyber-amber">{p.vector}</span>
              <span className="w-10 text-muted-foreground">{p.region}</span>
              <div className="flex-1 h-1 rounded bg-border/60 overflow-hidden">
                <div className="h-full bg-cyber-amber" style={{ width: `${p.probability * 100}%` }} />
              </div>
              <span className="w-12 text-right tabular-nums text-foreground/90">{Math.round(p.probability * 100)}%</span>
              <span className="w-14 text-right text-muted-foreground">T+{p.eta}s</span>
            </motion.div>
          ))
        )}
      </div>
    </Panel>
  );
}

export function AdaptiveDefenseHeatmap() {
  const heatmap = useAntigravity((s) => s.heatmap);
  const posture = useAntigravity((s) => s.defensePosture);
  return (
    <Panel title="ADAPTIVE DEFENSE HEATMAP" subtitle={`posture ${(posture * 100).toFixed(0)}%`} tone="emerald">
      <div className="grid grid-cols-6 gap-1.5">
        {heatmap.map((v, i) => (
          <motion.div
            key={i}
            className="aspect-square rounded"
            animate={{
              backgroundColor: `oklch(${0.3 + v * 0.4} ${0.1 + v * 0.18} ${v > 0.66 ? 25 : v > 0.33 ? 75 : 155})`,
              boxShadow: `0 0 ${v * 16}px oklch(${0.5 + v * 0.3} 0.2 ${v > 0.66 ? 25 : v > 0.33 ? 75 : 155})`,
            }}
            transition={{ duration: 0.8 }}
          />
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between text-[9px] font-mono text-muted-foreground tracking-widest">
        <span>CALM</span><span>ELEVATED</span><span>CRITICAL</span>
      </div>
    </Panel>
  );
}
