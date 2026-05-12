import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { Panel } from "@/components/cyber/Panel";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, Database, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/shield")({
  component: ShieldPage,
  head: () => ({
    meta: [
      { title: "Shield Activation — AI Shield OS" },
      { name: "description", content: "Threat neutralized. Systems secured." },
    ],
  }),
});

const recoveryLogs = [
  "[OK ] Threat surface contracted to zero",
  "[OK ] 14,221 nodes reporting nominal",
  "[OK ] Encrypted state restored from snapshot 42-A",
  "[OK ] Defense AI checkpoint saved · learning rate +0.004",
  "[OK ] User-facing systems fully online",
];

function ShieldPage() {
  const [shown, setShown] = useState<string[]>([]);
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i++;
      setShown(recoveryLogs.slice(0, i));
      if (i >= recoveryLogs.length) clearInterval(id);
    }, 500);
    return () => clearInterval(id);
  }, []);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] tracking-[0.3em] text-cyber-emerald text-glow-emerald"
          >// SHIELD ACTIVATION</motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-2 font-display text-4xl md:text-6xl"
          >
            <span className="text-cyber-emerald text-glow-emerald">SYSTEM SECURED</span>
          </motion.h1>
          <p className="mt-3 text-sm md:text-base text-muted-foreground font-mono max-w-xl mx-auto">
            All adversarial vectors neutralized. Data integrity verified. Defense AI standing post.
          </p>
        </div>

        {/* Big shield */}
        <div className="relative grid place-items-center py-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 rounded-full opacity-60 blur-3xl" style={{ background: "radial-gradient(circle, var(--cyber-emerald), transparent 60%)" }} />
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-full border border-cyber-emerald/30"
                animate={{ scale: [1, 1.6, 2.2], opacity: [0.7, 0.3, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: i }}
              />
            ))}
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }}>
              <ShieldCheck className="size-56 md:size-72 text-cyber-emerald text-glow-emerald" strokeWidth={1.1} />
            </motion.div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: ShieldCheck, k: "Threat Neutralized", v: "412 vectors closed" },
            { icon: Lock, k: "Data Protected", v: "all volumes encrypted" },
            { icon: Database, k: "State Restored", v: "snapshot 42-A · clean" },
          ].map((c) => (
            <div key={c.k} className="glass rounded-lg p-5 border-cyber-emerald/30">
              <c.icon className="size-6 text-cyber-emerald" />
              <div className="mt-3 font-display tracking-widest text-cyber-emerald text-glow-emerald">{c.k.toUpperCase()}</div>
              <div className="text-xs font-mono text-muted-foreground mt-1">{c.v}</div>
            </div>
          ))}
        </div>

        <Panel title="RECOVERY LOG" subtitle="post-engagement system audit" tone="emerald">
          <div className="font-mono text-[12px] leading-6">
            {shown.map((l) => (
              <div key={l} className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 text-cyber-emerald" />
                <span className="text-cyber-emerald/90">{l}</span>
              </div>
            ))}
            <div className="text-cyber-emerald">{">"} <span className="animate-blink">█</span></div>
          </div>
        </Panel>

        <div className="text-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-3 px-6 py-3 hex-clip bg-gradient-to-r from-cyber-emerald to-cyber-cyan text-background font-display tracking-[0.2em] text-sm glow-emerald hover:scale-[1.02] transition-transform"
          >
            <ShieldCheck className="size-4" />
            RETURN TO COMMAND
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
