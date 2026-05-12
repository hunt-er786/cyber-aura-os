import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useRouterState, Link } from "@tanstack/react-router";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Play, Square, Volume2, VolumeX, Sparkles, Captions, CaptionsOff } from "lucide-react";

function splitNarration(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

type Step = {
  to: string;
  title: string;
  narration: string;
  duration: number; // ms on this screen
};

const SCRIPT: Step[] = [
  {
    to: "/dashboard",
    title: "Command Center",
    narration:
      "Welcome to A.I. Shield O.S. Initializing executive command center. Telemetry online across fourteen thousand perimeter nodes.",
    duration: 9000,
  },
  {
    to: "/attack",
    title: "Adversary Simulator",
    narration:
      "Adversary AI is now generating polymorphic threats. Phishing, ransomware, and zero-day vectors mutating in real time.",
    duration: 9000,
  },
  {
    to: "/detect",
    title: "Detection Engine",
    narration:
      "Defense AI engaged. Neural classifiers analyzing every packet. Confidence levels exceeding ninety-eight percent.",
    duration: 9000,
  },
  {
    to: "/conflict",
    title: "Adversarial Console",
    narration:
      "Live AI versus AI engagement. Threat surface contracting as defense posture adapts each cycle.",
    duration: 10000,
  },
  {
    to: "/analytics",
    title: "Threat Analytics",
    narration:
      "Aggregated intelligence across regions and sectors. Defense capability radar leading attack surface in five of six domains.",
    duration: 9000,
  },
  {
    to: "/shield",
    title: "Shield Activation",
    narration:
      "All vectors neutralized. Shield posture nominal. Demonstration complete.",
    duration: 8000,
  },
];

const STORAGE_KEY = "shield-os.demo";


type DemoState = {
  active: boolean;
  step: number;
  muted: boolean;
  captions: boolean;
};

function readState(): DemoState {
  if (typeof window === "undefined") return { active: false, step: 0, muted: false, captions: true };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { active: false, step: 0, muted: false, captions: true };
    return { active: false, step: 0, muted: false, captions: true, ...JSON.parse(raw) };
  } catch {
    return { active: false, step: 0, muted: false, captions: true };
  }
}

function writeState(s: DemoState) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {}
}

function speak(text: string, muted: boolean) {
  if (muted) return;
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1.02;
    u.pitch = 0.85;
    u.volume = 1;
    const voices = window.speechSynthesis.getVoices();
    const preferred =
      voices.find((v) => /Google US English/i.test(v.name)) ||
      voices.find((v) => /en-?US/i.test(v.lang) && /female|samantha|victoria/i.test(v.name)) ||
      voices.find((v) => /en/i.test(v.lang));
    if (preferred) u.voice = preferred;
    window.speechSynthesis.speak(u);
  } catch {}
}

export function DemoController() {
  const router = useRouter();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [state, setState] = useState<DemoState>(() => readState());
  const timerRef = useRef<number | null>(null);

  // Persist
  useEffect(() => { writeState(state); }, [state]);

  // Warm up voices (some browsers load async)
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
      const handler = () => window.speechSynthesis.getVoices();
      window.speechSynthesis.addEventListener?.("voiceschanged", handler);
      return () => window.speechSynthesis.removeEventListener?.("voiceschanged", handler);
    }
  }, []);

  // Drive the demo
  useEffect(() => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    if (!state.active) return;

    const step = SCRIPT[state.step];
    if (!step) {
      stop();
      return;
    }

    // Navigate if not on the right route
    if (path !== step.to) {
      router.navigate({ to: step.to });
      // wait a beat for route to mount, then narrate
      timerRef.current = window.setTimeout(() => {
        speak(step.narration, state.muted);
      }, 600);
    } else {
      speak(step.narration, state.muted);
    }

    // Schedule next step
    const advance = window.setTimeout(() => {
      setState((s) => ({ ...s, step: s.step + 1 }));
    }, step.duration);

    return () => {
      clearTimeout(advance);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.active, state.step, state.muted]);

  // If user manually navigates while demo is active, sync the step to the new route
  useEffect(() => {
    if (!state.active) return;
    const idx = SCRIPT.findIndex((s) => s.to === path);
    if (idx >= 0 && idx !== state.step) {
      setState((s) => ({ ...s, step: idx }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  const start = () => {
    setState({ active: true, step: 0, muted: state.muted, captions: state.captions });
  };
  const stop = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setState({ active: false, step: 0, muted: state.muted, captions: state.captions });
  };
  const toggleMute = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setState((s) => ({ ...s, muted: !s.muted }));
  };
  const toggleCaptions = () => setState((s) => ({ ...s, captions: !s.captions }));

  return (
    <>
      {/* Floating launcher (hidden while active) */}
      <AnimatePresence>
        {!state.active && (
          <motion.button
            key="launch"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={start}
            className="fixed bottom-5 right-5 z-50 group inline-flex items-center gap-2 px-4 py-2.5 rounded-full
                       bg-gradient-to-r from-cyber-cyan to-cyber-blue text-background font-display
                       text-xs tracking-[0.25em] glow-cyan hover:scale-[1.04] transition-transform shadow-lg"
            aria-label="Start demo mode"
          >
            <Sparkles className="size-4" />
            DEMO MODE
            <Play className="size-3.5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Active HUD */}
      <AnimatePresence>
        {state.active && (
          <motion.div
            key="hud"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[min(560px,calc(100vw-1.5rem))]
                       glass border border-cyber-cyan/40 rounded-xl p-3 shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="relative size-9 rounded-md bg-cyber-cyan/15 grid place-items-center">
                <Sparkles className="size-4 text-cyber-cyan" />
                <span className="absolute inset-0 rounded-md border border-cyber-cyan/40 animate-pulse" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] tracking-[0.3em] text-cyber-cyan text-glow-cyan">
                  DEMO · STEP {state.step + 1}/{SCRIPT.length}
                </div>
                <div className="font-mono text-sm text-foreground truncate">
                  {SCRIPT[state.step]?.title ?? "Complete"}
                </div>
              </div>
              <button
                onClick={toggleMute}
                className="size-9 grid place-items-center rounded-md border border-border/60 text-muted-foreground hover:text-cyber-cyan hover:border-cyber-cyan/40"
                aria-label={state.muted ? "Unmute narration" : "Mute narration"}
              >
                {state.muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
              </button>
              <button
                onClick={stop}
                className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-cyber-red/50 text-cyber-red hover:bg-cyber-red/10 text-[11px] font-mono tracking-widest"
              >
                <Square className="size-3.5" /> STOP
              </button>
            </div>
            {/* progress */}
            <div className="mt-2 h-1 rounded-full bg-secondary overflow-hidden">
              <motion.div
                key={state.step}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: (SCRIPT[state.step]?.duration ?? 8000) / 1000, ease: "linear" }}
                className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-blue"
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-muted-foreground tracking-widest">
              <span>AUTO-PILOT · NARRATED</span>
              <div className="flex items-center gap-1.5">
                {SCRIPT.map((s, i) => (
                  <Link
                    key={s.to}
                    to={s.to}
                    className={`size-1.5 rounded-full ${i === state.step ? "bg-cyber-cyan" : i < state.step ? "bg-cyber-emerald/70" : "bg-muted-foreground/30"}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
