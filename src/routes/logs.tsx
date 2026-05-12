import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { Panel } from "@/components/cyber/Panel";
import { initialLogs } from "@/data/cyber";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/logs")({
  component: Logs,
  head: () => ({
    meta: [
      { title: "System Logs — AI Shield OS" },
      { name: "description", content: "Live system kernel and AI reasoning logs." },
    ],
  }),
});

const lex = [
  ["INFO", "Defense AI inference batch 4221 completed in 12ms"],
  ["WARN", "MFA fatigue burst on admin pool · throttling enabled"],
  ["INFO", "Honeypot 14 captured 8.2MB attacker reconnaissance"],
  ["CRIT", "Polymorphic ransomware drop quarantined in sandbox 7"],
  ["INFO", "Neural classifier retrained on 1,422 new samples"],
  ["WARN", "Anomalous outbound DNS to .vip TLD blocked"],
  ["INFO", "Edge node hardening pass complete · 14,221 nodes"],
  ["CRIT", "Deepfake voice on inbound call — biometric mismatch 0.91"],
  ["INFO", "Post-quantum key rotation scheduled at T+04:00"],
];

function Logs() {
  const [items, setItems] = useState<string[]>(initialLogs);
  const [filter, setFilter] = useState<"ALL"|"INFO"|"WARN"|"CRIT">("ALL");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(() => {
      const [lvl, msg] = lex[Math.floor(Math.random() * lex.length)];
      const ts = new Date().toISOString().slice(11, 19);
      setItems((l) => [...l, `[${lvl} ${ts}] ${msg}`].slice(-200));
    }, 700);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    ref.current?.scrollTo({ top: ref.current.scrollHeight });
  }, [items]);

  const filtered = filter === "ALL" ? items : items.filter((l) => l.includes(`[${filter}`));

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <div className="text-[11px] tracking-[0.3em] text-cyber-cyan text-glow-cyan">// SYSTEM LOGS</div>
            <h1 className="mt-1 font-display text-3xl md:text-4xl">Kernel & AI Reasoning Stream</h1>
          </div>
          <div className="flex items-center gap-2">
            {(["ALL","INFO","WARN","CRIT"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-md font-mono text-[11px] tracking-widest border transition ${
                  filter === f
                    ? "border-cyber-cyan text-cyber-cyan bg-cyber-cyan/10"
                    : "border-border text-muted-foreground hover:border-cyber-cyan/40"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <Panel title="LIVE TELEMETRY" subtitle={`${filtered.length} entries · auto-tail`}>
          <div ref={ref} className="font-mono text-[12px] leading-6 max-h-[60vh] overflow-auto pr-2">
            {filtered.map((l, i) => (
              <div key={i} className={
                l.includes("[CRIT") ? "text-cyber-red text-glow-red animate-flicker" :
                l.includes("[WARN") ? "text-cyber-amber" :
                l.includes("[OK ") || l.includes("[INFO") ? "text-cyber-emerald/90" :
                "text-cyber-cyan"
              }>{l}</div>
            ))}
            <div className="text-cyber-cyan">{">"} <span className="animate-blink">█</span></div>
          </div>
        </Panel>
      </div>
    </AppLayout>
  );
}
