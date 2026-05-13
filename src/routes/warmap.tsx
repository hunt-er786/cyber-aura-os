import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { AppLayout } from "@/components/layout/AppLayout";
import { Panel } from "@/components/cyber/Panel";
import { WorldMap } from "@/components/cyber/WorldMap";
import { NeuralBrain } from "@/components/cyber/NeuralBrain";
import { ExplainPanel } from "@/components/cyber/ExplainPanel";
import { ensureEngineRunning, useCyberEngine } from "@/lib/cyber-engine";
import { Swords, Cpu, ShieldCheck, Zap, Radio, TimerReset } from "lucide-react";

export const Route = createFileRoute("/warmap")({
  component: WarMap,
  head: () => ({
    meta: [
      { title: "Global Cyber War Map — AI Shield OS X" },
      { name: "description", content: "AI-vs-AI live cyber warfare visualization with neural defense brain and explainable threat reasoning." },
    ],
  }),
});

function Bar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-2 rounded-full bg-secondary overflow-hidden">
      <motion.div className="h-full" style={{ background: color }} initial={false} animate={{ width: `${Math.round(value * 100)}%` }} transition={{ duration: 0.4 }} />
    </div>
  );
}

function WarMap() {
  useEffect(() => { ensureEngineRunning(); }, []);
  const events = useCyberEngine((s) => s.events);
  const intensity = useCyberEngine((s) => s.intensity);
  const posture = useCyberEngine((s) => s.defensePosture);
  const threats = useCyberEngine((s) => s.threats);
  const mitigated = useCyberEngine((s) => s.mitigated);
  const attackEvo = useCyberEngine((s) => s.attackEvolution);
  const defenseEvo = useCyberEngine((s) => s.defenseEvolution);

  const [series, setSeries] = useState<Array<{ t: number; attack: number; defense: number }>>([]);
  useEffect(() => {
    const id = setInterval(() => {
      setSeries((s) => [...s, { t: Date.now(), attack: intensity, defense: posture }].slice(-40));
    }, 1000);
    return () => clearInterval(id);
  }, [intensity, posture]);

  const dominance = posture - intensity; // -1..1
  const dominanceLabel = dominance > 0.05 ? "DEFENSE DOMINANT" : dominance < -0.05 ? "ATTACK DOMINANT" : "EQUILIBRIUM";
  const dominanceTone = dominance > 0.05 ? "text-cyber-emerald text-glow-emerald" : dominance < -0.05 ? "text-cyber-red text-glow-red" : "text-cyber-amber";

  // pick latest event for explain panel
  const [pickedId, setPickedId] = useState<number | null>(null);
  const picked = useMemo(() => events.find((e) => e.id === pickedId) ?? events[0] ?? null, [events, pickedId]);

  // predicted timeline (next 6 ticks)
  const forecast = useMemo(() => {
    const base = intensity;
    return Array.from({ length: 6 }, (_, i) => {
      const drift = (Math.sin((Date.now() / 4000) + i) * 0.08);
      return Math.max(0, Math.min(1, base + drift + i * 0.02));
    });
  }, [intensity]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <div className="text-[11px] tracking-[0.3em] text-cyber-cyan text-glow-cyan">// AUTONOMOUS WARFARE</div>
            <h1 className="mt-1 font-display text-3xl md:text-4xl">Global Cyber War Map</h1>
            <p className="text-xs font-mono text-muted-foreground mt-1">Attack AI ⚔ Defense AI · live mutation · explainable reasoning · predictive intelligence</p>
          </div>
          <div className={`px-3 py-2 rounded-md border border-current/30 font-display tracking-[0.25em] text-xs ${dominanceTone}`}>
            {dominanceLabel}
          </div>
        </div>

        {/* World map */}
        <WorldMap />

        {/* Dominance + Brain + Forecast */}
        <div className="grid lg:grid-cols-12 gap-4">
          <Panel title="ADVERSARIAL DOMINANCE" subtitle="Attack AI vs Defense AI" tone="red" className="lg:col-span-5">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-cyber-red flex items-center gap-1.5"><Swords className="size-3.5" /> ATTACK SOPHISTICATION</span>
                  <span className="text-cyber-red text-glow-red tabular-nums">{Math.round(intensity * 100)}%</span>
                </div>
                <div className="mt-1.5"><Bar value={intensity} color="var(--cyber-red)" /></div>
                <div className="mt-1 text-[10px] font-mono text-muted-foreground">EVOLUTION CYCLES · {attackEvo}</div>
              </div>

              <div>
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-cyber-emerald flex items-center gap-1.5"><ShieldCheck className="size-3.5" /> DEFENSE POSTURE</span>
                  <span className="text-cyber-emerald text-glow-emerald tabular-nums">{Math.round(posture * 100)}%</span>
                </div>
                <div className="mt-1.5"><Bar value={posture} color="var(--cyber-emerald)" /></div>
                <div className="mt-1 text-[10px] font-mono text-muted-foreground">RETRAIN CYCLES · {defenseEvo}</div>
              </div>

              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={series} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="atk" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--cyber-red)" stopOpacity={0.6} />
                        <stop offset="100%" stopColor="var(--cyber-red)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="def" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--cyber-emerald)" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="var(--cyber-emerald)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="t" hide />
                    <YAxis domain={[0, 1]} hide />
                    <Tooltip contentStyle={{ background: "oklch(0.16 0.04 250)", border: "1px solid oklch(0.85 0.18 200 / 0.3)", fontSize: 11 }} labelFormatter={() => ""} />
                    <Area type="monotone" dataKey="attack" stroke="var(--cyber-red)" fill="url(#atk)" strokeWidth={1.5} isAnimationActive={false} />
                    <Area type="monotone" dataKey="defense" stroke="var(--cyber-emerald)" fill="url(#def)" strokeWidth={1.5} isAnimationActive={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="rounded-md border border-border/60 px-2.5 py-1.5">
                  <div className="text-[9px] tracking-widest text-muted-foreground">THREATS</div>
                  <div className="text-cyber-red text-glow-red tabular-nums text-lg font-display">{threats}</div>
                </div>
                <div className="rounded-md border border-border/60 px-2.5 py-1.5">
                  <div className="text-[9px] tracking-widest text-muted-foreground">MITIGATED</div>
                  <div className="text-cyber-emerald text-glow-emerald tabular-nums text-lg font-display">{mitigated}</div>
                </div>
              </div>
            </div>
          </Panel>

          <Panel title="NEURAL DEFENSE BRAIN" subtitle="adaptive cognition core" tone="cyan" className="lg:col-span-3">
            <div className="grid place-items-center py-2">
              <NeuralBrain size={220} />
            </div>
            <div className="mt-2 text-[10.5px] font-mono text-muted-foreground leading-relaxed">
              The neural core continuously retrains against evolving adversary patterns. Pulse rate scales with active threat intensity.
            </div>
          </Panel>

          <Panel title="PREDICTIVE INTELLIGENCE" subtitle="next 60s forecast" tone="amber" className="lg:col-span-4">
            <div className="space-y-2">
              {forecast.map((v, i) => (
                <div key={i} className="flex items-center gap-3 text-[11px] font-mono">
                  <span className="text-cyber-amber w-12 tabular-nums">+{(i + 1) * 10}s</span>
                  <div className="flex-1"><Bar value={v} color="var(--cyber-amber)" /></div>
                  <span className="w-12 text-right tabular-nums text-foreground">{Math.round(v * 100)}%</span>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-md border border-cyber-amber/30 bg-cyber-amber/5 p-2.5">
              <div className="flex items-center gap-1.5 text-[10px] tracking-[0.25em] text-cyber-amber"><TimerReset className="size-3" /> ESCALATION SIGNAL</div>
              <div className="mt-1 text-[12px] font-mono text-foreground/90">
                {intensity > 0.75
                  ? "Ransomware wave probability rising · pre-position autonomous containment."
                  : intensity > 0.5
                  ? "Phishing surge expanding across LATAM cluster · monitor."
                  : "Posture stable · adaptive shields nominal."}
              </div>
            </div>
          </Panel>
        </div>

        {/* Live event stream + AI explain */}
        <div className="grid lg:grid-cols-5 gap-4">
          <Panel title="LIVE THREAT TELEMETRY" subtitle="click an event to invoke NEXUS" tone="red" className="lg:col-span-3">
            <div className="font-mono text-[11.5px] leading-6 max-h-[420px] overflow-auto pr-1">
              <AnimatePresence initial={false}>
                {events.slice(0, 30).map((e) => {
                  const active = (picked?.id ?? -1) === e.id;
                  return (
                    <motion.button
                      key={e.id}
                      onClick={() => setPickedId(e.id)}
                      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                      className={`w-full text-left flex items-center gap-2 px-2 py-1 rounded ${active ? "bg-cyber-cyan/10 border border-cyber-cyan/40" : "border border-transparent hover:bg-secondary/40"}`}
                    >
                      <span className="text-muted-foreground tabular-nums">{new Date(e.ts).toISOString().slice(11, 19)}</span>
                      <span className={e.severity > 75 ? "text-cyber-red text-glow-red" : e.severity > 45 ? "text-cyber-amber" : "text-cyber-cyan"}>
                        [{e.severity}]
                      </span>
                      <span className="uppercase tracking-widest text-[10.5px] text-cyber-cyan">{e.vector}</span>
                      <span className="text-foreground/80 truncate">{e.srcIp} → {e.dstIp}:{e.port} · {e.protocol}</span>
                      <span className="ml-auto flex items-center gap-1.5">
                        <span className="text-[10px] text-muted-foreground">{e.mitre}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${e.blocked ? "border border-cyber-emerald/40 text-cyber-emerald" : "border border-cyber-red/40 text-cyber-red"}`}>
                          {e.blocked ? "BLOCKED" : "OPEN"}
                        </span>
                      </span>
                    </motion.button>
                  );
                })}
              </AnimatePresence>
              {events.length === 0 && <div className="text-muted-foreground">› awaiting telemetry...</div>}
            </div>
          </Panel>

          <Panel title="EXPLAINABLE AI" subtitle={picked ? `event #${picked.id} · ${picked.vector}` : "select an event"} tone="cyan" className="lg:col-span-2">
            {picked ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <Field k="MITRE" v={picked.mitre} />
                  <Field k="CVE" v={picked.cve ?? "n/a"} />
                  <Field k="SEVERITY" v={String(picked.severity)} />
                  <Field k="DEFENSE CONF" v={`${Math.round(picked.confidence * 100)}%`} />
                </div>
                <div>
                  <div className="text-[10px] tracking-[0.25em] text-muted-foreground mb-1">HEURISTIC SIGNALS</div>
                  <ul className="space-y-1 text-[12px] font-mono">
                    {picked.reasons.map((r, i) => (
                      <li key={i} className="flex gap-2"><span className="text-cyber-cyan">▸</span><span className="text-foreground/85">{r}</span></li>
                    ))}
                  </ul>
                </div>
                <ExplainPanel event={picked} />
              </div>
            ) : (
              <div className="text-sm font-mono text-muted-foreground">› awaiting selection...</div>
            )}
          </Panel>
        </div>

        {/* Autonomous defense ribbon */}
        <Panel title="AUTONOMOUS DEFENSE ACTIONS" subtitle="executed in last cycle" tone="emerald">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] font-mono">
            <Action icon={<ShieldCheck className="size-3.5" />} label="ENDPOINTS QUARANTINED" value={Math.round(mitigated * 0.4)} />
            <Action icon={<Zap className="size-3.5" />} label="FIREWALL RULES PUSHED" value={Math.round(mitigated * 0.7)} />
            <Action icon={<Radio className="size-3.5" />} label="C2 CHANNELS SEVERED" value={Math.round(mitigated * 0.2)} />
            <Action icon={<Cpu className="size-3.5" />} label="MODELS RETRAINED" value={defenseEvo} />
          </div>
        </Panel>
      </div>
    </AppLayout>
  );
}

function Field({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-md border border-border/60 px-2.5 py-1.5">
      <div className="text-[9px] tracking-[0.25em] text-muted-foreground">{k}</div>
      <div className="text-foreground truncate">{v}</div>
    </div>
  );
}
function Action({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-md border border-cyber-emerald/30 bg-cyber-emerald/5 p-2.5">
      <div className="flex items-center gap-1.5 text-cyber-emerald text-[10px] tracking-[0.2em]">{icon}<span>{label}</span></div>
      <div className="mt-1 font-display text-xl text-cyber-emerald text-glow-emerald tabular-nums">{value}</div>
    </div>
  );
}
