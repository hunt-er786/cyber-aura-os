import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { Panel } from "@/components/cyber/Panel";
import { conflictScript, ingestionSources, contradictionResolution, constraintTrace } from "@/data/cyber";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Skull, Shield, Cpu, Play, Pause, RotateCcw, FastForward,
  TrendingUp, TrendingDown, Activity, Target, Database, GitMerge, Gavel, CheckCircle2, XCircle, AlertTriangle,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/conflict")({
  component: Conflict,
  head: () => ({
    meta: [
      { title: "Adversarial Simulation — AI Shield OS" },
      { name: "description", content: "Continuous adversarial simulation between attack and defense AI." },
    ],
  }),
});

type Line = { id: number; who: "ATTACK" | "DEFENSE" | "SYSTEM"; msg: string; ts: string };
type Point = { t: number; surface: number; posture: number };

const SPEEDS = { "1x": 1100, "2x": 600, "4x": 280 } as const;
type Speed = keyof typeof SPEEDS;

function Conflict() {
  const [lines, setLines] = useState<Line[]>([]);
  const [surface, setSurface] = useState(38);   // threat surface %
  const [posture, setPosture] = useState(86);   // defense posture %
  const [series, setSeries] = useState<Point[]>(() =>
    Array.from({ length: 24 }, (_, i) => ({ t: i, surface: 38, posture: 86 }))
  );
  const [running, setRunning] = useState(true);
  const [speed, setSpeed] = useState<Speed>("1x");
  const [counts, setCounts] = useState({ detected: 0, mitigated: 0, mttr: 1.4 });

  const idRef = useRef(0);
  const cursorRef = useRef(0);
  const tRef = useRef(24);
  const logRef = useRef<HTMLDivElement>(null);

  const seed = () => {
    // Section 7, 8, 12 — preamble injected at simulation start
    const ts = () => new Date().toISOString().slice(11, 19);
    const seeded: Line[] = [];
    let id = idRef.current;
    seeded.push({ id: ++id, who: "SYSTEM", msg: "// SECTION 7 — multi-source ingestion bootstrap", ts: ts() });
    for (const s of ingestionSources) {
      seeded.push({ id: ++id, who: "SYSTEM", msg: `INGEST ${s.id} (${s.name} · ${s.channel}) age=${s.ageSec}s trust=${s.trust} :: ${s.signal}`, ts: ts() });
    }
    seeded.push({ id: ++id, who: "DEFENSE", msg: "// SECTION 8 — contradiction engine: S4 ⇄ S5 conflict detected", ts: ts() });
    for (const r of contradictionResolution.reasoning) {
      seeded.push({ id: ++id, who: "DEFENSE", msg: r, ts: ts() });
    }
    seeded.push({ id: ++id, who: "SYSTEM", msg: "// SECTION 12 — constraint engine evaluation", ts: ts() });
    for (const c of constraintTrace) {
      seeded.push({ id: ++id, who: c.status === "SELECTED" ? "DEFENSE" : "ATTACK", msg: `${c.status} :: ${c.action} — ${c.reason}`, ts: ts() });
    }
    seeded.push({ id: ++id, who: "SYSTEM", msg: "Constraint solver selected: Partial Isolation Strategy. Handing off to engagement loop.", ts: ts() });
    idRef.current = id;
    setLines(seeded);
  };

  const reset = () => {
    setSurface(38); setPosture(86); setCounts({ detected: 0, mitigated: 0, mttr: 1.4 });
    cursorRef.current = 0; idRef.current = 0;
    setSeries(Array.from({ length: 24 }, (_, i) => ({ t: i, surface: 38, posture: 86 })));
    setLines([]);
    // re-seed preamble
    setTimeout(seed, 0);
  };

  // seed once on mount
  useEffect(() => { seed(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      const item = conflictScript[cursorRef.current % conflictScript.length];
      cursorRef.current += 1;
      idRef.current += 1;
      const ts = new Date().toISOString().slice(11, 19);
      setLines((l) => [...l, { id: idRef.current, who: item.who as Line["who"], msg: item.msg, ts }].slice(-80));

      // Smooth oscillating, never zeroed-out metrics
      let nextSurface = surface;
      let nextPosture = posture;
      if (item.who === "ATTACK") {
        nextSurface = Math.min(78, surface + 3 + Math.random() * 2);
        nextPosture = Math.max(62, posture - 1.5);
        setCounts((c) => ({ ...c, detected: c.detected + 1 }));
      } else if (item.who === "DEFENSE") {
        nextSurface = Math.max(18, surface - 4 - Math.random() * 2);
        nextPosture = Math.min(99, posture + 1.2);
        setCounts((c) => ({ ...c, mitigated: c.mitigated + 1, mttr: Math.max(0.4, c.mttr - 0.04) }));
      } else {
        nextSurface = Math.max(14, surface - 8);
        nextPosture = Math.min(99, posture + 3);
      }
      setSurface(nextSurface);
      setPosture(nextPosture);
      tRef.current += 1;
      setSeries((s) => [...s.slice(1), { t: tRef.current, surface: nextSurface, posture: nextPosture }]);
    }, SPEEDS[speed]);
    return () => clearInterval(id);
  }, [running, speed, surface, posture]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [lines]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <div className="text-[11px] tracking-[0.3em] text-cyber-cyan text-glow-cyan">// ADVERSARIAL SIMULATION</div>
            <h1 className="mt-1 font-display text-2xl sm:text-3xl md:text-4xl">Continuous Red vs Blue Engagement</h1>
            <p className="mt-1.5 text-xs text-muted-foreground font-mono">Autonomous attack and defense models running in a closed-loop testbed.</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setRunning((r) => !r)}
              className="px-3 h-9 rounded-md border border-cyber-cyan/40 text-cyber-cyan font-mono text-[11px] tracking-widest hover:bg-cyber-cyan/10 inline-flex items-center gap-2"
            >
              {running ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
              {running ? "PAUSE" : "RESUME"}
            </button>
            <button
              onClick={reset}
              className="px-3 h-9 rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-cyber-cyan/40 font-mono text-[11px] tracking-widest inline-flex items-center gap-2"
            >
              <RotateCcw className="size-3.5" /> RESET
            </button>
            <div className="inline-flex items-center rounded-md border border-border overflow-hidden">
              <FastForward className="size-3.5 text-cyber-cyan ml-2" />
              {(Object.keys(SPEEDS) as Speed[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-2.5 h-9 font-mono text-[11px] tracking-widest border-l border-border ${
                    speed === s ? "bg-cyber-cyan/10 text-cyber-cyan" : "text-muted-foreground hover:text-foreground"
                  }`}
                >{s}</button>
              ))}
            </div>
          </div>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Kpi label="Threats Detected" value={counts.detected} icon={<Target className="size-4" />} tone="red" trend={counts.detected % 2 === 0 ? "up" : "flat"} />
          <Kpi label="Threats Mitigated" value={counts.mitigated} icon={<Shield className="size-4" />} tone="emerald" trend="up" />
          <Kpi label="Mean Time to Respond" value={`${counts.mttr.toFixed(2)}s`} icon={<Activity className="size-4" />} tone="cyan" trend="down" />
          <Kpi label="Engagement Status" value={running ? "ACTIVE" : "PAUSED"} icon={<Cpu className="size-4" />} tone={running ? "emerald" : "amber"} />
        </div>

        {/* Engagement panel — clean, professional, no game UI */}
        <div className="grid lg:grid-cols-3 gap-4">
          <Panel title="ENGAGEMENT OVERVIEW" subtitle="adversary vs defense model" className="lg:col-span-2">
            <div className="grid grid-cols-3 items-center gap-4 py-2">
              <ModelCard
                role="ADVERSARY"
                name="adversary.gen.v4"
                tone="red"
                icon={<Skull className="size-5" />}
                metrics={[
                  { k: "Sophistication", v: "9.2 / 10" },
                  { k: "Mutation rate", v: "high" },
                ]}
              />

              <div className="grid place-items-center">
                <div className="relative size-20 sm:size-24 rounded-full grid place-items-center border border-cyber-cyan/30 glow-cyan"
                  style={{ background: "radial-gradient(circle, oklch(0.85 0.18 200 / 0.12), transparent 70%)" }}>
                  <Cpu className="size-7 text-cyber-cyan" />
                </div>
                <div className="mt-2 text-[10px] tracking-[0.3em] text-cyber-cyan font-display">NEXUS CORE</div>
                <div className="text-[10px] text-muted-foreground font-mono">orchestrator</div>
              </div>

              <ModelCard
                role="DEFENSE"
                name="shield.os.v4.21"
                tone="cyan"
                icon={<Shield className="size-5" />}
                metrics={[
                  { k: "Coverage", v: "98.4%" },
                  { k: "Learning rate", v: "+0.004" },
                ]}
              />
            </div>

            {/* time series */}
            <div className="mt-4 h-56">
              <ResponsiveContainer>
                <AreaChart data={series}>
                  <defs>
                    <linearGradient id="cf-r" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.65 0.26 25)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="oklch(0.65 0.26 25)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="cf-c" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.85 0.18 200)" stopOpacity={0.55} />
                      <stop offset="100%" stopColor="oklch(0.85 0.18 200)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="oklch(0.85 0.18 200 / 0.08)" />
                  <XAxis dataKey="t" tick={{ fill: "oklch(0.68 0.04 220)", fontSize: 10 }} />
                  <YAxis domain={[0, 100]} tick={{ fill: "oklch(0.68 0.04 220)", fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: "oklch(0.18 0.04 250)", border: "1px solid oklch(0.85 0.18 200 / 0.4)", fontSize: 11 }} />
                  <Area type="monotone" dataKey="surface" name="Threat Surface" stroke="oklch(0.65 0.26 25)" strokeWidth={2} fill="url(#cf-r)" />
                  <Area type="monotone" dataKey="posture" name="Defense Posture" stroke="oklch(0.85 0.18 200)" strokeWidth={2} fill="url(#cf-c)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel title="POSTURE METRICS" subtitle="real-time exposure">
            <div className="space-y-5">
              <Meter label="Threat Surface" value={surface} tone="red" hint="lower is better" />
              <Meter label="Defense Posture" value={posture} tone="emerald" hint="higher is better" />
              <Meter label="Model Confidence" value={Math.min(99, 80 + (posture - surface) / 2)} tone="cyan" hint="defense AI" />
            </div>
            <div className="mt-5 rounded-md border border-border/60 bg-card/40 p-3 text-[11px] font-mono leading-5">
              <div className="text-muted-foreground tracking-widest text-[10px]">CURRENT VERDICT</div>
              <div className={`mt-1 ${surface > 55 ? "text-cyber-red" : surface > 35 ? "text-cyber-amber" : "text-cyber-emerald"}`}>
                {surface > 55 ? "Active intrusion attempts — countermeasures escalating"
                 : surface > 35 ? "Sustained probing — defense holding within tolerance"
                 : "Environment stable — defense maintaining superiority"}
              </div>
            </div>
          </Panel>
        </div>

        <Panel
          title="ENGAGEMENT TELEMETRY"
          subtitle="time-correlated event stream"
          right={
            <span className="inline-flex items-center gap-1.5 text-[10px] tracking-widest text-muted-foreground">
              <span className={`size-1.5 rounded-full ${running ? "bg-cyber-emerald animate-pulse" : "bg-cyber-amber"}`} />
              {running ? "STREAMING" : "PAUSED"}
            </span>
          }
        >
          <div ref={logRef} className="font-mono text-[11px] sm:text-[12px] leading-6 max-h-[420px] overflow-auto pr-2">
            <AnimatePresence initial={false}>
              {lines.map((l) => (
                <motion.div
                  key={l.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-wrap gap-x-3 border-b border-border/30 py-0.5"
                >
                  <span className="text-muted-foreground tabular-nums">{l.ts}</span>
                  <span className={
                    l.who === "ATTACK"  ? "text-cyber-red w-[88px] sm:w-[96px] tracking-widest" :
                    l.who === "DEFENSE" ? "text-cyber-cyan w-[88px] sm:w-[96px] tracking-widest" :
                    "text-cyber-emerald w-[88px] sm:w-[96px] tracking-widest"
                  }>{l.who}</span>
                  <span className="text-foreground/90 flex-1 min-w-0 break-words">{l.msg}</span>
                </motion.div>
              ))}
            </AnimatePresence>
            {lines.length === 0 && (
              <div className="text-muted-foreground">awaiting first event...</div>
            )}
          </div>
        </Panel>
      </div>
    </AppLayout>
  );
}

function Kpi({
  label, value, icon, tone, trend,
}: { label: string; value: React.ReactNode; icon: React.ReactNode; tone: "cyan" | "red" | "emerald" | "amber"; trend?: "up" | "down" | "flat" }) {
  const color = {
    cyan: "text-cyber-cyan", red: "text-cyber-red", emerald: "text-cyber-emerald", amber: "text-cyber-amber",
  }[tone];
  return (
    <div className="glass rounded-lg p-3.5">
      <div className="flex items-center justify-between">
        <div className="text-[10px] tracking-[0.2em] text-muted-foreground">{label.toUpperCase()}</div>
        <span className={color}>{icon}</span>
      </div>
      <div className={`mt-2 font-display text-2xl ${color}`}>{value}</div>
      {trend && (
        <div className="mt-1 flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
          {trend === "up" && <TrendingUp className="size-3 text-cyber-emerald" />}
          {trend === "down" && <TrendingDown className="size-3 text-cyber-emerald" />}
          {trend === "up" ? "trending up" : trend === "down" ? "improving" : "stable"}
        </div>
      )}
    </div>
  );
}

function ModelCard({
  role, name, tone, icon, metrics,
}: { role: string; name: string; tone: "red" | "cyan"; icon: React.ReactNode; metrics: { k: string; v: string }[] }) {
  const color = tone === "red" ? "text-cyber-red" : "text-cyber-cyan";
  const border = tone === "red" ? "border-cyber-red/30" : "border-cyber-cyan/30";
  return (
    <div className={`rounded-lg border ${border} bg-card/40 p-3`}>
      <div className="flex items-center gap-2">
        <span className={`size-9 rounded-md grid place-items-center border ${border} ${color}`}>{icon}</span>
        <div className="min-w-0">
          <div className={`font-display text-xs tracking-[0.2em] ${color}`}>{role}</div>
          <div className="text-[10px] text-muted-foreground font-mono truncate">{name}</div>
        </div>
      </div>
      <div className="mt-3 space-y-1 text-[11px] font-mono">
        {metrics.map((m) => (
          <div key={m.k} className="flex items-center justify-between">
            <span className="text-muted-foreground">{m.k}</span>
            <span className="text-foreground">{m.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Meter({ label, value, tone, hint }: { label: string; value: number; tone: "red" | "emerald" | "cyan"; hint: string }) {
  const color = { red: "var(--cyber-red)", emerald: "var(--cyber-emerald)", cyan: "var(--cyber-cyan)" }[tone];
  return (
    <div>
      <div className="flex items-end justify-between mb-1.5">
        <div>
          <div className="text-[10px] tracking-[0.2em] text-muted-foreground">{label.toUpperCase()}</div>
          <div className="text-[10px] text-muted-foreground/70 font-mono">{hint}</div>
        </div>
        <div className="font-display text-xl tabular-nums" style={{ color }}>{Math.round(value)}%</div>
      </div>
      <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
        <motion.div className="h-full" style={{ background: color }}
          animate={{ width: `${value}%` }} transition={{ duration: 0.5 }} />
      </div>
    </div>
  );
}
