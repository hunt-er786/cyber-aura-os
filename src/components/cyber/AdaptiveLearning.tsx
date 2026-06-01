import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, GitBranch, TrendingUp } from "lucide-react";
import { Panel } from "@/components/cyber/Panel";
import { useAntigravity, type AgentId } from "@/lib/antigravity-core";

const AGENT_COLOR: Record<AgentId, string> = {
  sentinel: "text-cyber-cyan",
  hydra:    "text-cyber-red",
  athena:   "text-[oklch(0.78_0.2_300)]",
  cortex:   "text-[oklch(0.7_0.2_250)]",
  ghost:    "text-cyber-emerald",
  eclipse:  "text-cyber-amber",
};

export function AdaptiveLearningStream() {
  const events = useAntigravity((s) => s.learningEvents);
  const version = useAntigravity((s) => s.modelVersion);
  const learningRate = useAntigravity((s) => s.learningRate);
  const adaptation = useAntigravity((s) => s.adaptationScore);
  const cycle = useAntigravity((s) => s.simulationCycle);

  const ver = `v${version.major}.${version.minor.toString().padStart(2, "0")}`;

  return (
    <Panel
      title="ADAPTIVE LEARNING STREAM"
      subtitle={`Antigravity strategy updates · model ${ver} · cycle ${cycle}`}
      tone="emerald"
      right={<Sparkles className="size-4 text-cyber-emerald" />}
    >
      {/* meters */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        <Meter label="MODEL" value={ver} bar={Math.min(1, (version.major - 4) * 0.2 + version.minor / 100)} icon={<GitBranch className="size-3" />} />
        <Meter label="LEARNING RATE" value={`${(learningRate * 100).toFixed(0)}%`} bar={learningRate} icon={<Sparkles className="size-3" />} />
        <Meter label="ADAPTATION" value={`${(adaptation * 100).toFixed(0)}%`} bar={adaptation} icon={<TrendingUp className="size-3" />} />
      </div>

      {/* stream */}
      <div className="h-56 overflow-auto rounded bg-black/50 border border-cyber-emerald/15 p-2 font-mono text-[10.5px] leading-relaxed space-y-1">
        <AnimatePresence initial={false}>
          {events.length === 0 ? (
            <div className="text-muted-foreground">// awaiting first strategy update…</div>
          ) : (
            events.map((e) => (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, x: -8, backgroundColor: "oklch(0.78 0.2 155 / 0.15)" }}
                animate={{ opacity: 1, x: 0, backgroundColor: "oklch(0.78 0.2 155 / 0)" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="flex gap-2 items-start px-1.5 py-1 rounded"
              >
                <span className="text-muted-foreground shrink-0 tabular-nums">
                  {new Date(e.ts).toLocaleTimeString("en-GB", { hour12: false })}
                </span>
                <span className="shrink-0 px-1 rounded text-[9px] tracking-widest bg-cyber-emerald/20 text-cyber-emerald">
                  {e.modelVersion}
                </span>
                <span className={`shrink-0 uppercase tracking-widest text-[9px] ${AGENT_COLOR[e.agent]}`}>
                  {e.agent}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-foreground/60 text-[9.5px]">trigger: {e.trigger}</div>
                  <div className="text-foreground/95">Δ {e.delta}</div>
                </div>
                <div className="flex flex-col items-end shrink-0 w-14">
                  <span className="text-cyber-emerald tabular-nums text-[9.5px]">+{(e.impact * 100).toFixed(0)}%</span>
                  <div className="w-12 h-0.5 mt-0.5 rounded bg-border/60 overflow-hidden">
                    <div className="h-full bg-cyber-emerald" style={{ width: `${e.impact * 100}%` }} />
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </Panel>
  );
}

function Meter({
  label, value, bar, icon,
}: { label: string; value: string; bar: number; icon: React.ReactNode }) {
  return (
    <div className="rounded border border-cyber-emerald/20 bg-cyber-emerald/5 px-2.5 py-1.5">
      <div className="flex items-center gap-1.5 text-[9px] tracking-widest text-cyber-emerald/80">
        {icon}<span>{label}</span>
      </div>
      <div className="mt-0.5 font-display text-sm text-cyber-emerald tabular-nums">{value}</div>
      <div className="mt-1 h-0.5 rounded bg-border/60 overflow-hidden">
        <motion.div
          className="h-full bg-cyber-emerald"
          animate={{ width: `${Math.max(4, Math.min(100, bar * 100))}%` }}
          transition={{ duration: 0.6 }}
        />
      </div>
    </div>
  );
}
