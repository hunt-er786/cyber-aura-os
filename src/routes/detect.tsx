import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { Panel } from "@/components/cyber/Panel";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Brain, Eye, ShieldAlert, Activity } from "lucide-react";

export const Route = createFileRoute("/detect")({
  component: Detection,
  head: () => ({
    meta: [
      { title: "Detection Center — AI Shield OS" },
      { name: "description", content: "Defense AI threat analysis and scoring." },
    ],
  }),
});

const samples = [
  { from: "ceo@yourcompany.co", subject: "Urgent: wire transfer authorization needed in next 30 min", body: "Hi, I'm in a board meeting and need you to process a vendor payment ASAP. Don't call — text only. Send to acct 8829-XX-441." },
  { from: "it-support@yourcompany-help.io", subject: "Mandatory MFA reset", body: "Your VPN access expires today. Re-authenticate at this link to avoid lockout. Confirm within 1 hour." },
  { from: "hr@yourcompany.com", subject: "Q3 performance bonus statement", body: "Please review the attached compensation letter. Reply with confirmation by EOD." },
];

function Detection() {
  const [idx, setIdx] = useState(0);
  const [scan, setScan] = useState(0);
  const sample = samples[idx];

  useEffect(() => {
    setScan(0);
    const id = setInterval(() => setScan((s) => Math.min(100, s + 4)), 60);
    return () => clearInterval(id);
  }, [idx]);

  // deterministic-ish scoring per sample
  const profile = [
    { threat: 92, conf: 96, malw: 78, urgency: 94, authority: 88, anomaly: 82, label: "PHISHING — CFO IMPERSONATION" },
    { threat: 84, conf: 91, malw: 64, urgency: 86, authority: 71, anomaly: 75, label: "CREDENTIAL HARVEST" },
    { threat: 12, conf: 98, malw: 4, urgency: 22, authority: 18, anomaly: 9,   label: "BENIGN — INTERNAL HR" },
  ][idx];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <div className="text-[11px] tracking-[0.3em] text-cyber-cyan text-glow-cyan">// DETECTION CENTER</div>
          <h1 className="mt-1 font-display text-3xl md:text-4xl">Defense AI Analysis</h1>
        </div>

        <div className="grid lg:grid-cols-5 gap-4">
          <Panel title="INBOUND SAMPLES" subtitle="select to analyze" className="lg:col-span-2">
            <div className="space-y-2">
              {samples.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className={`w-full text-left rounded-md p-3 border transition font-mono ${
                    i === idx
                      ? "border-cyber-cyan/60 bg-cyber-cyan/5"
                      : "border-border/60 hover:border-cyber-cyan/30"
                  }`}
                >
                  <div className="text-[10px] tracking-widest text-muted-foreground">FROM</div>
                  <div className="text-xs text-cyber-cyan truncate">{s.from}</div>
                  <div className="mt-1 text-[13px] text-foreground truncate">{s.subject}</div>
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="MESSAGE UNDER SCAN" subtitle={profile.label} tone={profile.threat > 50 ? "red" : "emerald"} className="lg:col-span-3">
            <div className="relative rounded-md border border-border/60 bg-card/40 p-4 overflow-hidden">
              <div className="text-[10px] tracking-widest text-muted-foreground">CONTENT</div>
              <div className="mt-2 text-sm font-mono text-foreground/90 leading-relaxed">"{sample.body}"</div>
              {/* scanning beam */}
              <motion.div
                key={idx}
                initial={{ y: -20 }}
                animate={{ y: 220 }}
                transition={{ duration: 1.6, ease: "linear" }}
                className="pointer-events-none absolute left-0 right-0 h-8"
                style={{ background: "linear-gradient(to bottom, transparent, oklch(0.85 0.18 200 / 0.4), transparent)" }}
              />
            </div>

            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2 text-[11px] font-mono">
              <Tag icon={<Eye className="size-3.5" />} k="LANGUAGE PATTERN" v={profile.threat > 50 ? "manipulative" : "neutral"} bad={profile.threat > 50} />
              <Tag icon={<Brain className="size-3.5" />} k="EMOTIONAL PRESSURE" v={profile.urgency > 50 ? "high urgency" : "low"} bad={profile.urgency > 50} />
              <Tag icon={<ShieldAlert className="size-3.5" />} k="FAKE AUTHORITY" v={profile.authority > 50 ? "impersonation" : "verified"} bad={profile.authority > 50} />
              <Tag icon={<Activity className="size-3.5" />} k="BEHAVIOR ANOMALY" v={profile.anomaly > 50 ? "off-hours · novel" : "baseline"} bad={profile.anomaly > 50} />
              <Tag icon={<Eye className="size-3.5" />} k="LINK REPUTATION" v={profile.threat > 50 ? "newly registered" : "trusted"} bad={profile.threat > 50} />
              <Tag icon={<Brain className="size-3.5" />} k="GRAMMAR ENTROPY" v={profile.threat > 50 ? "AI-generated" : "human"} bad={profile.threat > 50} />
            </div>
          </Panel>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <Score label="Threat Score" value={profile.threat} tone={profile.threat > 50 ? "red" : "emerald"} />
          <Score label="AI Confidence" value={profile.conf} tone="cyan" />
          <Score label="Malware Probability" value={profile.malw} tone={profile.malw > 50 ? "red" : "emerald"} />
          <Score label="Scan Progress" value={scan} tone="amber" />
        </div>

        <Panel title="AUTO-GENERATED ANALYSIS" subtitle="defense AI reasoning trace" tone={profile.threat > 50 ? "red" : "emerald"}>
          <div className="font-mono text-[12px] leading-6 text-foreground/90 space-y-1">
            {profile.threat > 50 ? (
              <>
                <p><span className="text-cyber-cyan">› parser:</span> tokenized 142 lexical features; detected directive verbs ("authorize", "process") with high urgency markers.</p>
                <p><span className="text-cyber-cyan">› classifier:</span> embedding nearest neighbor → "executive impersonation cluster" (cos=0.91).</p>
                <p><span className="text-cyber-cyan">› reputation:</span> sender domain age = 11d; SPF/DKIM = fail; reply-to mismatch detected.</p>
                <p><span className="text-cyber-cyan">› action:</span> quarantined · banner injected · SOC ticket #84221 opened · user notified.</p>
              </>
            ) : (
              <>
                <p><span className="text-cyber-cyan">› parser:</span> internal sender; expected cadence; benign attachment hash known-good.</p>
                <p><span className="text-cyber-cyan">› classifier:</span> matches "HR payroll" cluster (cos=0.94).</p>
                <p><span className="text-cyber-cyan">› action:</span> delivered · added to learning set as positive sample.</p>
              </>
            )}
          </div>
        </Panel>
      </div>
    </AppLayout>
  );
}

