import { Link, useRouterState, useRouter } from "@tanstack/react-router";
import {
  Activity, Shield, Skull, Radar, Swords, BarChart3, ShieldCheck, Terminal,
  Cpu, Wifi, Lock, Bell, Menu, X, ArrowLeft, Home, Globe2, Building2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

function useCurrentNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return { path, current: nav.find((n) => n.to === path) };
}

function Topbar({ onMenu }: { onMenu: () => void }) {
  const [time, setTime] = useState<string>("");
  const router = useRouter();
  const { current } = useCurrentNav();
  useEffect(() => {
    const tick = () => setTime(new Date().toISOString().slice(11, 19));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <header className="sticky top-0 z-30 h-14 border-b border-border/60 glass flex items-center px-3 md:px-6 gap-3 md:gap-6">
      <button
        onClick={onMenu}
        className="lg:hidden inline-flex items-center justify-center size-9 rounded-md border border-cyber-cyan/40 text-cyber-cyan hover:bg-cyber-cyan/10"
        aria-label="Open menu"
      >
        <Menu className="size-4" />
      </button>
      <button
        onClick={() => router.history.back()}
        className="hidden md:inline-flex items-center gap-1.5 px-2.5 h-9 rounded-md border border-border/60 text-muted-foreground hover:text-cyber-cyan hover:border-cyber-cyan/40 text-[11px] font-mono tracking-widest"
        aria-label="Back"
      >
        <ArrowLeft className="size-3.5" /> BACK
      </button>
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 px-2.5 h-9 rounded-md border border-border/60 text-muted-foreground hover:text-cyber-cyan hover:border-cyber-cyan/40 text-[11px] font-mono tracking-widest"
      >
        <Home className="size-3.5" /> <span className="hidden sm:inline">HOME</span>
      </Link>

      <div className="hidden md:flex items-center gap-2 text-[11px] font-mono text-muted-foreground">
        <span className="text-cyber-cyan/50">/</span>
        <span className="text-cyber-cyan tracking-widest">{(current?.label || "ROOT").toUpperCase()}</span>
      </div>

      <div className="hidden xl:flex items-center gap-5 text-xs font-mono text-muted-foreground ml-2">
        <span className="flex items-center gap-1.5"><Cpu className="size-3.5 text-cyber-cyan" /> AI v4.21</span>
        <span className="flex items-center gap-1.5"><Wifi className="size-3.5 text-cyber-cyan" /> 1.2 Gbps</span>
        <span className="flex items-center gap-1.5"><Lock className="size-3.5 text-cyber-emerald" /> AES-256</span>
      </div>

      <div className="ml-auto flex items-center gap-3 md:gap-4">
        <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono">
          <span className="size-2 rounded-full bg-cyber-emerald animate-pulse" />
          <span className="text-cyber-emerald tracking-widest">ONLINE</span>
        </div>
        <Bell className="size-4 text-cyber-amber animate-pulse hidden sm:block" />
        <div className="text-[10px] md:text-xs font-mono text-cyber-cyan text-glow-cyan tracking-widest tabular-nums min-w-[64px] text-right">
          {time || "--:--:--"}
        </div>
      </div>
    </header>
  );
}

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  const { path } = useCurrentNav();
  return (
    <>
      <Link to="/" onClick={onNavigate} className="px-5 h-14 flex items-center gap-2 border-b border-sidebar-border shrink-0">
        <div className="relative size-8 rounded-md bg-gradient-to-br from-cyber-cyan to-cyber-blue grid place-items-center glow-cyan">
          <Shield className="size-4 text-background" />
        </div>
        <div className="leading-tight">
          <div className="font-display text-sm tracking-widest text-cyber-cyan text-glow-cyan">SHIELD OS</div>
          <div className="text-[10px] text-muted-foreground tracking-[0.2em]">v4.2.1 · NEXUS</div>
        </div>
      </Link>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {nav.map((item) => {
          const active = path === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={`relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-mono transition-all
                ${active
                  ? "bg-cyber-cyan/10 text-cyber-cyan text-glow-cyan border border-cyber-cyan/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50 border border-transparent"
                }`}
            >
              <item.icon className="size-4" />
              <span className="tracking-wider">{item.label.toUpperCase()}</span>
              {active && (
                <motion.span layoutId="navdot" className="ml-auto size-1.5 rounded-full bg-cyber-cyan animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 m-3 rounded-lg glass shrink-0">
        <div className="text-[10px] tracking-widest text-muted-foreground">DEFENSE AI</div>
        <div className="mt-1 font-display text-lg text-cyber-emerald text-glow-emerald">98.7%</div>
        <div className="text-[10px] text-muted-foreground">CONFIDENCE LEVEL</div>
        <div className="mt-2 h-1 rounded-full bg-secondary overflow-hidden">
          <div className="h-full w-[98.7%] bg-gradient-to-r from-cyber-emerald to-cyber-cyan animate-pulse" />
        </div>
      </div>
    </>
  );
}

function Sidebar() {
  return (
    <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar/60 backdrop-blur-xl">
      <SidebarBody />
    </aside>
  );
}

function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm lg:hidden"
          />
          <motion.aside
            initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 240 }}
            className="fixed inset-y-0 left-0 z-50 w-72 flex flex-col border-r border-sidebar-border bg-sidebar lg:hidden"
          >
            <button onClick={onClose} className="absolute top-3 right-3 size-8 grid place-items-center rounded-md border border-cyber-cyan/30 text-cyber-cyan hover:bg-cyber-cyan/10">
              <X className="size-4" />
            </button>
            <SidebarBody onNavigate={onClose} />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  // close drawer on route change
  useEffect(() => { setOpen(false); }, [path]);

  return (
    <div className="min-h-screen w-full flex grid-bg relative">
      <div className="pointer-events-none fixed inset-0 scanline opacity-20" />
      <Sidebar />
      <MobileDrawer open={open} onClose={() => setOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenu={() => setOpen(true)} />
        <main className="flex-1 p-3 md:p-6 lg:p-8 relative z-10">{children}</main>
        <footer className="px-4 py-3 border-t border-border/60 text-[10px] font-mono text-muted-foreground tracking-widest flex items-center justify-between">
          <span>© NEXUS DEFENSE · CLASSIFIED//SHIELD-OS</span>
          <span className="hidden sm:inline">SECURE CHANNEL · TLS-PQ · 256-BIT</span>
        </footer>
      </div>
    </div>
  );
}
