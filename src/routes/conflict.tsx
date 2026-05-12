import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { Panel } from "@/components/cyber/Panel";
import { conflictScript } from "@/data/cyber";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Skull, Shield, Cpu, Play, Pause, RotateCcw, FastForward, Trophy } from "lucide-react";

export const Route = createFileRoute("/conflict")({
  component: Conflict,
  head: () => ({
    meta: [
      { title: "AI vs AI — Conflict Engine" },
      { name: "description", content: "Watch attack and defense AIs battle in real time." },
    ],
  }),
});

type Line = { id: number; who: "ATTACK" | "DEFENSE" | "SYSTEM"; msg: string; ts: string };

const SPEEDS = { "1x": 1100, "2x": 600, "4x": 280 } as const;
type Speed = keyof typeof SPEEDS;

function Conflict() {
  const [lines, setLines] = useState<Line[]>([]);
  const [attackHp, setAttackHp] = useState(100);
  const [defenseHp, setDefenseHp] = useState(100);
  const [running, setRunning] = useState(true);
  const [speed, setSpeed] = useState<Speed>("1x");
  const [round, setRound] = useState(1);
  const [winner, setWinner] = useState<"DEFENSE" | "ATTACK" | null>(null);
  const idRef = useRef(0);
  const cursorRef = useRef(0);
  const logRef = useRef<HTMLDivElement>(null);

  const reset = () => {
    setLines([]); setAttackHp(100); setDefenseHp(100);
    setWinner(null); setRound((r) => r + 1);
    cursorRef.current = 0; idRef.current = 0;
    setRunning(true);
  };

  useEffect(() => {
    if (!running || winner) return;
    const id = setInterval(() => {
      const item = conflictScript[cursorRef.current % conflictScript.length];
      cursorRef.current += 1;
      idRef.current += 1;
      const ts = new Date().toISOString().slice(11, 19);
      setLines((l) => [...l, { id: idRef.current, who: item.who as Line["who"], msg: item.msg, ts }].slice(-60));
      if (item.who === "ATTACK") setDefenseHp((h) => Math.max(0, h - 4));
      else if (item.who === "DEFENSE") setAttackHp((h) => Math.max(0, h - 6));
      else { setAttackHp((h) => Math.max(0, h - 18)); setDefenseHp((h) => Math.min(100, h + 12)); }
    }, SPEEDS[speed]);
    return () => clearInterval(id);
  }, [running, speed, winner]);

  useEffect(() => {
    if (attackHp <= 0 && !winner) setWinner("DEFENSE");
    if (defenseHp <= 0 && !winner) setWinner("ATTACK");
  }, [attackHp, defenseHp, winner]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [lines]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <div className="text-[11px] tracking-[0.3em] text-cyber-cyan text-glow-cyan">// CONFLICT ENGINE · ROUND {round.toString().padStart(2, "0")}</div>
            <h1 className="mt-1 font-display text-2xl sm:text-3xl md:text-4xl">
              <span className="text-cyber-red text-glow-red">ATTACK AI</span>
              <span className="mx-2 md:mx-3 text-muted-foreground text-base md:text-2xl">vs</span>
              <span className="text-cyber-cyan text-glow-cyan">DEFENSE AI</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setRunning((r) => !r)}
              disabled={!!winner}
              className="px-3 h-9 rounded-md border border-cyber-cyan/40 text-cyber-cyan font-mono text-[11px] tracking-widest hover:bg-cyber-cyan/10 inline-flex items-center gap-2 disabled:opacity-40"
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

        <div
          className="relative rounded-xl border border-border/60 overflow-hidden p-4 sm:p-6"
          style={{ background: "var(--gradient-conflict)" }}
        >
          <div className="absolute inset-0 grid-bg-fine opacity-40 pointer-events-none" />

          <div className="relative grid grid-cols-3 gap-3 sm:gap-6 items-center">
            <Combatant side="left" name="ATTACK AI" sub="adversary.gen.v4" hp={attackHp} tone="red" icon={<Skull className="size-6 sm:size-8" />} />

            <div className="grid place-items-center">
              <motion.div
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
                className="relative size-20 sm:size-28 md:size-32 rounded-full grid place-items-center border border-cyber-cyan/40 glow-cyan"
                style={{ background: "radial-gradient(circle, oklch(0.85 0.18 200 / 0.15), transparent 70%)" }}
              >
                <Cpu className="size-7 sm:size-10 text-cyber-cyan text-glow-cyan" />
                <span className="absolute -bottom-3 text-[9px] sm:text-[10px] font-display tracking-[0.3em] text-cyber-cyan whitespace-nowrap">NEXUS CORE</span>
              </motion.div>
            </div>

            <Combatant side="right" name="DEFENSE AI" sub="shield.os.v4.21" hp={defenseHp} tone="cyan" icon={<Shield className="size-6 sm:size-8" />} />
          </div>

          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50" preserveAspectRatio="none">
            <line x1="20%" y1="50%" x2="48%" y2="50%" stroke="oklch(0.65 0.26 25)" strokeWidth="1" strokeDasharray="4 6">
              <animate attributeName="stroke-dashoffset" from="0" to="20" dur="0.8s" repeatCount="indefinite" />
            </line>
            <line x1="52%" y1="50%" x2="80%" y2="50%" stroke="oklch(0.85 0.18 200)" strokeWidth="1" strokeDasharray="4 6">
              <animate attributeName="stroke-dashoffset" from="20" to="0" dur="0.8s" repeatCount="indefinite" />
            </line>
          </svg>

          <AnimatePresence>
            {winner && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 grid place-items-center bg-background/80 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  className="text-center px-6"
                >
                  <Trophy className={`mx-auto size-12 ${winner === "DEFENSE" ? "text-cyber-emerald text-glow-emerald" : "text-cyber-red text-glow-red"}`} />
                  <div className={`mt-4 font-display text-2xl sm:text-4xl tracking-widest ${winner === "DEFENSE" ? "text-cyber-emerald text-glow-emerald" : "text-cyber-red text-glow-red"}`}>
                    {winner} AI WINS
                  </div>
                  <div className="mt-2 text-xs font-mono text-muted-foreground">
                    {winner === "DEFENSE" ? "Threat fully neutralized · learning checkpoint saved" : "Defense breach detected · failover protocols engaged"}
                  </div>
                  <div className="mt-5 flex items-center justify-center gap-3">
                    <button onClick={reset} className="px-4 h-10 rounded-md bg-cyber-cyan text-background font-display text-xs tracking-[0.2em] hover:scale-[1.02] transition">
                      NEW ROUND
                    </button>
                    {winner === "DEFENSE" && (
                      <Link to="/shield" className="px-4 h-10 inline-flex items-center rounded-md border border-cyber-emerald/50 text-cyber-emerald font-display text-xs tracking-[0.2em] hover:bg-cyber-emerald/10">
                        GO TO SHIELD
                      </Link>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Panel
          title="COMBAT TELEMETRY"
          subtitle="real-time conflict log"
          right={<span className="text-[10px] tracking-widest text-cyber-emerald animate-pulse">● {running && !winner ? "LIVE" : "PAUSED"}</span>}
        >
          <div ref={logRef} className="font-mono text-[11px] sm:text-[12px] leading-6 max-h-[420px] overflow-auto pr-2">
            <AnimatePresence initial={false}>
              {lines.map((l) => (
                <motion.div
                  key={l.id}
                  initial={{ opacity: 0, x: l.who === "ATTACK" ? -16 : l.who === "DEFENSE" ? 16 : 0 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex flex-wrap gap-x-3"
                >
                  <span className="text-muted-foreground tabular-nums">{l.ts}</span>
                  <span className={
                    l.who === "ATTACK"  ? "text-cyber-red text-glow-red w-20 sm:w-24" :
                    l.who === "DEFENSE" ? "text-cyber-cyan text-glow-cyan w-20 sm:w-24" :
                    "text-cyber-emerald text-glow-emerald w-20 sm:w-24"
                  }>{l.who}:</span>
                  <span className="text-foreground/90 flex-1 min-w-0 break-words">{l.msg}</span>
                </motion.div>
              ))}
            </AnimatePresence>
            {lines.length === 0 && (
              <div className="text-muted-foreground">{">"} awaiting engagement...</div>
            )}
            <div className="text-cyber-cyan">{">"} <span className="animate-blink">█</span></div>
          </div>
        </Panel>
      </div>
    </AppLayout>
  );
}

function Combatant({
  side, name, sub, hp, tone, icon,
}: { side: "left" | "right"; name: string; sub: string; hp: number; tone: "red" | "cyan"; icon: React.ReactNode }) {
  const color = tone === "red" ? "text-cyber-red text-glow-red" : "text-cyber-cyan text-glow-cyan";
  const bar = tone === "red" ? "from-cyber-red to-cyber-amber" : "from-cyber-cyan to-cyber-blue";
  return (
    <div className={`relative ${side === "right" ? "text-right" : ""}`}>
      <div className={`inline-flex items-center gap-2 sm:gap-3 ${side === "right" ? "flex-row-reverse" : ""}`}>
        <div className={`size-12 sm:size-16 rounded-lg grid place-items-center glass ${tone === "red" ? "border-cyber-red/40" : "border-cyber-cyan/40"}`}>
          <span className={color}>{icon}</span>
        </div>
        <div className={side === "right" ? "text-right" : ""}>
          <div className={`font-display text-sm sm:text-xl tracking-widest ${color}`}>{name}</div>
          <div className="text-[9px] sm:text-[10px] tracking-widest text-muted-foreground font-mono">{sub}</div>
        </div>
      </div>
      <div className="mt-3 sm:mt-4 space-y-1">
        <div className="flex items-center justify-between text-[10px] tracking-widest text-muted-foreground">
          <span>INTEGRITY</span><span className="tabular-nums">{Math.round(hp)}%</span>
        </div>
        <div className="h-2 rounded-full bg-secondary overflow-hidden">
          <motion.div className={`h-full bg-gradient-to-r ${bar}`} animate={{ width: `${hp}%` }} transition={{ duration: 0.5 }} />
        </div>
      </div>
    </div>
  );
}