function Tag({ icon, k, v, bad }: { icon: React.ReactNode; k: string; v: string; bad: boolean }) {
  return (
    <div className={`rounded-md border px-3 py-2 ${bad ? "border-cyber-red/40 bg-cyber-red/5" : "border-cyber-emerald/30 bg-cyber-emerald/5"}`}>
      <div className="flex items-center gap-1.5 text-[10px] tracking-widest text-muted-foreground">{icon}<span>{k}</span></div>
      <div className={`mt-1 text-xs ${bad ? "text-cyber-red" : "text-cyber-emerald"}`}>{v}</div>
    </div>
  );
}

function Score({ label, value, tone }: { label: string; value: number; tone: "cyan" | "red" | "emerald" | "amber" }) {
  const color = { cyan: "var(--cyber-cyan)", red: "var(--cyber-red)", emerald: "var(--cyber-emerald)", amber: "var(--cyber-amber)" }[tone];
  return (
    <div className="glass rounded-lg p-4">
      <div className="text-[10px] tracking-[0.2em] text-muted-foreground">{label.toUpperCase()}</div>
      <div className="mt-2 flex items-baseline gap-2">
        <div className="font-display text-3xl" style={{ color, textShadow: `0 0 14px ${color}` }}>{Math.round(value)}</div>
        <div className="text-xs text-muted-foreground">/100</div>
      </div>
      <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden">
        <motion.div className="h-full" style={{ background: color }}
          initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 0.7 }} />
      </div>
    </div>
  );
}
