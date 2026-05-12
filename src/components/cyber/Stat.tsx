import { ReactNode } from "react";

export function Stat({
  label, value, delta, icon, tone = "cyan",
}: {
  label: string; value: ReactNode; delta?: string; icon?: ReactNode;
  tone?: "cyan" | "red" | "emerald" | "amber";
}) {
  const colorMap = {
    cyan: "text-cyber-cyan text-glow-cyan",
    red: "text-cyber-red text-glow-red",
    emerald: "text-cyber-emerald text-glow-emerald",
    amber: "text-cyber-amber",
  } as const;
  return (
    <div className="relative glass rounded-lg p-4 overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="text-[10px] tracking-[0.2em] text-muted-foreground">{label.toUpperCase()}</div>
        {icon && <div className={colorMap[tone]}>{icon}</div>}
      </div>
      <div className={`mt-2 font-display text-3xl ${colorMap[tone]}`}>{value}</div>
      {delta && <div className="mt-1 text-[11px] text-muted-foreground font-mono">{delta}</div>}
      <div className="absolute -bottom-8 -right-8 size-24 rounded-full opacity-30 blur-2xl"
        style={{ background: tone === "red" ? "var(--cyber-red)" : tone === "emerald" ? "var(--cyber-emerald)" : tone === "amber" ? "var(--cyber-amber)" : "var(--cyber-cyan)" }} />
    </div>
  );
}
