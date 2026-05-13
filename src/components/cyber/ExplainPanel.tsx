import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Loader2, ShieldAlert, Activity, AlertTriangle } from "lucide-react";
import { analyzeThreat } from "@/lib/ai.functions";
import type { CyberEvent } from "@/lib/cyber-engine";

type Analysis = {
  verdict: "MALICIOUS" | "SUSPICIOUS" | "BENIGN";
  confidence: number;
  summary: string;
  reasons: string[];
  recommended_actions: string[];
  escalation_probability: number;
  predicted_next_step: string;
};

export function ExplainPanel({ event }: { event: CyberEvent | null }) {
  const [busy, setBusy] = useState(false);
  const [a, setA] = useState<Analysis | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const analyze = useServerFn(analyzeThreat);

  async function run() {
    if (!event || busy) return;
    setBusy(true); setErr(null); setA(null);
    try {
      const res = await analyze({ data: { event: {
        vector: event.vector, severity: event.severity, srcIp: event.srcIp, dstIp: event.dstIp,
        port: event.port, protocol: event.protocol, mitre: event.mitre, cve: event.cve, region: event.region,
        reasons: event.reasons,
      } } });
      setA(res.analysis as Analysis);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Analysis failed");
    } finally { setBusy(false); }
  }

  const tone = a?.verdict === "MALICIOUS" ? "red" : a?.verdict === "SUSPICIOUS" ? "amber" : "emerald";
  const toneCls = tone === "red" ? "text-cyber-red text-glow-red" : tone === "amber" ? "text-cyber-amber" : "text-cyber-emerald text-glow-emerald";

  return (
    <div className="space-y-3">
      <button
        onClick={run}
        disabled={!event || busy}
        className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-md border border-cyber-cyan/40 bg-cyber-cyan/10 text-cyber-cyan text-glow-cyan font-display tracking-[0.2em] text-xs hover:bg-cyber-cyan/15 disabled:opacity-50"
      >
        {busy ? <Loader2 className="size-4 animate-spin" /> : <Brain className="size-4" />}
        {busy ? "NEXUS ANALYZING..." : "EXPLAIN WITH AI"}
      </button>

      {err && <div className="text-[12px] font-mono text-cyber-red border border-cyber-red/30 rounded-md p-2">{err}</div>}

      <AnimatePresence>
        {a && (
          <motion.div
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2">
              <ShieldAlert className={`size-4 ${toneCls}`} />
              <div className={`font-display text-lg ${toneCls}`}>{a.verdict}</div>
              <div className="ml-auto text-[10px] font-mono text-muted-foreground">CONF · <span className="text-foreground">{Math.round(a.confidence * 100)}%</span></div>
            </div>

            <div className="text-[12.5px] font-mono text-foreground/90 leading-relaxed border-l-2 border-cyber-cyan/50 pl-3">
              {a.summary}
            </div>

            <div>
              <div className="text-[10px] tracking-[0.25em] text-muted-foreground mb-1">REASONS</div>
              <ul className="space-y-1 text-[12px] font-mono">
                {a.reasons.map((r, i) => (
                  <li key={i} className="flex gap-2"><span className="text-cyber-cyan">▸</span><span className="text-foreground/85">{r}</span></li>
                ))}
              </ul>
            </div>

            <div>
              <div className="text-[10px] tracking-[0.25em] text-muted-foreground mb-1 flex items-center gap-1.5"><Activity className="size-3" /> RECOMMENDED COUNTERMEASURES</div>
              <ul className="space-y-1 text-[12px] font-mono">
                {a.recommended_actions.map((r, i) => (
                  <li key={i} className="flex gap-2"><span className="text-cyber-emerald">▸</span><span className="text-foreground/85">{r}</span></li>
                ))}
              </ul>
            </div>

            <div className="rounded-md border border-cyber-amber/30 bg-cyber-amber/5 p-2.5">
              <div className="flex items-center gap-1.5 text-[10px] tracking-[0.25em] text-cyber-amber"><AlertTriangle className="size-3" /> ESCALATION FORECAST</div>
              <div className="mt-1 text-[12px] font-mono text-foreground/90">{a.predicted_next_step}</div>
              <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyber-amber to-cyber-red" style={{ width: `${Math.round(a.escalation_probability * 100)}%` }} />
              </div>
              <div className="mt-1 text-right text-[10px] font-mono text-cyber-amber">{Math.round(a.escalation_probability * 100)}% probability</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
