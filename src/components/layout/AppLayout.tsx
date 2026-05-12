import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity, Shield, Skull, Radar, Swords, BarChart3, ShieldCheck, Terminal,
  Cpu, Wifi, Lock, Bell,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const nav = [
  { to: "/dashboard", label: "Command", icon: Activity },
  { to: "/attack", label: "Attack Sim", icon: Skull },
  { to: "/detect", label: "Detection", icon: Radar },
  { to: "/conflict", label: "AI vs AI", icon: Swords },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/shield", label: "Shield", icon: ShieldCheck },
  { to: "/logs", label: "Logs", icon: Terminal },
];

function Topbar() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <header className="sticky top-0 z-30 h-14 border-b border-border/60 glass flex items-center px-6 gap-6">
      <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
        <span className="inline-block size-2 rounded-full bg-cyber-emerald animate-pulse" />
        SYSTEM ONLINE
      </div>
      <div className="hidden md:flex items-center gap-5 text-xs font-mono text-muted-foreground">
        <span className="flex items-center gap-1.5"><Cpu className="size-3.5 text-cyber-cyan" /> AI v4.21</span>
        <span className="flex items-center gap-1.5"><Wifi className="size-3.5 text-cyber-cyan" /> 1.2 Gbps</span>
        <span className="flex items-center gap-1.5"><Lock className="size-3.5 text-cyber-emerald" /> AES-256</span>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <Bell className="size-4 text-cyber-amber animate-pulse" />
        <div className="text-xs font-mono text-cyber-cyan text-glow-cyan tracking-widest">
          {time.toISOString().replace("T", " ").slice(0, 19)} UTC
        </div>
      </div>
    </header>
  );
}

function Sidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar/60 backdrop-blur-xl">
      <Link to="/" className="px-5 h-14 flex items-center gap-2 border-b border-sidebar-border">
        <div className="relative size-8 rounded-md bg-gradient-to-br from-cyber-cyan to-cyber-blue grid place-items-center glow-cyan">
          <Shield className="size-4 text-background" />
        </div>
        <div className="leading-tight">
          <div className="font-display text-sm tracking-widest text-cyber-cyan text-glow-cyan">SHIELD OS</div>
          <div className="text-[10px] text-muted-foreground tracking-[0.2em]">v4.2.1 · NEXUS</div>
        </div>
      </Link>
      <nav className="flex-1 p-3 space-y-1">
        {nav.map((item) => {
          const active = path === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-mono transition-all
                ${active
                  ? "bg-cyber-cyan/10 text-cyber-cyan text-glow-cyan border border-cyber-cyan/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50 border border-transparent"
                }`}
            >
              <item.icon className="size-4" />
              <span className="tracking-wider">{item.label.toUpperCase()}</span>
              {active && (
                <motion.span
                  layoutId="navdot"
                  className="ml-auto size-1.5 rounded-full bg-cyber-cyan animate-pulse"
                />
              )}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 m-3 rounded-lg glass">
        <div className="text-[10px] tracking-widest text-muted-foreground">DEFENSE AI</div>
        <div className="mt-1 font-display text-lg text-cyber-emerald text-glow-emerald">98.7%</div>
        <div className="text-[10px] text-muted-foreground">CONFIDENCE LEVEL</div>
        <div className="mt-2 h-1 rounded-full bg-secondary overflow-hidden">
          <div className="h-full w-[98.7%] bg-gradient-to-r from-cyber-emerald to-cyber-cyan animate-pulse" />
        </div>
      </div>
    </aside>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex grid-bg relative">
      <div className="pointer-events-none fixed inset-0 scanline opacity-60" />
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 p-4 md:p-6 lg:p-8 relative z-10">{children}</main>
      </div>
    </div>
  );
}
