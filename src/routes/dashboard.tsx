import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { Panel } from "@/components/cyber/Panel";
import { Stat } from "@/components/cyber/Stat";
import { RadarScanner } from "@/components/cyber/RadarScanner";
import { NeuralBrain } from "@/components/cyber/NeuralBrain";
import { NeuralBackground } from "@/components/cyber/NeuralBackground";
import {
  AntigravityAgentGrid,
  ReasoningTimeline,
  PredictiveThreatHorizon,
  AdaptiveDefenseHeatmap,
} from "@/components/cyber/Antigravity";
import { Activity, Shield, AlertTriangle, Brain, Zap, Play, Terminal, Bitcoin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line,
} from "recharts";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAntigravity, ensureAntigravityRunning } from "@/lib/antigravity-core";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "Command Center — AI Shield OS" },
      { name: "description", content: "Live cyber defense executive command center." },
    ],
  }),
});

function genSeries(n = 24, base = 40) {
  return Array.from({ length: n }, (_, i) => ({
    t: i,
    attacks: Math.max(0, Math.round(base + Math.sin(i / 2) * 18 + Math.random() * 22)),
    blocked: Math.max(0, Math.round(base - 6 + Math.cos(i / 3) * 14 + Math.random() * 18)),
    learn: 60 + i * 1.2 + Math.random() * 4,
  }));
}

