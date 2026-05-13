import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, X, Sparkles, Loader2 } from "lucide-react";
import { copilotChat } from "@/lib/ai.functions";
import { useCyberEngine } from "@/lib/cyber-engine";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Summarize current threat posture",
  "Why is the latest event suspicious?",
  "Predict the next 60 seconds",
  "Recommend autonomous countermeasures",
];

export function Copilot() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "NEXUS online. I am your autonomous cyber copilot. Ask me to classify threats, explain anomalies, predict escalation, or recommend countermeasures.",
    },
  ]);
  const chat = useServerFn(copilotChat);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  async function send(text: string) {
    const t = text.trim();
    if (!t || busy) return;
    setInput("");
    const next: Msg[] = [...messages, { role: "user", content: t }];
    setMessages(next);
    setBusy(true);
    try {
      const s = useCyberEngine.getState();
      const last = s.events.slice(0, 6).map(
        (e) => `${e.vector}|sev=${e.severity}|conf=${e.confidence}|${e.srcIp}->${e.dstIp}:${e.port}|${e.mitre}${e.cve ? "|" + e.cve : ""}|${e.blocked ? "BLOCKED" : "OPEN"}`,
      ).join("\n");
      const ctx = `intensity=${s.intensity.toFixed(2)} defensePosture=${s.defensePosture.toFixed(2)} threats=${s.threats} mitigated=${s.mitigated}\nrecent_events:\n${last}`;
      const { reply } = await chat({ data: { messages: next.map((m) => ({ role: m.role, content: m.content })), context: ctx } });
      setMessages((m) => [...m, { role: "assistant", content: reply || "(no response)" }]);
    } catch (e) {
      setMessages((m) => [...m, { role: "assistant", content: `⚠ ${e instanceof Error ? e.message : "AI request failed"}` }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-5 left-5 z-40 group inline-flex items-center gap-2 px-4 h-11 rounded-full glass border border-cyber-cyan/40 text-cyber-cyan text-glow-cyan font-display tracking-widest text-xs hover:bg-cyber-cyan/10"
          >
            <span className="relative flex size-2.5">
              <span className="absolute inset-0 rounded-full bg-cyber-cyan animate-ping opacity-60" />
              <span className="relative size-2.5 rounded-full bg-cyber-cyan" />
            </span>
            <Bot className="size-4" /> NEXUS COPILOT
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ type: "spring", damping: 26, stiffness: 240 }}
            className="fixed bottom-5 left-5 z-40 w-[min(420px,calc(100vw-2.5rem))] h-[min(620px,calc(100vh-2.5rem))] flex flex-col rounded-xl glass border border-cyber-cyan/40 overflow-hidden"
            style={{ boxShadow: "0 0 60px oklch(0.85 0.18 200 / 0.25)" }}
          >
            <div className="flex items-center gap-2 px-4 h-12 border-b border-cyber-cyan/20 shrink-0">
              <div className="relative size-7 rounded-md bg-gradient-to-br from-cyber-cyan to-cyber-blue grid place-items-center">
                <Bot className="size-3.5 text-background" />
              </div>
              <div className="leading-tight">
                <div className="text-[11px] font-display tracking-[0.25em] text-cyber-cyan text-glow-cyan">NEXUS COPILOT</div>
                <div className="text-[9px] font-mono text-muted-foreground tracking-widest">NEURAL · v4.21 · ONLINE</div>
              </div>
              <button onClick={() => setOpen(false)} className="ml-auto size-7 grid place-items-center rounded-md border border-border/60 text-muted-foreground hover:text-cyber-cyan hover:border-cyber-cyan/40">
                <X className="size-3.5" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[88%] rounded-lg px-3 py-2 text-[12.5px] leading-relaxed font-mono whitespace-pre-wrap ${
                      m.role === "user"
                        ? "bg-cyber-cyan/15 border border-cyber-cyan/30 text-foreground"
                        : "bg-card/60 border border-border/60 text-foreground/90"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {busy && (
                <div className="flex items-center gap-2 text-[11px] font-mono text-cyber-cyan">
                  <Loader2 className="size-3.5 animate-spin" /> NEXUS reasoning...
                </div>
              )}
            </div>

            {messages.length <= 1 && (
              <div className="px-3 pb-2 grid grid-cols-2 gap-1.5">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-left text-[10.5px] font-mono px-2 py-1.5 rounded-md border border-border/60 text-muted-foreground hover:text-cyber-cyan hover:border-cyber-cyan/40"
                  >
                    <Sparkles className="size-3 inline mr-1 text-cyber-cyan" />
                    {s}
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="border-t border-cyber-cyan/20 p-2 flex items-center gap-2 shrink-0"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Query NEXUS..."
                className="flex-1 bg-transparent outline-none text-sm font-mono px-2 py-2 placeholder:text-muted-foreground/60"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                className="size-9 grid place-items-center rounded-md bg-cyber-cyan/15 border border-cyber-cyan/40 text-cyber-cyan hover:bg-cyber-cyan/25 disabled:opacity-40"
              >
                <Send className="size-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
