import { motion } from "framer-motion";
import { Brain, GraduationCap, Shield, Swords } from "lucide-react";
import { Panel } from "@/components/cyber/Panel";
import {
  useAntigravity,
  BRAIN_MODE_META,
  type BrainMode,
} from "@/lib/antigravity-core";

const MODE_ORDER: BrainMode[] = ["LEARNING", "NEUTRALIZE", "ESCALATE"];

const ICONS: Record<BrainMode, React.ComponentType<{ className?: string }>> = {
  LEARNING: GraduationCap,
  NEUTRALIZE: Shield,
  ESCALATE: Swords,
};

const TONE: Record<BrainMode, { border: string; text: string; bg: string; glow: string }> = {
  LEARNING:   { border: "border-cyber-emerald", text: "text-cyber-emerald", bg: "bg-cyber-emerald/10", glow: "shadow-[0_0_24px_oklch(0.78_0.2_155/0.35)]" },
  NEUTRALIZE: { border: "border-cyber-cyan",    text: "text-cyber-cyan",    bg: "bg-cyber-cyan/10",    glow: "shadow-[0_0_24px_oklch(0.85_0.18_200/0.35)]" },
  ESCALATE:   { border: "border-cyber-red",     text: "text-cyber-red",     bg: "bg-cyber-red/10",     glow: "shadow-[0_0_24px_oklch(0.65_0.26_25/0.35)]" },
};

export function BrainControl() {
  const brainMode = useAntigravity((s) => s.brainMode);
  const setBrainMode = useAntigravity((s) => s.setBrainMode);
  const posture = useAntigravity((s) => s.defensePosture);
  const cog = useAntigravity((s) => s.cognitionLoad);
  const rate = useAntigravity((s) => s.learningRate);
  const adaptation = useAntigravity((s) => s.adaptationScore);

  return (
    <Panel
      title="BRAIN CONTROL"
      subtitle="switch Antigravity doctrine · instant effect"
      tone={brainMode === "ESCALATE" ? "red" : brainMode === "LEARNING" ? "emerald" : "cyan"}
      right={<Brain className="size-4 text-cyber-cyan" />}
    >
      <div className="grid grid-cols-3 gap-2">
        {MODE_ORDER.map((m) => {
          const Icon = ICONS[m];
          const active = brainMode === m;
          const t = TONE[m];
          return (
            <motion.button
              key={m}
              onClick={() => setBrainMode(m)}
              whileTap={{ scale: 0.96 }}
              className={`relative rounded-md border px-2 py-2.5 text-left transition ${
                active ? `${t.border} ${t.bg} ${t.glow}` : "border-border/60 hover:border-cyber-cyan/40"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Icon className={`size-3.5 ${active ? t.text : "text-muted-foreground"}`} />
                <span className={`font-display tracking-[0.2em] text-[10px] ${active ? t.text : "text-foreground"}`}>
                  {m}
                </span>
              </div>
              <div className="mt-1 text-[9px] font-mono text-muted-foreground leading-tight">
                {BRAIN_MODE_META[m].tagline}
              </div>
              {active && (
                <motion.span
                  layoutId="brain-mode-dot"
                  className={`absolute top-1.5 right-1.5 size-1.5 rounded-full ${t.bg.replace("/10", "")}`}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] font-mono">
        <Readout label="POSTURE"    value={`${(posture * 100).toFixed(0)}%`} tone="emerald" />
        <Readout label="COGNITION"  value={`${(cog * 100).toFixed(0)}%`} tone="cyan" />
        <Readout label="LEARN RATE" value={rate.toFixed(2)} tone="cyan" />
        <Readout label="ADAPTATION" value={`${(adaptation * 100).toFixed(0)}%`} tone="emerald" />
      </div>

      <div className="mt-3 rounded border border-border/60 bg-card/40 px-2.5 py-2">
        <div className="text-[9px] tracking-[0.3em] text-muted-foreground">ACTIVE DOCTRINE</div>
        <div className={`mt-0.5 text-[11px] font-mono ${TONE[brainMode].text}`}>
          {BRAIN_MODE_META[brainMode].tagline}
        </div>
      </div>
    </Panel>
  );
}

function Readout({ label, value, tone }: { label: string; value: string; tone: "cyan" | "emerald" }) {
  const color = tone === "cyan" ? "text-cyber-cyan" : "text-cyber-emerald";
  return (
    <div className="flex items-center justify-between rounded border border-border/60 bg-card/40 px-2 py-1.5">
      <span className="text-muted-foreground tracking-widest">{label}</span>
      <span className={`${color} tabular-nums`}>{value}</span>
    </div>
  );
}