function Dashboard() {
  const [series, setSeries] = useState(() => genSeries());
  const [counts, setCounts] = useState({ blocked: 14221, conf: 98.7, integ: 99.4, scans: 421 });
  const runSimulation = useAntigravity((s) => s.runSimulation);
  const neutralized = useAntigravity((s) => s.threatsNeutralized);
  const cognitionLoad = useAntigravity((s) => s.cognitionLoad);
  const defensePosture = useAntigravity((s) => s.defensePosture);

  useEffect(() => { ensureAntigravityRunning(); }, []);

  const enterSimulation = () => {
    runSimulation();
    setSeries((s) => s.map((p) => ({
      ...p,
      attacks: Math.min(120, p.attacks + 25),
      blocked: Math.min(120, p.blocked + 30),
    })));
  };

  useEffect(() => {
    const id = setInterval(() => {
      setSeries((s) => {
        const next = [...s.slice(1), {
          t: (s[s.length - 1].t + 1) % 1000,
          attacks: Math.max(8, Math.round(40 + Math.random() * 60)),
          blocked: Math.max(8, Math.round(34 + Math.random() * 52)),
          learn: Math.min(99, s[s.length - 1].learn + (Math.random() * 0.6 - 0.1)),
        }];
        return next;
      });
      setCounts((c) => ({
        blocked: c.blocked + Math.floor(Math.random() * 7),
        conf: Math.min(99.9, c.conf + (Math.random() * 0.2 - 0.08)),
        integ: Math.max(94, Math.min(99.9, c.integ + (Math.random() * 0.3 - 0.15))),
        scans: 380 + Math.floor(Math.random() * 80),
      }));
    }, 1500);
    return () => clearInterval(id);
  }, []);

  return (
    <AppLayout>
      <div className="relative space-y-6">
        <NeuralBackground className="-z-10 opacity-60" />

        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <div className="text-[11px] tracking-[0.3em] text-cyber-cyan text-glow-cyan">// ANTIGRAVITY NEURAL CORE</div>
            <h1 className="mt-1 font-display text-3xl md:text-4xl">Executive Defense Overview</h1>
            <div className="mt-1 text-[10px] font-mono text-muted-foreground tracking-widest">
              SELF-CONTAINED SIMULATION · 6 AUTONOMOUS AGENTS ONLINE
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground">
              <span className="size-2 rounded-full bg-cyber-emerald animate-pulse" />
              REAL-TIME STREAM · 1.2s LATENCY
            </div>
            <Button
              onClick={enterSimulation}
              size="sm"
              className="font-display tracking-[0.2em] text-[11px]"
            >
              <Play className="size-3" />
              ENTER SIMULATION
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat label="Threats Neutralized" value={(counts.blocked + neutralized).toLocaleString()} delta={`+${neutralized} this session`} tone="emerald" icon={<Shield className="size-4" />} />
          <Stat label="Neural Cognition" value={`${(cognitionLoad * 100).toFixed(1)}%`} delta="Antigravity load" tone="cyan" icon={<Brain className="size-4" />} />
          <Stat label="Defense Posture" value={`${(defensePosture * 100).toFixed(1)}%`} delta="adaptive" tone="emerald" icon={<Bitcoin className="size-4" />} />
          <Stat label="Active Scans" value={counts.scans} delta="auto-rotating" tone="amber" icon={<Activity className="size-4" />} />
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <AntigravityAgentGrid />
          </div>
          <Panel title="GLOWING AI BRAIN" subtitle="core cognition visualization" tone="cyan" right={<Terminal className="size-4 text-cyber-cyan" />}>
            <div className="grid place-items-center py-2">
              <NeuralBrain size={220} />
            </div>
          </Panel>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <ReasoningTimeline />
          </div>
          <div className="space-y-4">
            <PredictiveThreatHorizon />
            <AdaptiveDefenseHeatmap />
          </div>
        </div>


        <div className="grid lg:grid-cols-3 gap-4">
          <Panel title="LIVE ATTACK FREQUENCY" subtitle="incoming vs neutralized — last 24 ticks" className="lg:col-span-2">
            <div className="h-64">
              <ResponsiveContainer>
                <AreaChart data={series}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.65 0.26 25)" stopOpacity={0.7} />
                      <stop offset="100%" stopColor="oklch(0.65 0.26 25)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.85 0.18 200)" stopOpacity={0.7} />
                      <stop offset="100%" stopColor="oklch(0.85 0.18 200)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="oklch(0.85 0.18 200 / 0.08)" />
                  <XAxis dataKey="t" tick={{ fill: "oklch(0.68 0.04 220)", fontSize: 10 }} />
                  <YAxis tick={{ fill: "oklch(0.68 0.04 220)", fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: "oklch(0.18 0.04 250)", border: "1px solid oklch(0.85 0.18 200 / 0.4)", fontFamily: "monospace", fontSize: 11 }} />
                  <Area type="monotone" dataKey="attacks" stroke="oklch(0.65 0.26 25)" strokeWidth={2} fill="url(#g1)" />
                  <Area type="monotone" dataKey="blocked" stroke="oklch(0.85 0.18 200)" strokeWidth={2} fill="url(#g2)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel title="THREAT RADAR" subtitle="perimeter sweep · 4s rotation">
            <div className="grid place-items-center py-2">
              <RadarScanner size={220} />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-[10px] font-mono text-muted-foreground tracking-widest">
              <div className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-cyber-red" /> CRIT 3</div>
              <div className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-cyber-amber" /> WARN 7</div>
              <div className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-cyber-emerald" /> SAFE 99</div>
            </div>
          </Panel>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <Panel title="AI LEARNING CURVE" subtitle="defense model self-improvement" className="lg:col-span-2" tone="emerald">
            <div className="h-56">
              <ResponsiveContainer>
                <LineChart data={series}>
                  <CartesianGrid stroke="oklch(0.78 0.2 155 / 0.08)" />
                  <XAxis dataKey="t" tick={{ fill: "oklch(0.68 0.04 220)", fontSize: 10 }} />
                  <YAxis tick={{ fill: "oklch(0.68 0.04 220)", fontSize: 10 }} domain={[40, 100]} />
                  <Tooltip contentStyle={{ background: "oklch(0.18 0.04 250)", border: "1px solid oklch(0.78 0.2 155 / 0.4)", fontFamily: "monospace", fontSize: 11 }} />
                  <Line type="monotone" dataKey="learn" stroke="oklch(0.78 0.2 155)" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel title="RISK METER" subtitle="composite cyber risk score" tone="amber">
            <div className="grid place-items-center py-3">
              <RiskGauge value={Math.round(35 + Math.sin(series[series.length - 1].t) * 14)} />
            </div>
            <ul className="mt-3 space-y-1.5 text-[11px] font-mono">
              <li className="flex items-center justify-between"><span className="text-muted-foreground">Phishing</span><span className="text-cyber-amber">ELEVATED</span></li>
              <li className="flex items-center justify-between"><span className="text-muted-foreground">Ransomware</span><span className="text-cyber-emerald">CONTAINED</span></li>
              <li className="flex items-center justify-between"><span className="text-muted-foreground">Zero-Day</span><span className="text-cyber-red animate-flicker">CRITICAL</span></li>
            </ul>
          </Panel>
        </div>

        <Panel title="LIVE INCIDENT FEED" subtitle="autonomous incident triage" right={<Zap className="size-4 text-cyber-cyan" />}>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              { sev: "CRIT", t: "Deepfake voice — exec impersonation", loc: "us-east-1", color: "text-cyber-red", icon: AlertTriangle },
              { sev: "HIGH", t: "Spear-phish wave · 4,221 emails", loc: "eu-west-2", color: "text-cyber-amber", icon: AlertTriangle },
              { sev: "MED",  t: "MFA fatigue against 14 admin accts", loc: "ap-south-1", color: "text-cyber-amber", icon: AlertTriangle },
              { sev: "OK",   t: "Sandbox quarantined ransomware drop", loc: "edge-mesh", color: "text-cyber-emerald", icon: Shield },
            ].map((r) => (
              <motion.div
                key={r.t}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 rounded-md border border-border/60 bg-card/40 px-3 py-2.5"
              >
                <r.icon className={`size-4 ${r.color}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-mono text-foreground truncate">{r.t}</div>
                  <div className="text-[10px] text-muted-foreground tracking-wider">{r.loc.toUpperCase()}</div>
                </div>
                <span className={`text-[10px] font-display tracking-widest ${r.color}`}>{r.sev}</span>
              </motion.div>
            ))}
          </div>
        </Panel>
      </div>
    </AppLayout>
  );
}

function RiskGauge({ value }: { value: number }) {
  const r = 70;
  const c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
  const color = value > 66 ? "oklch(0.65 0.26 25)" : value > 33 ? "oklch(0.82 0.18 75)" : "oklch(0.78 0.2 155)";
  return (
    <div className="relative size-44">
      <svg viewBox="0 0 200 200" className="size-full -rotate-90">
        <circle cx="100" cy="100" r={r} stroke="oklch(0.85 0.18 200 / 0.15)" strokeWidth="14" fill="none" />
        <circle cx="100" cy="100" r={r} stroke={color} strokeWidth="14" fill="none"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off}
          style={{ filter: `drop-shadow(0 0 10px ${color})`, transition: "stroke-dashoffset 0.6s ease" }} />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="font-display text-4xl" style={{ color }}>{value}</div>
          <div className="text-[10px] tracking-[0.3em] text-muted-foreground mt-1">RISK INDEX</div>
        </div>
      </div>
    </div>
  );
}

