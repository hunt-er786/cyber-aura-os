import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { Panel } from "@/components/cyber/Panel";
import { ensureEngineRunning, useCyberEngine } from "@/lib/cyber-engine";
import { Building2, HeartPulse, Plane, Landmark, Building, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/twins")({
  component: Twins,
  head: () => ({
    meta: [
      { title: "Digital Twin Infrastructure — AI Shield OS X" },
      { name: "description", content: "Live digital twins of critical infrastructure protected by autonomous AI defense." },
    ],
  }),
});

const TWINS = [
  { key: "Bank",     icon: Building2,  desc: "Tier-1 financial clearing network",   sectors: ["Wire transfers", "Card auth", "KYC pipeline"] },
  { key: "Hospital", icon: HeartPulse, desc: "Regional health & EHR system",         sectors: ["Patient records", "Imaging PACS", "ICU telemetry"] },
  { key: "Airport",  icon: Plane,      desc: "Air-traffic & passenger systems",     sectors: ["ATC handoff", "Boarding gates", "Baggage SCADA"] },
  { key: "Gov",      icon: Landmark,   desc: "National identity & tax services",    sectors: ["Citizen portal", "Tax DB", "Voting registry"] },
  { key: "City",     icon: Building,   desc: "Smart-city grid + transit",            sectors: ["Power grid", "Water SCADA", "Transit signals"] },
];

function Twins() {
  useEffect(() => { ensureEngineRunning(); }, []);
  const events = useCyberEngine((s) => s.events);
  const posture = useCyberEngine((s) => s.defensePosture);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <div className="text-[11px] tracking-[0.3em] text-cyber-cyan text-glow-cyan">// CRITICAL INFRASTRUCTURE</div>
          <h1 className="mt-1 font-display text-3xl md:text-4xl">Digital Twin Defense Grid</h1>
          <p className="text-xs font-mono text-muted-foreground mt-1">Live shield status across protected real-world systems.</p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {TWINS.map((t, idx) => {
            // simulate per-twin stress from recent events
            const stress = Math.min(1, events.slice(0, 8).filter((_, i) => i % TWINS.length === idx).reduce((acc, e) => acc + e.severity / 400, 0.1));
            const shielded = stress < posture;
            const Icon = t.icon;
            return (
              <motion.div
                key={t.key}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass rounded-lg p-4 relative overflow-hidden"
              >
                <div className="flex items-center gap-3">
                  <div className={`size-10 rounded-md grid place-items-center border ${shielded ? "border-cyber-emerald/40 bg-cyber-emerald/10 text-cyber-emerald" : "border-cyber-red/40 bg-cyber-red/10 text-cyber-red"}`}>
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <div className="font-display text-lg tracking-wider">{t.key}</div>
                    <div className="text-[11px] font-mono text-muted-foreground">{t.desc}</div>
                  </div>
                  <div className={`ml-auto text-[10px] font-mono tracking-[0.25em] px-2 py-1 rounded border ${shielded ? "border-cyber-emerald/40 text-cyber-emerald" : "border-cyber-red/40 text-cyber-red animate-flicker"}`}>
                    {shielded ? "SHIELDED" : "UNDER ATTACK"}
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {t.sectors.map((s) => {
                    const segStress = Math.min(1, stress * (0.6 + Math.random() * 0.6));
                    return (
                      <div key={s}>
                        <div className="flex items-center justify-between text-[10.5px] font-mono">
                          <span className="text-foreground/80">{s}</span>
                          <span className={segStress > posture ? "text-cyber-red" : "text-cyber-emerald"}>{segStress > posture ? "BREACH ATTEMPT" : "NOMINAL"}</span>
                        </div>
                        <div className="h-1.5 mt-1 rounded-full bg-secondary overflow-hidden">
                          <motion.div
                            className="h-full"
                            style={{ background: segStress > posture ? "var(--cyber-red)" : "var(--cyber-emerald)" }}
                            animate={{ width: `${Math.round((1 - segStress) * 100)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 flex items-center gap-2 text-[10px] font-mono text-cyber-cyan">
                  <ShieldCheck className="size-3.5" />
                  Autonomous shield · {Math.round(posture * 100)}% confidence
                </div>

                {/* radar sweep */}
                <div className="pointer-events-none absolute -bottom-12 -right-12 size-40 rounded-full opacity-20"
                     style={{ background: shielded ? "radial-gradient(circle, var(--cyber-emerald), transparent 60%)" : "radial-gradient(circle, var(--cyber-red), transparent 60%)" }} />
              </motion.div>
            );
          })}
        </div>

        <Panel title="GLOBAL PROTECTION COVERAGE" subtitle="autonomous shield uptime" tone="emerald">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
            {TWINS.map((t) => (
              <div key={t.key} className="rounded-md border border-border/60 p-3">
                <div className="text-[10px] tracking-widest text-muted-foreground">{t.key.toUpperCase()}</div>
                <div className="font-display text-2xl text-cyber-emerald text-glow-emerald tabular-nums">{(99 + Math.random() * 0.99).toFixed(2)}%</div>
                <div className="text-[10px] font-mono text-muted-foreground">SLA · 30d</div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </AppLayout>
  );
}
