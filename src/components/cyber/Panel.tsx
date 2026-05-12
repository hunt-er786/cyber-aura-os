import { ReactNode } from "react";

export function Panel({
  title, subtitle, right, children, tone = "cyan", className = "",
}: {
  title?: string; subtitle?: string; right?: ReactNode; children: ReactNode;
  tone?: "cyan" | "red" | "emerald" | "amber"; className?: string;
}) {
  const toneMap = {
    cyan: "border-cyber-cyan/30",
    red: "border-cyber-red/40",
    emerald: "border-cyber-emerald/40",
    amber: "border-cyber-amber/40",
  } as const;
  const dotMap = {
    cyan: "bg-cyber-cyan", red: "bg-cyber-red", emerald: "bg-cyber-emerald", amber: "bg-cyber-amber",
  } as const;
  return (
    <div className={`relative glass rounded-lg ${toneMap[tone]} ${className}`}>
      {title && (
        <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border/60">
          <span className={`size-2 rounded-full ${dotMap[tone]} animate-pulse`} />
          <div className="flex-1">
            <div className="text-[11px] font-display tracking-[0.2em] text-foreground">{title}</div>
            {subtitle && <div className="text-[10px] text-muted-foreground tracking-widest mt-0.5">{subtitle}</div>}
          </div>
          {right}
        </div>
      )}
      <div className="p-4">{children}</div>
      {/* Corner ticks */}
      {(["tl","tr","bl","br"] as const).map((c) => (
        <span key={c}
          className={`pointer-events-none absolute size-3 border-cyber-cyan/60 ${
            c === "tl" ? "top-0 left-0 border-t border-l" :
            c === "tr" ? "top-0 right-0 border-t border-r" :
            c === "bl" ? "bottom-0 left-0 border-b border-l" :
            "bottom-0 right-0 border-b border-r"
          }`}
        />
      ))}
    </div>
  );
}
