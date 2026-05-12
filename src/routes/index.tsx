import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Shield, Power, Cpu, Lock, Activity } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  component: Intro,
  head: () => ({
    meta: [
      { title: "AI Shield OS — Boot Sequence" },
      { name: "description", content: "Boot the AI Shield OS cyber defense operating system." },
    ],
  }),
});

const bootLines = [
  "[BOOT] Loading kernel module shield-os.4.2.1.ko ...",
  "[CRYP] Negotiating post-quantum lattice handshake — OK",
  "[NEUR] Mounting Defense AI weights · 4.2B parameters",
  "[MESH] Telemetry uplink to 14,221 perimeter nodes",
  "[VOIC] Audio sentinel calibrated · 16kHz multi-band",
  "[INIT] Holographic interface ready",
  "[OK  ] All systems nominal — operator clearance required",
];

function Intro() {
  const [shown, setShown] = useState<string[]>([]);
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i++;
      setShown(bootLines.slice(0, i));
      if (i >= bootLines.length) clearInterval(id);
    }, 380);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen w-full grid-bg relative overflow-hidden flex items-center justify-center px-6">
      <div className="pointer-events-none absolute inset-0 scanline" />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 size-[700px] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--cyber-cyan), transparent 70%)" }}
      />

      <div className="relative z-10 max-w-5xl w-full grid lg:grid-cols-[1fr_auto] gap-10 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyber-cyan/40 text-[11px] font-mono tracking-[0.3em] text-cyber-cyan text-glow-cyan"
          >
            <span className="size-1.5 rounded-full bg-cyber-emerald animate-pulse" />
            SECURE BOOT · NEXUS FRAMEWORK
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="mt-6 font-display text-5xl md:text-7xl leading-[1.05] tracking-tight"
          >
            <span className="text-foreground">AI</span>{" "}
            <span className="text-cyber-cyan text-glow-cyan">SHIELD</span>{" "}
            <span className="text-foreground">OS</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="mt-4 max-w-xl text-sm md:text-base text-muted-foreground font-mono leading-relaxed"
          >
            An autonomous cyber defense operating system where attack AI and defense AI
            wage war in real time. Witness threats mutate, neutralize, and adapt across
            the global mesh — from the operator chair.
          </motion.p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/dashboard"
              className="group relative inline-flex items-center gap-3 px-6 py-3 hex-clip bg-gradient-to-r from-cyber-cyan to-cyber-blue text-background font-display tracking-[0.2em] text-sm glow-cyan hover:scale-[1.02] transition-transform"
            >
              <Power className="size-4" />
              ENTER SIMULATION
            </Link>
            <Link
              to="/conflict"
              className="inline-flex items-center gap-3 px-5 py-3 rounded-md border border-cyber-cyan/40 text-cyber-cyan font-mono text-xs tracking-[0.2em] hover:bg-cyber-cyan/10"
            >
              <Activity className="size-4" /> WATCH AI vs AI
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4 max-w-md text-[10px] tracking-[0.2em] text-muted-foreground">
            <Spec icon={<Cpu className="size-3.5" />} k="NEURAL" v="4.2B" />
            <Spec icon={<Lock className="size-3.5" />} k="CRYPTO" v="PQ-LATTICE" />
            <Spec icon={<Shield className="size-3.5" />} k="UPTIME" v="99.998%" />
          </div>
        </div>

        {/* Holographic shield */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 1 }}
          className="relative mx-auto"
        >
          <div className="relative size-72 md:size-96 grid place-items-center">
            <div className="absolute inset-0 rounded-full border border-cyber-cyan/40 animate-radar" style={{ borderRightColor: "transparent" }} />
            <div className="absolute inset-6 rounded-full border border-cyber-cyan/20" />
            <div className="absolute inset-12 rounded-full border border-cyber-cyan/15" />
            <div className="absolute inset-0 rounded-full opacity-50 blur-2xl" style={{ background: "radial-gradient(circle, var(--cyber-cyan), transparent 60%)" }} />
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10"
            >
              <Shield className="size-40 md:size-56 text-cyber-cyan text-glow-cyan" strokeWidth={1.2} />
            </motion.div>
            {/* orbiting particles */}
            {[0, 1, 2, 3].map((i) => (
              <motion.span
                key={i}
                className="absolute size-2 rounded-full bg-cyber-cyan glow-cyan"
                style={{ top: "50%", left: "50%" }}
                animate={{ rotate: 360 }}
                transition={{ duration: 6 + i * 2, repeat: Infinity, ease: "linear" }}
              >
                <span className="block" style={{ transform: `translate(${110 + i * 20}px, 0)` }} />
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Boot terminal */}
      <div className="absolute bottom-6 left-6 right-6 max-w-2xl mx-auto glass rounded-md p-4 font-mono text-[11px] text-cyber-emerald/90">
        {shown.map((l) => (
          <div key={l}>{l}</div>
        ))}
        <div className="text-cyber-cyan">
          {">"} <span className="animate-blink">█</span>
        </div>
      </div>
    </div>
  );
}

function Spec({ icon, k, v }: { icon: React.ReactNode; k: string; v: string }) {
  return (
    <div className="glass rounded-md p-3">
      <div className="flex items-center gap-1.5 text-cyber-cyan">{icon}<span>{k}</span></div>
      <div className="mt-1 font-display text-sm text-foreground tracking-wider">{v}</div>
    </div>
  );
}
