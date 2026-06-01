import { motion } from "framer-motion";
import { Eye, Flame, Crown, Database, Ghost, Telescope, Radio, Shield } from "lucide-react";
import { Panel } from "@/components/cyber/Panel";
import { useAntigravity, type Agent, type AgentId } from "@/lib/antigravity-core";

const ICONS: Record<AgentId, typeof Eye> = {
  sentinel: Eye, hydra: Flame, athena: Crown,
  cortex: Database, ghost: Ghost, eclipse: Telescope,
};

const COLOR: Record<Agent["color"], { text: string; ring: string; bg: string; glow: string }> = {
  cyan:    { text: "text-cyber-cyan",    ring: "border-cyber-cyan/40",    bg: "bg-cyber-cyan/10",    glow: "oklch(0.85 0.18 200)" },
  emerald: { text: "text-cyber-emerald", ring: "border-cyber-emerald/40", bg: "bg-cyber-emerald/10", glow: "oklch(0.78 0.2 155)" },
  amber:   { text: "text-cyber-amber",   ring: "border-cyber-amber/40",   bg: "bg-cyber-amber/10",   glow: "oklch(0.82 0.18 75)" },
  red:     { text: "text-cyber-red",     ring: "border-cyber-red/40",     bg: "bg-cyber-red/10",     glow: "oklch(0.65 0.26 25)" },
  violet:  { text: "text-[oklch(0.78_0.2_300)]", ring: "border-[oklch(0.78_0.2_300_/_0.4)]", bg: "bg-[oklch(0.78_0.2_300_/_0.1)]", glow: "oklch(0.78 0.2 300)" },
  blue:    { text: "text-[oklch(0.7_0.2_250)]",  ring: "border-[oklch(0.7_0.2_250_/_0.4)]",  bg: "bg-[oklch(0.7_0.2_250_/_0.1)]",  glow: "oklch(0.7 0.2 250)" },
};

function timeAgo(ts: number) {
  if (!ts) return "—";
  const s = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (s < 1) return "just now";
  if (s < 60) return `${s}s ago`;
  return `${Math.floor(s / 60)}m ago`;
}

function AgentPanel({ agent }: { agent: Agent }) {
  const Icon = ICONS[agent.id];
  const c = COLOR[agent.color];

  return (
    <motion.div
      layout
      className={`relative rounded-lg border ${c.ring} bg-card/40 overflow-hidden`}
      style={{ boxShadow: `inset 0 0 40px ${c.glow.replace(")", " / 0.05)")}` }}
    >
      {/* header */}
      <div className={`flex items-center gap-2.5 px-3 py-2 border-b ${c.ring} ${c.bg}`}>
        <div className={`size-7 grid place-items-center rounded-md border ${c.ring} ${c.text}`}
             style={{ boxShadow: `0 0 12px ${c.glow}` }}>
          <Icon className="size-3.5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className={`text-[11px] font-display tracking-[0.25em] ${c.text}`}>{agent.codename}</div>
          <div className="text-[9px] text-muted-foreground font-mono truncate">{agent.role}</div>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono tracking-widest border ${c.ring} ${c.text} ${c.bg}`}>
            {agent.mode}
          </span>
          <span className="text-[9px] font-mono text-muted-foreground">{agent.status}</span>
        </div>
      </div>

      <div className="p-3 space-y-3">
        {/* signals */}
        <div>
          <div className="flex items-center gap-1.5 text-[9px] tracking-widest text-muted-foreground mb-1.5">
            <Radio className="size-3" /> DETECTED SIGNALS
          </div>
          <div className="flex flex-wrap gap-1">
            {agent.signals.length === 0 ? (
              <span className="text-[10px] font-mono text-muted-foreground/60">// none</span>
            ) : (
              agent.signals.map((s, i) => (
                <motion.span
                  key={s + i}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`px-1.5 py-0.5 rounded text-[9.5px] font-mono ${c.bg} ${c.text} border ${c.ring}`}
                >
                  {s}
                </motion.span>
              ))
            )}
          </div>
        </div>

        {/* last action */}
        <div>
          <div className="flex items-center gap-1.5 text-[9px] tracking-widest text-muted-foreground mb-1">
            <Shield className="size-3" /> LAST DEFENSE ACTION · {timeAgo(agent.lastActionAt)}
          </div>
          <motion.div
            key={agent.lastAction}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10.5px] font-mono text-foreground/90 leading-snug"
          >
            <span className="text-muted-foreground">{">"} </span>{agent.lastAction}
          </motion.div>
        </div>

        {/* mini metrics */}
        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-border/40 text-[9px] font-mono">
          <Mini label="CONF" v={`${Math.round(agent.confidence * 100)}%`} bar={agent.confidence} c={c} />
          <Mini label="THRT" v={`${Math.round(agent.threatLevel)}`} bar={agent.threatLevel / 100} c={c} />
          <Mini label="MEM"  v={`${Math.round(agent.memorySync * 100)}%`} bar={agent.memorySync} c={c} />
        </div>
      </div>
    </motion.div>
  );
}

function Mini({ label, v, bar, c }: { label: string; v: string; bar: number; c: typeof COLOR[Agent["color"]] }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground tracking-widest">{label}</span>
        <span className="text-foreground/90 tabular-nums">{v}</span>
      </div>
      <div className="mt-1 h-0.5 rounded bg-border/60 overflow-hidden">
        <motion.div
          className="h-full"
          style={{ backgroundColor: c.glow }}
          animate={{ width: `${Math.max(4, Math.min(100, bar * 100))}%` }}
          transition={{ duration: 0.6 }}
        />
      </div>
    </div>
  );
}

export function AgentDetailPanels() {
  const agents = useAntigravity((s) => s.agents);
  return (
    <Panel
      title="AGENT INTELLIGENCE UNITS"
      subtitle="6 specialized defense units · mode · signals · last action"
      tone="cyan"
    >
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {Object.values(agents).map((a) => <AgentPanel key={a.id} agent={a} />)}
      </div>
    </Panel>
  );
}
