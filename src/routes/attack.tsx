import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { Panel } from "@/components/cyber/Panel";
import { attackPayloads } from "@/data/cyber";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Skull, Zap, Pause, Play, Trash2 } from "lucide-react";

export const Route = createFileRoute("/attack")({
  component: AttackSim,
  head: () => ({
    meta: [
      { title: "Attack Simulator — AI Shield OS" },
      { name: "description", content: "Generate evolving AI cyber attacks." },
    ],
  }),
});

type Event = { id: number; ts: string; line: string; type: string };

function AttackSim() {
  const [running, setRunning] = useState(true);
  const [difficulty, setDifficulty] = useState<"LOW" | "MED" | "HIGH" | "APEX">("HIGH");
  const [events, setEvents] = useState<Event[]>([]);
  const [latest, setLatest] = useState<typeof attackPayloads[number] | null>(null);
  const idRef = useRef(0);

  useEffect(() => {
    if (!running) return;
    const speed = { LOW: 2400, MED: 1500, HIGH: 900, APEX: 450 }[difficulty];
    const id = setInterval(() => {
      const p = attackPayloads[Math.floor(Math.random() * attackPayloads.length)];
      const ts = new Date().toISOString().slice(11, 19);
      setLatest(p);
      idRef.current += 1;
      setEvents((e) => [
        { id: idRef.current, ts, type: p.type, line: `[${p.severity}] ${p.type} → ${p.name} :: vector=${p.vector}` },
        ...e,
      ].slice(0, 80));
    }, speed);
    return () => clearInterval(id);
  }, [running, difficulty]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <div className="text-[11px] tracking-[0.3em] text-cyber-red text-glow-red">// ATTACK GENERATOR</div>
            <h1 className="mt-1 font-display text-3xl md:text-4xl">Adversarial Payload Forge</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setRunning((r) => !r)} className="px-3 py-2 rounded-md border border-cyber-red/40 text-cyber-red font-mono text-xs tracking-widest hover:bg-cyber-red/10 inline-flex items-center gap-2">
              {running ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
              {running ? "PAUSE" : "START"}
            </button>
            <button onClick={() => setEvents([])} className="px-3 py-2 rounded-md border border-border text-muted-foreground font-mono text-xs tracking-widest hover:bg-secondary inline-flex items-center gap-2">
              <Trash2 className="size-3.5" /> CLEAR
            </button>
          </div>
        </div>

        <Panel title="MUTATION ENGINE" subtitle="threat difficulty controls" tone="red">
          <div className="grid grid-cols-4 gap-2">
            {(["LOW","MED","HIGH","APEX"] as const).map((d) => {
              const active = difficulty === d;
              return (
                <button key={d} onClick={() => setDifficulty(d)}
                  className={`relative py-3 rounded-md font-display text-sm tracking-[0.25em] border transition
                    ${active
                      ? "border-cyber-red text-cyber-red text-glow-red bg-cyber-red/10"
                      : "border-border text-muted-foreground hover:border-cyber-red/50"}`}>
                  {d}
                  {active && <span className="absolute inset-x-3 -bottom-px h-px bg-cyber-red animate-pulse" />}
                </button>
              );
            })}
          </div>
        </Panel>

        <div className="grid lg:grid-cols-5 gap-4">
          <Panel title="LIVE PAYLOAD STREAM" subtitle="raw attack telemetry" tone="red" className="lg:col-span-3">
            <div className="font-mono text-[12px] leading-6 max-h-[420px] overflow-auto pr-2">
              <AnimatePresence initial={false}>
                {events.map((e) => (
                  <motion.div
                    key={e.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex gap-3"
                  >
                    <span className="text-muted-foreground">{e.ts}</span>
                    <span className={
                      e.line.includes("CRITICAL") ? "text-cyber-red text-glow-red animate-flicker" :
                      e.line.includes("HIGH")     ? "text-cyber-amber" :
                      "text-cyber-cyan"
                    }>
                      {e.line}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
              {events.length === 0 && (
                <div className="text-muted-foreground">{">"} awaiting payload generation...</div>
              )}
              <div className="text-cyber-red">{">"} <span className="animate-blink">█</span></div>
            </div>
          </Panel>

          <Panel title="LATEST INJECTION" subtitle="adversary AI output" tone="red" className="lg:col-span-2">
            {latest ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Skull className="size-5 text-cyber-red" />
                  <div className="font-display text-lg text-cyber-red text-glow-red">{latest.name}</div>
                  <span className="ml-auto text-[10px] font-mono px-2 py-0.5 rounded border border-cyber-red/50 text-cyber-red">{latest.severity}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <Field k="TYPE" v={latest.type} />
                  <Field k="VECTOR" v={latest.vector} />
                </div>
                <div className="rounded-md border border-cyber-red/30 bg-cyber-red/5 p-3">
                  <div className="text-[10px] tracking-[0.2em] text-cyber-red mb-1">PAYLOAD</div>
                  <div className="text-sm text-foreground/90 leading-relaxed">"{latest.payload}"</div>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-cyber-amber">
                  <Zap className="size-3.5" /> mutation engine adapting in real time
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground text-sm font-mono">awaiting generation...</div>
            )}
          </Panel>
        </div>
      </div>
    </AppLayout>
  );
}

function Field({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-md border border-border/60 px-3 py-2 bg-card/40">
      <div className="text-[10px] tracking-[0.2em] text-muted-foreground">{k}</div>
      <div className="text-foreground">{v}</div>
    </div>
  );
}
