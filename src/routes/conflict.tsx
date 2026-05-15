import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { Panel } from "@/components/cyber/Panel";
import {
  conflictScript, ingestionSources, contradictionResolution, constraintTrace,
  actionChain, recoverySteps, verdictTimeline, analyticsBeforeAfter,
} from "@/data/cyber";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Skull, Shield, Cpu, Play, Pause, RotateCcw, FastForward,
  TrendingUp, TrendingDown, Activity, Target, Database, GitMerge, Gavel,
  CheckCircle2, XCircle, AlertTriangle, Loader2, ShieldAlert, BarChart3, ArrowRight,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, Legend,
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

  // Section 10/11/14 state
  type ChainStatus = "pending" | "running" | "ok" | "failed" | "recovered";
  const [chainStatus, setChainStatus] = useState<ChainStatus[]>(() => actionChain.map(() => "pending"));
  const [recoveryActive, setRecoveryActive] = useState(false);
  const [recoveryIdx, setRecoveryIdx] = useState(0);
  const [verdictIdx, setVerdictIdx] = useState(0);
  const [outcomeReached, setOutcomeReached] = useState(false);

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
    setChainStatus(actionChain.map(() => "pending"));
    setRecoveryActive(false);
    setRecoveryIdx(0);
    setVerdictIdx(0);
    setOutcomeReached(false);
    // re-seed preamble
    setTimeout(seed, 0);
  };

  // helper to push a SYSTEM-style line
  const pushLine = (who: Line["who"], msg: string) => {
    idRef.current += 1;
    const ts = new Date().toISOString().slice(11, 19);
    const line: Line = { id: idRef.current, who, msg, ts };
    setLines((l) => [...l, line].slice(-200));
  };

  // seed once on mount
  useEffect(() => { seed(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  // Section 10/11 — sequential action chain orchestration
  useEffect(() => {
    if (!running) return;
    const stepMs = SPEEDS[speed];
    const timers: ReturnType<typeof setTimeout>[] = [];
    let t = 0;
    const at = (ms: number, fn: () => void) => { timers.push(setTimeout(fn, ms)); };

    // Verdict 1 — observation
    at(t += stepMs * 0.4, () => { pushLine("DEFENSE", verdictTimeline[0]); setVerdictIdx(1); });
    // Verdict 2 — analysis
    at(t += stepMs * 1.0, () => { pushLine("DEFENSE", verdictTimeline[1]); setVerdictIdx(2); });
    // Verdict 3 — contradiction
    at(t += stepMs * 1.0, () => { pushLine("DEFENSE", verdictTimeline[2]); setVerdictIdx(3); });
    // Verdict 4 — decision
    at(t += stepMs * 1.0, () => { pushLine("DEFENSE", verdictTimeline[3]); setVerdictIdx(4); });

    // Step 1
    at(t += stepMs * 0.6, () => {
      setChainStatus((s) => s.map((v, i) => i === 0 ? "running" : v));
      pushLine("DEFENSE", `STEP 1 · ${actionChain[0].label} — ${actionChain[0].detail}`);
    });
    at(t += stepMs * 1.2, () => setChainStatus((s) => s.map((v, i) => i === 0 ? "ok" : v)));

    // Step 2
    at(t += stepMs * 0.4, () => {
      setChainStatus((s) => s.map((v, i) => i === 1 ? "running" : v));
      pushLine("DEFENSE", `STEP 2 · ${actionChain[1].label} — ${actionChain[1].detail}`);
    });
    at(t += stepMs * 1.2, () => setChainStatus((s) => s.map((v, i) => i === 1 ? "ok" : v)));

    // Step 3 — execution + simulated failure
    at(t += stepMs * 0.4, () => {
      setChainStatus((s) => s.map((v, i) => i === 2 ? "running" : v));
      pushLine("DEFENSE", verdictTimeline[4]); // [Execution Agent] Firewall rule deployed.
      setVerdictIdx(5);
      pushLine("DEFENSE", `STEP 3 · ${actionChain[2].label} — ${actionChain[2].detail}`);
    });
    at(t += stepMs * 1.4, () => {
      setChainStatus((s) => s.map((v, i) => i === 2 ? "failed" : v));
      pushLine("ATTACK", `STEP 3 FAILURE :: ${actionChain[2].failureMessage}`);
      pushLine("DEFENSE", verdictTimeline[5]); // [Failure Recovery Agent] ...
      setVerdictIdx(6);
      setRecoveryActive(true);
    });

    // Recovery loop
    recoverySteps.forEach((r, i) => {
      at(t += stepMs * 0.7, () => {
        setRecoveryIdx(i + 1);
        pushLine("DEFENSE", `RECOVERY ${String(i + 1).padStart(2, "0")} :: ${r}`);
      });
    });
    at(t += stepMs * 0.4, () => {
      setChainStatus((s) => s.map((v, i) => i === 2 ? "recovered" : v));
    });

    // Step 4
    at(t += stepMs * 0.5, () => {
      setChainStatus((s) => s.map((v, i) => i === 3 ? "running" : v));
      pushLine("DEFENSE", `STEP 4 · ${actionChain[3].label} — ${actionChain[3].detail}`);
    });
    at(t += stepMs * 1.0, () => setChainStatus((s) => s.map((v, i) => i === 3 ? "ok" : v)));

    // Step 5
    at(t += stepMs * 0.4, () => {
      setChainStatus((s) => s.map((v, i) => i === 4 ? "running" : v));
      pushLine("DEFENSE", `STEP 5 · ${actionChain[4].label} — ${actionChain[4].detail}`);
    });
    at(t += stepMs * 1.0, () => setChainStatus((s) => s.map((v, i) => i === 4 ? "ok" : v)));

    // Outcome — triggers analytics binding
    at(t += stepMs * 0.6, () => {
      pushLine("SYSTEM", verdictTimeline[6]); // [Outcome Agent] ...
      setVerdictIdx(7);
      setOutcomeReached(true);
    });

    return () => { timers.forEach(clearTimeout); };
    // re-run on reset (keyed by chainStatus all-pending) and speed change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, speed, chainStatus.every((s) => s === "pending")]);


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

        {/* Section 7 — Multi-Source Ingestion */}
        <Panel
          title="MULTI-SOURCE INGESTION"
          subtitle="5 active feeds · pre-engagement signal fusion"
          right={<Database className="size-4 text-cyber-cyan" />}
        >
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-2.5">
            {ingestionSources.map((s) => {
              const stale = s.id === "S5";
              return (
                <div
                  key={s.id}
                  className={`rounded-md border bg-card/40 p-3 ${stale ? "border-cyber-amber/50" : "border-border/60"}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`text-[10px] font-display tracking-widest ${stale ? "text-cyber-amber" : "text-cyber-cyan"}`}>{s.id}</span>
                      <span className="text-xs font-mono text-foreground truncate">{s.name}</span>
                    </div>
                    <span className="text-[9px] tracking-widest text-muted-foreground font-mono">{s.channel}</span>
                  </div>
                  <div className="mt-1.5 text-[11px] font-mono text-foreground/80 leading-snug">{s.signal}</div>
                  <div className="mt-2 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-muted-foreground">
                      age <span className={stale ? "text-cyber-amber" : "text-foreground"}>{s.ageSec >= 60 ? `${Math.floor(s.ageSec/60)}m ${s.ageSec%60}s` : `${s.ageSec}s`}</span>
                    </span>
                    <span className="text-muted-foreground">trust <span className="text-foreground">{s.trust.toFixed(2)}</span></span>
                    {stale ? (
                      <span className="inline-flex items-center gap-1 text-cyber-amber"><AlertTriangle className="size-3" /> STALE</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-cyber-emerald"><CheckCircle2 className="size-3" /> FRESH</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>

        {/* Section 8 + 12 — side by side */}
        <div className="grid lg:grid-cols-2 gap-4">
          <Panel
            title="CONTRADICTION ENGINE"
            subtitle="conflict resolution trace"
            tone="amber"
            right={<GitMerge className="size-4 text-cyber-amber" />}
          >
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded border border-cyber-cyan/40 text-cyber-cyan text-[10px] font-display tracking-widest">S4 · ENDPOINT LOGS</span>
              <span className="text-cyber-red font-mono text-[11px]">⇄ CONFLICT</span>
              <span className="px-2 py-0.5 rounded border border-cyber-amber/40 text-cyber-amber text-[10px] font-display tracking-widest">S5 · SOC REPORT</span>
            </div>
            <ol className="mt-3 space-y-1.5 text-[11px] font-mono leading-5">
              {contradictionResolution.reasoning.map((r, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-muted-foreground tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-foreground/90">{r}</span>
                </li>
              ))}
            </ol>
            <div className="mt-3 rounded-md border border-cyber-amber/40 bg-cyber-amber/5 px-3 py-2 text-[11px] font-mono">
              <span className="text-cyber-amber tracking-widest">VERDICT · </span>
              <span className="text-foreground">S5 marked </span>
              <span className="text-cyber-amber font-display tracking-widest">STALE</span>
              <span className="text-foreground"> — outdated by 47 minutes. Trusting S4.</span>
            </div>
          </Panel>

          <Panel
            title="CONSTRAINT ENGINE"
            subtitle="action evaluation · pre-action"
            tone="emerald"
            right={<Gavel className="size-4 text-cyber-emerald" />}
          >
            <ul className="space-y-2">
              {constraintTrace.map((c) => {
                const ok = c.status === "SELECTED";
                return (
                  <li
                    key={c.action}
                    className={`rounded-md border px-3 py-2 ${ok ? "border-cyber-emerald/50 bg-cyber-emerald/5" : "border-cyber-red/40 bg-cyber-red/5"}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {ok
                          ? <CheckCircle2 className="size-3.5 text-cyber-emerald shrink-0" />
                          : <XCircle className="size-3.5 text-cyber-red shrink-0" />}
                        <span className="text-xs font-mono text-foreground truncate">{c.action}</span>
                      </div>
                      <span className={`text-[10px] font-display tracking-widest ${ok ? "text-cyber-emerald" : "text-cyber-red"}`}>{c.status}</span>
                    </div>
                    <div className="mt-1 text-[10px] font-mono text-muted-foreground pl-5">{c.reason}</div>
                  </li>
                );
              })}
            </ul>
            <div className="mt-3 text-[11px] font-mono text-cyber-emerald">
              → Selected strategy: <span className="font-display tracking-widest">PARTIAL ISOLATION</span>
            </div>
          </Panel>
        </div>

        {/* Section 10 — Sequential Action Chain */}
        <Panel
          title="SEQUENTIAL ACTION CHAIN"
          subtitle="execution pipeline · 5 steps"
          right={<ArrowRight className="size-4 text-cyber-cyan" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
            {actionChain.map((step, i) => {
              const status = chainStatus[i];
              const tone =
                status === "ok" || status === "recovered" ? "border-cyber-emerald/50 bg-cyber-emerald/5" :
                status === "running" ? "border-cyber-cyan/60 bg-cyber-cyan/10" :
                status === "failed" ? "border-cyber-red/60 bg-cyber-red/10" :
                "border-border/60 bg-card/40";
              return (
                <div key={step.id} className={`relative rounded-md border p-3 ${tone}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-display tracking-widest text-muted-foreground">STEP {step.id}</span>
                    {status === "running" && <Loader2 className="size-3.5 text-cyber-cyan animate-spin" />}
                    {status === "ok" && <CheckCircle2 className="size-3.5 text-cyber-emerald" />}
                    {status === "recovered" && <CheckCircle2 className="size-3.5 text-cyber-emerald" />}
                    {status === "failed" && <XCircle className="size-3.5 text-cyber-red" />}
                    {status === "pending" && <span className="size-2 rounded-full bg-muted-foreground/40" />}
                  </div>
                  <div className="mt-1 text-xs font-mono text-foreground">{step.label}</div>
                  <div className="mt-1 text-[10px] font-mono text-muted-foreground leading-snug">{step.detail}</div>
                  {status === "failed" && (
                    <div className="mt-2 text-[10px] font-mono text-cyber-red leading-snug">{step.failureMessage}</div>
                  )}
                  {status === "recovered" && (
                    <div className="mt-2 text-[10px] font-mono text-cyber-emerald leading-snug">recovered via fallback</div>
                  )}
                </div>
              );
            })}
          </div>
        </Panel>

        {/* Section 11 — Failure Recovery Agent */}
        <AnimatePresence>
          {recoveryActive && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <Panel
                title="FAILURE RECOVERY AGENT"
                subtitle="automated retry · backup containment · escalation"
                tone="red"
                right={
                  <span className="inline-flex items-center gap-1.5 text-[10px] tracking-widest text-cyber-red">
                    <ShieldAlert className="size-3.5" />
                    {chainStatus[2] === "recovered" ? "CONTAINED" : "ACTIVE"}
                  </span>
                }
              >
                <div className="grid md:grid-cols-3 gap-3">
                  <div className="rounded-md border border-cyber-red/40 bg-cyber-red/5 p-3">
                    <div className="text-[10px] tracking-widest text-cyber-red font-display">RETRY LOOP</div>
                    <div className="mt-2 flex items-center gap-2">
                      {chainStatus[2] !== "recovered" && <Loader2 className="size-4 text-cyber-red animate-spin" />}
                      <span className="font-display text-2xl text-foreground tabular-nums">{Math.min(recoveryIdx, 4)}/3</span>
                    </div>
                    <div className="mt-1 text-[10px] font-mono text-muted-foreground">exponential backoff · 2s → 8s</div>
                  </div>
                  <div className="rounded-md border border-cyber-amber/40 bg-cyber-amber/5 p-3">
                    <div className="text-[10px] tracking-widest text-cyber-amber font-display">BACKUP CONTAINMENT</div>
                    <div className="mt-2 text-xs font-mono text-foreground">Secondary firewall cluster · ruleset v4.21-bk</div>
                    <div className="mt-1 text-[10px] font-mono text-muted-foreground">applied to perimeter zone EDGE-2</div>
                  </div>
                  <div className="rounded-md border border-cyber-red/40 bg-cyber-red/5 p-3">
                    <div className="text-[10px] tracking-widest text-cyber-red font-display">ESCALATION</div>
                    <div className="mt-2 text-xs font-mono text-foreground">SOC Tier-2 paged · INC-44219</div>
                    <div className="mt-1 text-[10px] font-mono text-muted-foreground">severity P1 · incident commander notified</div>
                  </div>
                </div>
                <ol className="mt-3 space-y-1 text-[11px] font-mono leading-5">
                  {recoverySteps.slice(0, recoveryIdx).map((r, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-muted-foreground tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                      <span className="text-foreground/90">{r}</span>
                    </li>
                  ))}
                </ol>
              </Panel>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Section 14 — Before vs After analytics */}
        <Panel
          title="BEFORE vs AFTER · OUTCOME ANALYTICS"
          subtitle={outcomeReached ? "bound to [Outcome Agent] verdict — propagation reduced 73%" : "awaiting [Outcome Agent] verdict..."}
          tone={outcomeReached ? "emerald" : "cyan"}
          right={<BarChart3 className="size-4 text-cyber-cyan" />}
        >
          <div className="grid lg:grid-cols-2 gap-4">
            <div>
              <div className="text-[10px] tracking-widest text-muted-foreground font-display mb-2">THREAT SPREAD OVER TIME</div>
              <div className="h-56">
                <ResponsiveContainer>
                  <AreaChart data={analyticsBeforeAfter.spread}>
                    <defs>
                      <linearGradient id="ba-before" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="oklch(0.65 0.26 25)" stopOpacity={0.55} />
                        <stop offset="100%" stopColor="oklch(0.65 0.26 25)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="ba-after" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="oklch(0.78 0.18 155)" stopOpacity={0.55} />
                        <stop offset="100%" stopColor="oklch(0.78 0.18 155)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="oklch(0.85 0.18 200 / 0.08)" />
                    <XAxis dataKey="t" tick={{ fill: "oklch(0.68 0.04 220)", fontSize: 10 }} />
                    <YAxis domain={[0, 100]} tick={{ fill: "oklch(0.68 0.04 220)", fontSize: 10 }} />
                    <Tooltip contentStyle={{ background: "oklch(0.18 0.04 250)", border: "1px solid oklch(0.85 0.18 200 / 0.4)", fontSize: 11 }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Area type="monotone" dataKey="before" name="Before · uncontained"
                      stroke="oklch(0.65 0.26 25)" strokeWidth={2} fill="url(#ba-before)"
                      isAnimationActive animationDuration={900} />
                    <Area type="monotone" dataKey={outcomeReached ? "after" : "before"} name="After · contained"
                      stroke="oklch(0.78 0.18 155)" strokeWidth={2} fill="url(#ba-after)"
                      isAnimationActive animationDuration={1100} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div>
              <div className="text-[10px] tracking-widest text-muted-foreground font-display mb-2">RISK PROFILE · NORMALIZED</div>
              <div className="h-56">
                <ResponsiveContainer>
                  <BarChart data={analyticsBeforeAfter.risk}>
                    <CartesianGrid stroke="oklch(0.85 0.18 200 / 0.08)" />
                    <XAxis dataKey="name" tick={{ fill: "oklch(0.68 0.04 220)", fontSize: 10 }} />
                    <YAxis domain={[0, 100]} tick={{ fill: "oklch(0.68 0.04 220)", fontSize: 10 }} />
                    <Tooltip contentStyle={{ background: "oklch(0.18 0.04 250)", border: "1px solid oklch(0.85 0.18 200 / 0.4)", fontSize: 11 }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="before" name="Before" fill="oklch(0.65 0.26 25)" radius={[3, 3, 0, 0]} isAnimationActive animationDuration={800} />
                    <Bar dataKey={outcomeReached ? "after" : "before"} name="After" fill="oklch(0.78 0.18 155)" radius={[3, 3, 0, 0]} isAnimationActive animationDuration={1100} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] font-mono">
            <MiniDelta label="Propagation" before="96%" after={outcomeReached ? "23%" : "—"} ready={outcomeReached} />
            <MiniDelta label="Exposure"    before="92%" after={outcomeReached ? "18%" : "—"} ready={outcomeReached} />
            <MiniDelta label="Dwell Time"  before="74m" after={outcomeReached ? "9m"  : "—"} ready={outcomeReached} />
            <MiniDelta label="Risk Score"  before="HIGH" after={outcomeReached ? "NOMINAL" : "—"} ready={outcomeReached} />
          </div>
          <div className="mt-3 text-[11px] font-mono">
            <span className="text-muted-foreground">Verdict log progress · </span>
            <span className="text-cyber-cyan">{verdictIdx}/7</span>
          </div>
        </Panel>

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

function MiniDelta({ label, before, after, ready }: { label: string; before: string; after: string; ready: boolean }) {
  return (
    <div className={`rounded-md border px-3 py-2 ${ready ? "border-cyber-emerald/40 bg-cyber-emerald/5" : "border-border/60 bg-card/40"}`}>
      <div className="text-[10px] tracking-widest text-muted-foreground font-display">{label.toUpperCase()}</div>
      <div className="mt-1 flex items-center gap-2 text-[11px]">
        <span className="text-cyber-red line-through">{before}</span>
        <ArrowRight className="size-3 text-muted-foreground" />
        <span className={ready ? "text-cyber-emerald font-display tracking-widest" : "text-muted-foreground"}>{after}</span>
      </div>
    </div>
  );
}
