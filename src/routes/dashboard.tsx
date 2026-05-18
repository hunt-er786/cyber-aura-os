import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { Panel } from "@/components/cyber/Panel";
import { Stat } from "@/components/cyber/Stat";
import { RadarScanner } from "@/components/cyber/RadarScanner";
import { Activity, Shield, AlertTriangle, Brain, Zap, Play, Terminal, Bitcoin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line,
} from "recharts";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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
  const [simData, setSimData] = useState<{
    neural: number | null;
    crypto: number | null;
    before: Record<string, number | string> | null;
    after: Record<string, number | string> | null;
  }>({ neural: null, crypto: null, before: null, after: null });
  const [logs, setLogs] = useState<string[]>([]);
  const [simLoading, setSimLoading] = useState(false);
  const [simError, setSimError] = useState<string | null>(null);

  const coerceMetrics = (obj: unknown): Record<string, number | string> | null => {
    if (!obj || typeof obj !== "object") return null;
    const out: Record<string, number | string> = {};
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      const key = String(k).slice(0, 64);
      if (typeof v === "number" && Number.isFinite(v)) out[key] = v;
      else if (typeof v === "string") out[key] = v.slice(0, 200);
      else if (typeof v === "boolean") out[key] = String(v);
    }
    return Object.keys(out).length ? out : null;
  };

  const enterSimulation = async () => {
    setSimLoading(true);
    setSimError(null);
    try {
      const ctrl = new AbortController();
      const timeout = setTimeout(() => ctrl.abort(), 15000);
      const res = await fetch(
        "https://5000-cs-29459fb4-72a4-4d31-81ab-a556a09fa236.cs-asia-southeast1-yelo.cloudshell.dev/api/state",
        { signal: ctrl.signal, headers: { Accept: "application/json" } },
      );
      clearTimeout(timeout);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const pctRaw = data?.calculated_percentage;
      const pct = typeof pctRaw === "number" ? pctRaw : Number(pctRaw);
      const metric = String(data?.metric ?? "").toLowerCase();
      const target: "neural" | "crypto" = metric === "crypto" ? "crypto" : "neural";

      setSimData((prev) => ({
        ...prev,
        [target]: Number.isFinite(pct) ? pct : prev[target],
        before: coerceMetrics(data?.before) ?? prev.before,
        after: coerceMetrics(data?.after) ?? prev.after,
      }));

      const rawLogs: unknown = data?.logs ?? [];
      const arr = Array.isArray(rawLogs) ? rawLogs : [String(rawLogs)];
      setLogs(arr.slice(0, 500).map((l) => String(l).slice(0, 2000)));
    } catch (e) {
      setSimError(e instanceof Error ? e.message : "Simulation request failed");
    } finally {
      setSimLoading(false);
    }
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
      <div className="space-y-6">
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <div className="text-[11px] tracking-[0.3em] text-cyber-cyan text-glow-cyan">// COMMAND CENTER</div>
            <h1 className="mt-1 font-display text-3xl md:text-4xl">Executive Defense Overview</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground">
              <span className="size-2 rounded-full bg-cyber-emerald animate-pulse" />
              REAL-TIME STREAM · 1.2s LATENCY
            </div>
            <Button
              onClick={enterSimulation}
              disabled={simLoading}
              size="sm"
              className="font-display tracking-[0.2em] text-[11px]"
            >
              <Play className="size-3" />
              {simLoading ? "RUNNING…" : "ENTER SIMULATION"}
            </Button>
          </div>
        </div>

        {simError && (
          <div className="text-[11px] font-mono text-cyber-red border border-cyber-red/40 rounded-md px-3 py-2">
            SIMULATION ERROR · {simError}
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat label="Threats Blocked" value={counts.blocked.toLocaleString()} delta="+ 7.1% past hour" tone="emerald" icon={<Shield className="size-4" />} />
          <Stat
            label="Neural"
            value={simData.neural !== null ? `${simData.neural.toFixed(1)}%` : `${counts.conf.toFixed(1)}%`}
            delta={simData.neural !== null ? "sim · live feed" : "model drift nominal"}
            tone="cyan"
            icon={<Brain className="size-4" />}
          />
          <Stat
            label="Crypto"
            value={simData.crypto !== null ? `${simData.crypto.toFixed(1)}%` : `${counts.integ.toFixed(1)}%`}
            delta={simData.crypto !== null ? "sim · ledger sync" : "14,221 nodes online"}
            tone="emerald"
            icon={<Bitcoin className="size-4" />}
          />
          <Stat label="Active Scans" value={counts.scans} delta="auto-rotating" tone="amber" icon={<Activity className="size-4" />} />
        </div>

        <Panel title="AGENT TRACE LOG" subtitle="simulation terminal output" tone="emerald" right={<Terminal className="size-4 text-cyber-emerald" />}>
          <div className="h-48 overflow-auto rounded bg-black/60 border border-cyber-emerald/20 p-3 font-mono text-[11px] leading-relaxed text-cyber-emerald whitespace-pre-wrap break-words">
            {logs.length === 0 ? (
              <span className="text-muted-foreground">// awaiting simulation trace…</span>
            ) : (
              logs.map((line, i) => (
                <div key={i}>
                  <span className="text-muted-foreground mr-2">{String(i + 1).padStart(3, "0")}</span>
                  {line}
                </div>
              ))
            )}
          </div>
        </Panel>

        {(simData.before || simData.after) && (
          <div className="grid md:grid-cols-2 gap-4">
            <Panel title="BEFORE · SECURITY STATE" subtitle="pre-simulation baseline" tone="amber">
              <BeforeAfterTable data={simData.before} compareTo={simData.after} side="before" />
            </Panel>
            <Panel title="AFTER · SECURITY STATE" subtitle="post-remediation snapshot" tone="emerald">
              <BeforeAfterTable data={simData.after} compareTo={simData.before} side="after" />
            </Panel>
          </div>
        )}

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
